const config = require('../src/config');
const { createBackup } = require('../src/data/backup');

test('support email is valid', () => {
  expect(config.validSupportEmail(config.SUPPORT_EMAIL)).toBe(true);
  expect(config.validSupportEmail('not-an-email')).toBe(false);
  expect(config.validSupportEmail(null)).toBe(false);
});

test('backup contains selected CRM data but never API keys', () => {
  const backup = createBackup(
    {
      prospects: [{ id: 1 }],
      activities: {},
      messages: [],
      customFields: [],
      auditLog: [],
      apiKey: 'secret',
      openaiKey: 'secret',
      token: 'secret',
    },
    new Date('2026-10-08T00:00:00.000Z'),
  );
  expect(backup.version).toBe(2);
  expect(backup.prospects).toEqual([{ id: 1 }]);
  expect(backup.exportDate).toBe('2026-10-08T00:00:00.000Z');
  expect(JSON.stringify(backup)).not.toMatch(/apiKey|openaiKey|token|secret/);
});
