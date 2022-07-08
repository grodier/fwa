import type { FwaConfig } from "./config.js";
import * as esbuild from "esbuild";
import path from "node:path";
import fs from "node:fs";

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
        serverPath: "/",
        modulePath: path.resolve(config.rootDirectory, routeOutputKey),
      };
    }
  }
  return assetManifest;
}

export async function build(config: FwaConfig) {
  let { metafile } = await buildServerRoutes(config);
  let manifest = generateRouteAssetManifest(config, metafile);
  writeFileSafe(
    path.join(config.buildPath, "route-asset-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
}

async function buildServerRoutes(
  config: FwaConfig
): Promise<esbuild.BuildResult> {
  let entryPoints: esbuild.BuildOptions["entryPoints"] = {};
  for (const [routeId, route] of Object.entries(config.routes)) {
    entryPoints[routeId] = route.filePath;
  }

  console.log("entry points", entryPoints);

  return esbuild.build({
    entryPoints,
    outdir: "build/routes",
    format: "cjs",
    metafile: true,
  });
}

async function writeFileSafe(file: string, contents: string): Promise<string> {
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, contents);
  return file;
}
