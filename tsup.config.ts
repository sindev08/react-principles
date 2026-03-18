import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    hooks: "src/shared/hooks/index.ts",
    utils: "src/shared/utils/index.ts",
    types: "src/shared/types/index.ts",
    stores: "src/shared/stores/index.ts",
    components: "src/shared/components/index.ts",
    lib: "src/lib/exportable/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  clean: true,
  target: "es2017",
  outDir: "dist",
  tsconfig: "tsconfig.build.json",
  external: [
    "react",
    "react-dom",
    "zod",
    "zustand",
    "clsx",
    "tailwind-merge",
  ],
});
