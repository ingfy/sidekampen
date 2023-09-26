#!/usr/bin/env node
// Modifies .gitignore to remove "dist/"
import { readFile, writeFile } from "fs";
import { resolve } from "path";

var cwd = process.cwd();
var ignores = resolve(cwd, ".gitignore");

readFile(ignores, "utf8", function (err, data) {
  if (err) {
    console.error("No .gitignore found to modify, skipping.");
    process.exit(0);
  }
  data = data.replace(/^dist\/[\n\r]?/gm, "");
  writeFile(ignores, data, function (err) {
    if (err) {
      console.error("Could not modify .gitignore");
      throw err;
    }
  });
});
