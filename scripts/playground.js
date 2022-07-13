#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

async function createNewPlayground() {
  let playgroundDir = path.join(__dirname, "../playground");

  fs.rmSync(playgroundDir, { recursive: true, force: true });

  execSync(`npx turbo run build`, { stdio: "inherit" });

  execSync(`node ./packages/create-fwa/dist/index.js ${playgroundDir} --dev`, {
    stdio: "inherit",
  });

  execSync(`node ./scripts/local-pack.js`, { stdio: "inherit" });

  execSync(`npm install`, {
    cwd: playgroundDir,
    stdio: "inherit",
  });
  /*
  execSync(`npm install ../package-zips/grodier-fwa-scripts-0.1.0.tgz`, {
    stdio: "inherit",
    cwd: playgroundDir,
  });
  */
}

createNewPlayground();
