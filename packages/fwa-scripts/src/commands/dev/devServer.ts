import type * as Express from "express";
import express from "express";
import path from "path";
import { readConfig } from "../../config";
import type { RouteAssetManifest } from "../../compiler";

export async function devServer() {
  let app = express();

  let config = readConfig();

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

function createLocalRoutes(expressApp: Express.Application, buildPath: string) {
  let routeAssets: RouteAssetManifest = require(buildPath);
  for (let route of Object.values(routeAssets)) {
    let routeModule = require(route.modulePath).default;
    expressApp.all(route.serverPath, (req, res, next) => {
      let nodeResponse = routeModule();
      res.status(nodeResponse.status);
      res.send(nodeResponse.body);
    });
  }
}
