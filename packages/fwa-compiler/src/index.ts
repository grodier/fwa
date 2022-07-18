import * as esbuild from "esbuild";
import path from "node:path";
import fs from "node:fs";
import chokidar from "chokidar";
import debounce from "lodash.debounce";

export interface FwaConfig {
  rootDirectory: string;
  routeDirectory: string;
  routes: RouteManifest;
  buildPath: string;
}

interface RouteManifest {
  [routeId: string]: {
    filePath: string;
    serverPath: string;
  };
}

export interface RouteAssetManifest {
  [routeId: string]: {
    modulePath: string;
    serverPath: string;
  };
}

function generateRouteAssetManifest(
  config: FwaConfig,
  metafile: esbuild.Metafile
): RouteAssetManifest {
  let assetManifest: RouteAssetManifest = {};
  for (const [routeOutputKey, { entryPoint }] of Object.entries(
    metafile.outputs
  )) {
    if (entryPoint) {
      const routeName = path.basename(entryPoint, path.extname(entryPoint));
      assetManifest[routeName] = {
        serverPath: config.routes[routeName].serverPath,
        modulePath: path.resolve(config.rootDirectory, routeOutputKey),
      };
    }
  }
  return assetManifest;
}

interface BuildOptions {
  incremental?: boolean;
}

export async function build(config: FwaConfig, options?: BuildOptions) {
  let serverRouteBuild = await buildServerRoutes(config, options);
  let manifest = generateRouteAssetManifest(config, serverRouteBuild.metafile);
  await writeFileSafe(
    path.join(config.buildPath, "route-asset-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  return serverRouteBuild;
}

export interface WatcherOptions {
  onInitialBuild?(): void;
  onFileChanged?(file: string): void;
  onFileAdded?(file: string): void;
  onFileDeleted?(file: string): void;
}

export async function watch(
  config: FwaConfig,
  readConfig: () => Promise<FwaConfig>,
  { onInitialBuild, onFileChanged, onFileAdded, onFileDeleted }: WatcherOptions
) {
  let serverRouteBuild = await build(config, { incremental: true });
  onInitialBuild?.();

  function disposeBuilder() {
    serverRouteBuild?.rebuild?.dispose();
    serverRouteBuild = undefined;
  }

  let restartBuilders = debounce(async () => {
    disposeBuilder();
    config = await readConfig();
    serverRouteBuild = await build(config, { incremental: true });
  }, 500);

  let rebuild = debounce(async () => {
    if (!serverRouteBuild?.rebuild) {
      disposeBuilder();
      serverRouteBuild = await build(config, { incremental: true });
      return;
    }

    await serverRouteBuild.rebuild().then(async (build) => {
      let manifest = generateRouteAssetManifest(config, build.metafile);
      await writeFileSafe(
        path.join(config.buildPath, "route-asset-manifest.json"),
        JSON.stringify(manifest, null, 2)
      );
    });
  }, 100);

  let watcher = chokidar
    .watch(config.routeDirectory, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100,
      },
    })
    .on("error", (error) => console.error(error))
    .on("change", async (file) => {
      onFileChanged?.(file);
      await rebuild();
    })
    .on("add", async (file) => {
      onFileAdded?.(file);
      await restartBuilders();
    })
    .on("unlink", async (file) => {
      onFileDeleted?.(file);
      await restartBuilders();
    });

  return async function closeWatcher() {
    await watcher.close();
  };
}

async function buildServerRoutes(
  config: FwaConfig,
  options?: BuildOptions
): Promise<esbuild.BuildResult> {
  let entryPoints: esbuild.BuildOptions["entryPoints"] = {};
  for (const [routeId, route] of Object.entries(config.routes)) {
    entryPoints[routeId] = route.filePath;
  }

  return esbuild.build({
    entryPoints,
    outdir: "build/routes",
    format: "esm",
    metafile: true,
    incremental: !!options?.incremental,
  });
}

async function writeFileSafe(file: string, contents: string): Promise<string> {
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, contents);
  return file;
}
