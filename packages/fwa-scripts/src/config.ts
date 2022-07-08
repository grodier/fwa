import * as path from "node:path";
import * as fs from "node:fs";

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
  buildPath: string;
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

export async function readConfig(): Promise<FwaConfig> {
  let fwaRoot = process.cwd();

  let rootDirectory = path.resolve(fwaRoot);
  let configFile = path.resolve(rootDirectory, "fwa.config.js");

  let appConfig: AppConfig;
  try {
    appConfig = await import(configFile);
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

  let buildPath = path.resolve(rootDirectory, "build");

  return {
    buildPath,
    rootDirectory,
    routeDirectory,
    routes,
  };
}
