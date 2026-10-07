const fs = require('node:fs');
const path = require('node:path');

test('Gmail sender uses the connected account instead of a hardcoded personal address', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  expect(html).toContain("const DEFAULT_OUTREACH_SENDER = '';");
  expect(html).toContain('if (payload.from) options.from = payload.from;');
  expect(html).not.toMatch(/jari@literarylabstudio\.com|wa\.me\/923472590983/);
});

test('proposal defaults do not include a personal phone number', () => {
  const html = fs.readFileSync(
    path.join(__dirname, '..', 'tools', 'proposal-generator.html'),
    'utf8',
  );
  expect(html).toContain('agencyPhone: ""');
  expect(html).not.toMatch(/agencyPhone:\s*"\+/);
});
