import type { FwaConfig } from "./config";

export async function build(config: FwaConfig) {
  await buildServerRoutes(config);
}

export async function buildServerRoutes(config: FwaConfig) {
  console.log("ROUTE DIRECTORY", config.routeDirectory);
}
