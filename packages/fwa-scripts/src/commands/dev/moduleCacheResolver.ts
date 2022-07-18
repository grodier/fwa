import path from "node:path";

let moduleCache = {};

export async function importModule(file: string) {
  const routeName = path.basename(file, path.extname(file));
  moduleCache[routeName] = moduleCache[routeName] || file;
  return import(moduleCache[routeName]);
}

export function updateLocalModuleCache(file: string) {
  const routeName = path.basename(file, path.extname(file));
  moduleCache[routeName] = moduleCache[routeName]
    ? `${moduleCache[routeName]}?update=${Date.now()}`
    : file;
}
