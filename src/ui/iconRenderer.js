(function (root) {
  'use strict';
  const paths = Object.freeze({
    dashboard: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    ledger: 'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5',
    pipeline: 'M4 19V5 M10 19V9 M16 19v-6 M22 19V3',
    messages: 'M4 5h16v12H7l-3 3z',
    today: 'M12 3v18 M3 12h18',
    gmail: 'M3 5h18v14H3z M3 7l9 6 9-6',
    settings: 'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M18.4 5.6l-2.1 2.1 M7.7 16.3l-2.1 2.1 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  });
  function iconSvg(name) {
    const path = Object.hasOwn(paths, name) ? paths[name] : paths.dashboard;
    return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
  }
  function renderIcons(doc) {
    doc.querySelectorAll('.nav a[data-page]').forEach((link) => {
      const slot = link.querySelector('.nav-icon');
      if (slot && Object.hasOwn(paths, link.dataset.page)) slot.innerHTML = iconSvg(link.dataset.page);
    });
  }
  const api = { iconSvg, renderIcons, paths };
  if (root) (root.OutreachCommand ||= {}).icons = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : undefined);
