#!/usr/bin/env node
const path = require("path");
const fse = require("fs-extra");
const { execSync } = require("child_process");

function packPackages() {
  let packageZipDir = path.join(__dirname, "../../package-zips");
  fse.ensureDirSync(packageZipDir);
  fse.emptyDirSync(packageZipDir);
  execSync(`npx turbo run local-pack --force`, { stdio: "inherit" });
}

packPackages();
