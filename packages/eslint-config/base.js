import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import onlyWarn from "eslint-plugin-only-warn";
import turboPlugin from "eslint-plugin-turbo";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export const config = defineConfig(
  globalIgnores(["dist/**"]),
  prettier,
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/{apps,packages}/**/src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigDirName: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
);
