import express from "express";
import type { Server } from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import exitHook from "exit-hook";
import { installGlobals } from "../../globals.js";
import { readConfig } from "../../config.js";
import { writeReadableStreamToWritable } from "../../stream.js";
import type { Response as NodeResponse } from "../../fetch.js";
import type { RouteAssetManifest } from "@grodier/fwa-compiler";
import * as compiler from "@grodier/fwa-compiler";

installGlobals();

export async function devServer() {
  let app = express();
  let router = express.Router();
  let config = await readConfig();

  app.use(async (req, res, next) => {
    router = express.Router();
    let routeAssets: RouteAssetManifest = JSON.parse(
      await fs.readFile(
        path.join(config.buildPath, "route-asset-manifest.json"),
        "utf-8"
      )
    );
    for (let route of Object.values(routeAssets)) {
      let routeModule = await import(route.modulePath);
      router.all(route.serverPath, async (req, res, next) => {
        let nodeResponse: NodeResponse = routeModule.default();
        res.statusMessage = nodeResponse.statusText;
        res.status(nodeResponse.status);

        for (let [key, values] of Object.entries(nodeResponse.headers.raw())) {
          for (let value of values) {
            res.append(key, value);
          }
        }

        if (nodeResponse.body) {
          await writeReadableStreamToWritable(nodeResponse.body, res);
        } else {
          res.end();
        }
      });
    }
    next();
  });

  app.use((req, res, next) => {
    router(req, res, next);
  });

  let server: Server | null;
  let closeWatcher = await compiler.watch(config, {
    async onInitialBuild() {
      server = app.listen(3000, () => {
        console.log(`FWA started at http://localhost:3000`);
      });
    },
  });

  let resolve: () => void;
  exitHook(() => {
    resolve();
  });
  await new Promise<void>((r) => {
    resolve = r;
  }).then(async () => {
    await closeWatcher();
    server!?.close();
  });
}
