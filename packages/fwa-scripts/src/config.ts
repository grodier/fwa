import * as path from "path";
import * as fs from "fs";

export interface AppConfig {
  /**
   * The path to the `routes` directory, relative to `fwa.config.js`. Defaults
   * to `"routes"`.
   */
  routeDirectory: string;
}

export interface FwaConfig {
  rootDirectory: string;
  routeDirectory: string;
  routes: RouteManifest;
}

export interface RouteManifest {
  [routeId: string]: {
    filePath: string;
    serverPath: string;
  };
}

function generateRoutes(routeDirectory: string): RouteManifest {
  const routes = fs.readdirSync(routeDirectory);
  let routeObj: RouteManifest = {};
  routes.forEach((route) => {
    routeObj[stripFileExtension(route)] = {
      serverPath: "/",
      filePath: path.resolve(routeDirectory, route),
    };
  });

  return routeObj;
}

function stripFileExtension(file: string) {
  return file.replace(/\.[a-z0-9]+$/i, "");
}

export function readConfig(): FwaConfig {
  let fwaRoot = process.cwd();

  let rootDirectory = path.resolve(fwaRoot);
  let configFile = path.resolve(rootDirectory, "fwa.config.js");

  let appConfig: AppConfig;
  try {
    appConfig = require(configFile);
  } catch (error) {
    throw new Error(
      `Error loading FWA config in ${configFile}\n${String(error)}`
    );
  }

  let routeDirectory = path.resolve(
    rootDirectory,
    appConfig.routeDirectory || "routes"
  );

  let routes = generateRoutes(routeDirectory);

  return {
    rootDirectory,
    routeDirectory,
    routes,
  };
}
