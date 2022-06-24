const { Command } = require("commander");
const path = require("path");
const fs = require("fs-extra");

function createApp(appDir) {
  let projectDir = path.resolve(process.cwd(), appDir);
  fs.copy(path.resolve(__dirname, "template"), projectDir);
}

const program = new Command();
program
  .version("0.1.0")
  .argument(
    "[project-directory]",
    "optional name where project will be installed"
  )
  .action(createApp)
  .parse();
