#!/usr/bin/env node
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, "../cli/zuhre-cli.ts");

const args = process.argv.slice(2);

// Run with tsx
const proc = spawn("npx", ["tsx", cliPath, ...args], {
  stdio: "inherit",
  cwd: join(__dirname, ".."),
});

proc.on("exit", (code) => {
  process.exit(code || 0);
});
