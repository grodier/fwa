import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import path from "path";
import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import fs from "fs";
import fse from "fs-extra";

const packageJson = JSON.parse(fs.readFileSync("./package.json"));

function isBareModuleId(id) {
  return !id.startsWith(".") && !path.isAbsolute(id);
}

let fwaScripts = {
  external: isBareModuleId,
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    preserveModules: true,
  },
  plugins: [
    resolve({ extensions: [".ts"] }),
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/,
      extensions: [".ts"],
    }),
    preserveShebangs(),
    copyToPlaygrounds(),
  ],
};

function copyToPlaygrounds() {
  return {
    name: "copy-to-fwa-playground",
    async writeBundle(options) {
      let playgroundsDir = path.join(__dirname, "../../playgrounds");

      if (!fse.existsSync(playgroundsDir)) {
        return;
      }
      let playgrounds = await fs.promises.readdir(playgroundsDir);
      let writtenDir = path.join(__dirname, options.dir);
      for (let playground of playgrounds) {
        let playgroundDir = path.join(playgroundsDir, playground);
        if (!fse.statSync(playgroundDir).isDirectory()) {
          continue;
        }
        let destDir = path.join(
          playgroundDir,
          "node_modules",
          packageJson.name,
          "dist"
        );
        await fse.copy(writtenDir, destDir);
        //await triggerLiveReload(playgroundDir);
      }
    },
  };
}

export default function rollup() {
  return [fwaScripts];
}
