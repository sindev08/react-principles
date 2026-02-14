import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const sharedRoot = path.resolve(__dirname, "../../packages/shared/src");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@react-principles/shared/hooks": path.resolve(sharedRoot, "hooks/index.ts"),
      "@react-principles/shared/utils": path.resolve(sharedRoot, "utils/index.ts"),
      "@react-principles/shared/types": path.resolve(sharedRoot, "types/index.ts"),
      "@react-principles/shared/services": path.resolve(sharedRoot, "services/index.ts"),
      "@react-principles/shared/components": path.resolve(sharedRoot, "components/index.ts"),
    },
  },
});
