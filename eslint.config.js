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
            "MemberExpression[object.name='process'][property.name='env']",
          message:
            'Use Env from env.ts or CONFIG from @/config instead of process.env',
        },
      ],
    },
  },
  {
    files: ['env.ts', 'app.config.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  eslintConfigPrettier,
  {
    ignores: ['dist/*', 'scripts/**/*.js'],
  },
]);
