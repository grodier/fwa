import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import path from "path";
import { preserveShebangs } from "rollup-plugin-preserve-shebangs";

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
  ],
};

export default function rollup() {
  return [fwaScripts];
}
