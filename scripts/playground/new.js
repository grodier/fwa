#!/usr/bin/env node
const path = require("path");
const fse = require("fs-extra");
const { execSync } = require("child_process");

async function createNewPlayground() {
  let name = `playground-${Date.now()}`;

  let playgroundDir = path.join(__dirname, "../../playgrounds", name);
  execSync(`node ./packages/create-fwa ${playgroundDir}`, { stdio: "inherit" });
}

createNewPlayground();
