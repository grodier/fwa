import { readConfig } from "../../config.js";
import { build } from "@grodier/fwa-compiler";

export async function createBuild() {
  //hello();
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
  console.log("Starting build");
  let config = await readConfig();
  await build(config);
  console.log("Build finished");
}
