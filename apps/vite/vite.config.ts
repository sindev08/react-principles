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
      "@react-principles/shared/lib": path.resolve(sharedRoot, "lib/index.ts"),
      "@react-principles/shared/stores": path.resolve(sharedRoot, "stores/index.ts"),
      "@react-principles/shared/queries": path.resolve(sharedRoot, "queries/index.ts"),
      "@react-principles/shared/mutations": path.resolve(sharedRoot, "mutations/index.ts"),
      "@react-principles/shared/common": path.resolve(sharedRoot, "common/index.ts"),
      "@react-principles/shared/cookbook": path.resolve(sharedRoot, "cookbook/index.ts"),
      "@react-principles/shared/ui": path.resolve(sharedRoot, "ui/index.ts"),
    },
  },
});
