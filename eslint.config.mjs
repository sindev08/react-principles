import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "**/dist/**",
    "packages/cli/tsup.config.ts",
    "next-env.d.ts",
  ]),

  // ── Base TypeScript rules (no type-checking required) ──────────────
  {
    rules: {
      // Existing rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",
      "react-hooks/incompatible-library": "off",

      // Enforce `import type` for type-only imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Disallow non-null assertion operator (!)
      "@typescript-eslint/no-non-null-assertion": "error",

      // Enforce consistent array type syntax (T[] for simple, Array<T> for complex)
      "@typescript-eslint/array-type": [
        "error",
        { default: "array-simple" },
      ],

      // Disallow require() in favor of import
      "@typescript-eslint/no-require-imports": "error",

      // Disallow empty interfaces / object types
      "@typescript-eslint/no-empty-object-type": "error",

      // Disallow @ts-ignore; allow @ts-expect-error with description
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
        },
      ],
    },
  },

  // ── Type-checked rules (TypeScript files only) ─────────────────────
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Catch unhandled promises (missing await / void / .catch)
      "@typescript-eslint/no-floating-promises": [
        "error",
        { ignoreVoid: true },
      ],

      // Prevent passing async functions where void return is expected
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],

      // Flag `await` on non-thenable values
      "@typescript-eslint/await-thenable": "error",

      // Remove unnecessary type assertions (`as Type`)
      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      // Prefer optional chaining (`?.`) over manual && chains
      "@typescript-eslint/prefer-optional-chain": "error",
    },
  },
]);
