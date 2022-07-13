#!/usr/bin/env node
import { cli } from "@grodier/fwa-scripts";

cli([...process.argv.splice(0, 2), "create", ...process.argv]).then(
  () => {
    process.exit(0);
  },
  (error: Error) => {
    console.error(error);
    process.exit(1);
  }
);
