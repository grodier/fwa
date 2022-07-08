import type * as Express from "express";
import express from "express";
import path from "node:path";
import fs from "node:fs/promises";
import { readConfig } from "../../config.js";
import type { RouteAssetManifest } from "../../compiler.js";

export async function devServer() {
  let app = express();

  let config = await readConfig();

  createLocalRoutes(
    app,
    path.join(config.buildPath, "route-asset-manifest.json")
  );
  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  app.listen(3000, () => {
    console.log(`FWA started at http://localhost:3000`);
  });
}

async function createLocalRoutes(
  expressApp: Express.Application,
  routeManifestPath: string
) {
  let routeAssets: RouteAssetManifest = JSON.parse(
    await fs.readFile(routeManifestPath, "utf-8")
  );

  for (let route of Object.values(routeAssets)) {
    let routeModule = await import(route.modulePath);
    expressApp.all(route.serverPath, (req, res, next) => {
      let nodeResponse = routeModule();
      res.status(nodeResponse.status);
      res.send(nodeResponse.body);
    });
  }
}
