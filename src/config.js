(function (root) {
  'use strict';
  const config = Object.freeze({
    SUPPORT_EMAIL: 'support@zorqstudio.com',
    ONBOARDED_KEY: 'oc_onboarded_v1',
    LAST_BACKUP_KEY: 'oc_last_backup_v1',
  });

  function validSupportEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const api = { ...config, validSupportEmail };
  if (root) (root.OutreachCommand ||= {}).config = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : undefined);
