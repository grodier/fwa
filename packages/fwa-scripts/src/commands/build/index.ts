import { Command } from "commander";
import { createBuild } from "./createBuild.js";

export const build = new Command("build");
build.description("build the application for production").action(createBuild);
