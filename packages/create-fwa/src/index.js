const { Command, Option } = require("commander");
const path = require("path");
const fs = require("fs-extra");

function createApp(appDir, options) {
  let projectDir = path.resolve(process.cwd(), appDir);
  let template = options.dev ? "dev" : "default";
  fs.copy(path.resolve(__dirname, `templates/${template}`), projectDir);
}

const program = new Command();
program
  .version("0.1.0")
  .argument(
    "[project-directory]",
    "optional name where project will be installed"
  )
  .addOption(new Option("-d, --dev").hideHelp())
  .action(createApp)
  .parse();
