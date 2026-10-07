const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/**', 'coverage/**', 'backup-v2.6-original/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'v27-cleanup.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['v27-cleanup.js'],
    languageOptions: {
      globals: {
        data: 'writable',
        activities: 'writable',
        nextId: 'writable',
        saveData: 'readonly',
        saveActivities: 'readonly',
        render: 'readonly',
        v27ShowPage: 'readonly',
      },
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.jest } },
  },
  {
    files: ['jest.config.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
];
