import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import { configs as litConfigs } from "eslint-plugin-lit";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  // ── Register @typescript-eslint plugin globally ───────────────────────
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
  },

  // ── Base JS ───────────────────────────────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },

  // ── TypeScript ────────────────────────────────────────────────────────
  {
    files: ["**/*.{ts,mts,cts}"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
    },
  },

  // ── Import plugin (with TS resolver) ─────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "import/no-internal-modules": [ "error", {
        "allow": [ "assets/*", "lit/*" ],
      } ]
    },
  },

  // ── Lit components ────────────────────────────────────────────────────
  {
    files: ["src/**/*.ts", "**/*.component.ts", "**/*-element.ts"],
    extends: [litConfigs["flat/recommended"]],
  },

  // ── CSS ───────────────────────────────────────────────────────────────
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },

  // ── Shared rule overrides ─────────────────────────────────────────────
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
    },
  },
]);