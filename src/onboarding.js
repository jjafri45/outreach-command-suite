(function (root) {
  'use strict';
  function readOnboarded(storage, key) {
    try {
      return storage.getItem(key) === '1';
    } catch (error) {
      console.warn('Could not read onboarding state', error);
      return false;
    }
  }
  function writeOnboarded(storage, key) {
    try {
      storage.setItem(key, '1');
      return true;
    } catch (error) {
      console.warn('Could not save onboarding state', error);
      return false;
    }
  }
  function startOnboarding({ doc, storage, key, onClear }) {
    const overlay = doc.getElementById('onboardOverlay');
    if (!overlay) return;
    if (!readOnboarded(storage, key)) overlay.style.display = 'flex';
    doc.getElementById('onboardKeep')?.addEventListener('click', () => {
      writeOnboarded(storage, key);
      overlay.style.display = 'none';
    });
    doc.getElementById('onboardClear')?.addEventListener('click', () => {
      if (
        !root.confirm(
          'This will clear the sample prospects. Your app starts completely empty. Continue?',
        )
      )
        return;
      onClear();
      writeOnboarded(storage, key);
      overlay.style.display = 'none';
    });
  }
  const api = { readOnboarded, writeOnboarded, startOnboarding };
  if (root) (root.OutreachCommand ||= {}).onboarding = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : undefined);
