#!/usr/bin/env node
const path = require("path");
const { execSync } = require("child_process");

async function createNewPlayground() {
  let name = `playground-${Date.now()}`;

  let playgroundDir = path.join(__dirname, "../../playgrounds", name);
  execSync(`node ./packages/create-fwa ${playgroundDir}`, { stdio: "inherit" });

  execSync(`node ./scripts/build/pack.js`, { stdio: "inherit" });

  execSync(`npm install ../../package-zips/fwa-scripts-0.1.0.tgz`, {
    stdio: "inherit",
    cwd: playgroundDir,
  });
}

createNewPlayground();
