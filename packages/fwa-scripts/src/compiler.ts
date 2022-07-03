import type { FwaConfig } from "./config";
import * as esbuild from "esbuild";

export async function build(config: FwaConfig) {
  await buildServerRoutes(config);
}

async function buildServerRoutes(config: FwaConfig) {
  let entryPoints: esbuild.BuildOptions["entryPoints"] = {};
  for (const [routeId, route] of Object.entries(config.routes)) {
    entryPoints[routeId] = route.filePath;
  }

  console.log("entry points", entryPoints);

  let result = await esbuild.build({
    entryPoints,
    outdir: "dist",
  });
}
