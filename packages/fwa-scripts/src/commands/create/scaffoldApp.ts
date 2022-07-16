import fse from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function scaffoldApp(appDir, options) {
  let projectDir = path.resolve(process.cwd(), appDir);
  let template = options.dev ? "dev" : "default";
  let templateDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    `../../templates/${template}`
  );
  fse.copySync(templateDir, projectDir);
}
