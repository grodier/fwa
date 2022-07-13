import fse from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function scaffoldApp(appDir, options) {
  console.log("APP DIR", appDir);
  console.log("OPTS", options);
  let projectDir = path.resolve(process.cwd(), appDir);
  console.log("PD", projectDir);
  let template = options.dev ? "dev" : "default";
  let templateDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    `../../templates/${template}`
  );
  console.log("TD", templateDir);
  fse.copySync(templateDir, projectDir);
}
