const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const modules = [
  'config.js',
  'data/sampleWorkspace.js',
  'data/backup.js',
  'ui/iconRenderer.js',
  'ui/modalState.js',
  'onboarding.js',
];

test.each(modules)('%s loads through plain browser script tags', (file) => {
  const code = fs.readFileSync(path.join(__dirname, '..', 'src', file), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  expect(Object.keys(sandbox.window.OutreachCommand)).toHaveLength(1);
});

test.each(modules)('%s loads without a window in Node', (file) => {
  const code = fs.readFileSync(path.join(__dirname, '..', 'src', file), 'utf8');
  const sandbox = { module: { exports: {} } };
  vm.runInNewContext(code, sandbox);
  expect(Object.keys(sandbox.module.exports).length).toBeGreaterThan(0);
});
