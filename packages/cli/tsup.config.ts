import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  dts: true,
  clean: true,
  target: "node18",
  outDir: "dist",
  tsconfig: "tsconfig.json",
});
