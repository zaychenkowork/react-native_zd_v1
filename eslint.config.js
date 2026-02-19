const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const queryPlugin = require('@tanstack/eslint-plugin-query');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  ...queryPlugin.configs['flat/recommended'],
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env']",
          message: 'Use CONFIG from @/config instead of process.env',
        },
      ],
    },
  },
  {
    files: ['src/config/env.ts', 'app.config.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  eslintConfigPrettier,
  {
    ignores: ['dist/*'],
  },
]);
