import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import path from "node:path";
import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import fs from "node:fs";
import fse from "fs-extra";

const packageJson = JSON.parse(fs.readFileSync("./package.json"));

function isBareModuleId(id) {
  return !id.startsWith(".") && !path.isAbsolute(id);
}

let createFwa = {
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
      let playgroundDir = path.join(__dirname, "../../playground");

      if (
        !fse.existsSync(playgroundDir) ||
        !fse.statSync(playgroundDir).isDirectory()
      ) {
        return;
      }

      let writtenDir = path.join(__dirname, options.dir);

      let destDir = path.join(
        playgroundDir,
        "node_modules",
        packageJson.name,
        "dist"
      );
      await fse.copy(writtenDir, destDir);
      //await triggerLiveReload(playgroundDir);
    },
  };
}

export default function rollup() {
  return [createFwa];
}
