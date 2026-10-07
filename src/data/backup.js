(function (root) {
  'use strict';
  function createBackup({ prospects, activities, messages, customFields, auditLog }, now = new Date()) {
    return { version: 2, exportDate: now.toISOString(), prospects, activities, messages,
      customFields, auditLog };
  }
  const api = { createBackup };
  if (root) (root.OutreachCommand ||= {}).backup = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : undefined);
