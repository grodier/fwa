import { Command } from "commander";
import { build, dev, create } from "./commands/index.js";

export async function cli(argv: string[]): Promise<void> {
  let program = new Command();
  program
    .version("0.1.0")
    .description("fwa scripts")
    .addCommand(build)
    .addCommand(create)
    .addCommand(dev)
    .parseAsync(argv);
}
