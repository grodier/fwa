import { readConfig } from "../../config";
import { build } from "../../compiler";

export async function createBuild() {
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
  console.log("Starting build");
  await build(readConfig());
  console.log("Build finished");
}
