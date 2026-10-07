/* Browser entry point for Outreach Command v2.7. */
(function () {
  'use strict';
  const { config, sampleWorkspace, icons, modalState, onboarding } = window.OutreachCommand;
  if (!config || !sampleWorkspace || !icons || !modalState || !onboarding) {
    console.warn('Outreach Command modules did not load.');
    return;
  }

  const support = document.getElementById('supportEmailLink');
  if (support && config.validSupportEmail(config.SUPPORT_EMAIL)) {
    support.href = `mailto:${config.SUPPORT_EMAIL}`;
    support.textContent = config.SUPPORT_EMAIL;
  } else if (support) {
    console.warn('Support email is not valid.');
  }

  const firstRun = !onboarding.readOnboarded(localStorage, config.ONBOARDED_KEY);
  const oldSamples = ['Alex Rivera', 'Jordan Blake', 'Morgan Ellis', 'Casey Nguyen', 'Taylor Osei', 'Sam Holden'];
  if (firstRun && data.length === 6 && data.every((row) => oldSamples.includes(row.name))) {
    const sample = sampleWorkspace.sampleWorkspace();
    data = sample.prospects;
    activities = sample.activities;
    nextId = data.length + 1;
    saveData(data);
    saveActivities(activities);
    render();
  }
  onboarding.startOnboarding({
    doc: document, storage: localStorage, key: config.ONBOARDED_KEY,
    onClear() { data = []; activities = {}; nextId = 1; saveData(data); saveActivities(activities); render(); },
  });
  icons.renderIcons(document);

  const modals = modalState.createModalState(document, {
    scrollToTop: () => window.scrollTo(0, 0),
    closeGmail: () => v27ShowPage('dashboard'),
  });
  modals.start();

  const gmail = document.getElementById('page-gmail');
  if (gmail) {
    gmail.classList.add('gmail-modal-page');
    const shell = document.createElement('section');
    shell.className = 'modal gmail-modal';
    shell.setAttribute('role', 'dialog');
    shell.setAttribute('aria-modal', 'true');
    shell.setAttribute('aria-label', 'Gmail Sync');
    const head = document.createElement('div');
    head.className = 'modal-head';
    head.innerHTML = '<div><div class="modal-title">Gmail Sync</div><div class="client-workspace-sub">Optional connection using your own Google Apps Script.</div></div><button class="modal-close" type="button" aria-label="Close Gmail Sync">×</button>';
    const body = document.createElement('div');
    body.className = 'modal-body';
    while (gmail.firstChild) body.appendChild(gmail.firstChild);
    shell.append(head, body);
    gmail.appendChild(shell);
    head.querySelector('button').addEventListener('click', () => v27ShowPage('dashboard'));
    gmail.addEventListener('click', (event) => { if (event.target === gmail) v27ShowPage('dashboard'); });
  }

  document.getElementById('termsPrivacyBtn')?.addEventListener('click', () => {
    document.getElementById('termsPrivacyModal')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'termsPrivacyModal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<section class="modal" role="dialog" aria-modal="true" aria-label="Terms and Privacy"><div class="modal-head"><div class="modal-title">Terms and Privacy</div><button type="button" class="modal-close" aria-label="Close">×</button></div><div class="modal-body"><p>Your data is stored locally in this browser. Zorq Studio does not see or store your CRM data.</p><p>AI chat and Gmail sync only send data when you turn them on. You are responsible for complying with email, anti-spam, and privacy laws when contacting prospects.</p><p>This software is provided as is.</p></div></section>';
    document.body.appendChild(overlay);
    modals.open(overlay);
    overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.remove(); });
  });

  const settings = document.getElementById('page-settings');
  if (settings) {
    const backup = settings.querySelector('.settings-section');
    const calendar = document.createElement('div');
    calendar.className = 'settings-section';
    calendar.innerHTML = '<h3>Follow-up Calendar</h3><p>Download open follow-ups as a calendar file that you can import into Google Calendar, Outlook, or Apple Calendar.</p><button class="btn" id="exportFollowupCalendar">Export follow-ups to calendar (.ics)</button>';
    backup?.after(calendar);
    calendar.querySelector('#exportFollowupCalendar').addEventListener('click', () => {
      const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Zorq Studio//Outreach Command//EN'];
      data.filter((row) => row.nextFollowup && !['Converted', 'Not Interested'].includes(row.status)).forEach((row) => {
        const date = row.nextFollowup.replaceAll('-', '');
        const title = `Follow up: ${row.name}${row.company ? ` at ${row.company}` : ''}`.replace(/[\\,;]/g, '\\$&');
        lines.push('BEGIN:VEVENT', `UID:oc-${row.id}-${date}@zorqstudio.com`, `DTSTART;VALUE=DATE:${date}`, `SUMMARY:${title}`, `DESCRIPTION:Outreach Command follow-up for ${title}`, 'END:VEVENT');
      });
      lines.push('END:VCALENDAR');
      const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = 'outreach-followups.ics'; anchor.click();
      URL.revokeObjectURL(url);
    });
    const samples = document.createElement('div');
    samples.className = 'settings-section';
    samples.innerHTML = '<h3>Sample Data</h3><p>Sample prospects are clearly labelled and help you explore the dashboard. Clearing sample data does not affect records you add later.</p><button class="btn" id="clearSampleData">Clear sample data</button>';
    calendar.after(samples);
    samples.querySelector('#clearSampleData').addEventListener('click', () => {
      const sampleIds = new Set(data.filter((row) => (row.tags || []).includes('Sample data')).map((row) => row.id));
      if (!sampleIds.size) { alert('There is no sample data to clear.'); return; }
      if (!confirm(`Clear ${sampleIds.size} sample prospect${sampleIds.size === 1 ? '' : 's'}?`)) return;
      data = data.filter((row) => !sampleIds.has(row.id));
      Object.keys(activities).forEach((id) => { if (sampleIds.has(Number(id))) delete activities[id]; });
      saveData(data); saveActivities(activities); render();
    });
  }

  function updateBackupBanner() {
    const host = document.querySelector('#page-dashboard .command-topbar');
    if (!host) return;
    document.getElementById('backupReminder')?.remove();
    let saved = 0;
    try { saved = Number(localStorage.getItem(config.LAST_BACKUP_KEY) || 0); }
    catch (error) { console.warn('Could not read backup date', error); }
    const days = saved ? Math.floor((Date.now() - saved) / 86400000) : null;
    const label = days === null ? 'Last backup: never' : `Last backup: ${days} day${days === 1 ? '' : 's'} ago`;
    const banner = document.createElement('div');
    banner.id = 'backupReminder';
    banner.className = 'backup-reminder';
    banner.innerHTML = `<span>${label}</span>${days === null || days > 7 ? '<button type="button" class="btn btn-sm">Export Backup now</button>' : ''}`;
    host.after(banner);
    banner.querySelector('button')?.addEventListener('click', () => document.getElementById('exportJsonBtn')?.click());
  }
  updateBackupBanner();
  const existingMarkBackup = window.markBackup;
  if (typeof existingMarkBackup === 'function') {
    window.markBackup = function () { const result = existingMarkBackup.apply(this, arguments); updateBackupBanner(); return result; };
  }
})();
