import * as esbuild from "esbuild";
import path from "node:path";
import fs from "node:fs";
import chokidar from "chokidar";

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

export async function build(config: FwaConfig) {
  let serverRouteBuild = await buildServerRoutes(config);
  let manifest = generateRouteAssetManifest(config, serverRouteBuild.metafile);
  await writeFileSafe(
    path.join(config.buildPath, "route-asset-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  return serverRouteBuild;
}

export interface WatcherOptions {
  onInitialBuild?(): void;
}

export async function watch(
  config: FwaConfig,
  { onInitialBuild }: WatcherOptions
) {
  let serverRouteBuild = await build(config);
  onInitialBuild?.();

  let watcher = chokidar.watch(config.routeDirectory, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100,
    },
  });

  return async function closeWatcher() {
    await watcher.close();
  };
}

async function buildServerRoutes(
  config: FwaConfig
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
  });
}

async function writeFileSafe(file: string, contents: string): Promise<string> {
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, contents);
  return file;
}
