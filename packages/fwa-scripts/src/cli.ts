#!/usr/bin/env node
import { cli } from "./index.js";

cli(process.argv).then(
  () => {
    process.exit(0);
  },
  (error: Error) => {
    console.error(error);
    process.exit(1);
  }
);
