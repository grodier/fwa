import type * as Express from "express";
import express from "express";
import path from "node:path";
import fs from "node:fs/promises";
import { readConfig } from "../../config.js";
import type { RouteAssetManifest } from "../../compiler.js";

export async function devServer() {
  let app = express();

  let config = await readConfig();

  app.use(
    await createLocalRoutes(
      path.join(config.buildPath, "route-asset-manifest.json")
    )
  );

  app.listen(3000, () => {
    console.log(`FWA started at http://localhost:3000`);
  });
}

async function createLocalRoutes(routeManifestPath: string) {
  let app = express();
  let routeAssets: RouteAssetManifest = JSON.parse(
    await fs.readFile(routeManifestPath, "utf-8")
  );

  for (let route of Object.values(routeAssets)) {
    let routeModule = await import(route.modulePath);
    app.all(route.serverPath, (req, res, next) => {
      let nodeResponse = routeModule.default();
      res.status(nodeResponse.status);
      res.send(nodeResponse.body);
    });
  }
  return app;
}
