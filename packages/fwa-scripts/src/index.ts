#!/usr/bin/env node
import { Command } from "commander";
import { dev } from "./commands";

let program = new Command();
program
  .version("0.1.0")
  .description("fwa scripts")
  .addCommand(dev)
  .parseAsync();
