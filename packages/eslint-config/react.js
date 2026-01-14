import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { config as baseConfig } from "./base.js";

export const config = defineConfig(
  baseConfig,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  reactHooks.configs.flat["recommended-latest"],
);
