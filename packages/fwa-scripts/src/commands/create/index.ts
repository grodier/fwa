import { Argument, Command, Option } from "commander";
import { scaffoldApp } from "./scaffoldApp.js";

export const create = new Command("create");
create
  .addArgument(
    new Argument(
      "[project-directory]",
      "optional name where project will be installed"
    )
  )
  .addOption(new Option("-d, --dev").hideHelp())
  .action(scaffoldApp);
