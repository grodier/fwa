import * as path from "path";

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

  return {
    rootDirectory,
    routeDirectory,
  };
}
