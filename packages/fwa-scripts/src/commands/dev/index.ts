import { Command } from "commander";
import { devServer } from "./devServer";

export const dev = new Command("dev");
dev.description("run the dev server").action(devServer);
