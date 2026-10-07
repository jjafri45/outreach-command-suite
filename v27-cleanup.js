/* Outreach Command v2.7 cleanup and accessibility layer */
(function () {
  'use strict';

  const svg = (path) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
  const iconPaths = {
    dashboard: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    ledger: 'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5',
    pipeline: 'M4 19V5 M10 19V9 M16 19v-6 M22 19V3',
    messages: 'M4 5h16v12H7l-3 3z',
    today: 'M12 3v18 M3 12h18',
    gmail: 'M3 5h18v14H3z M3 7l9 6 9-6',
    settings: 'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M18.4 5.6l-2.1 2.1 M7.7 16.3l-2.1 2.1 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8'
  };

  const support = document.getElementById('supportEmailLink');
  if (support) { support.href = `mailto:${SUPPORT_EMAIL}`; support.textContent = SUPPORT_EMAIL; }

  function isoDay(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  }
  function sampleWorkspace() {
    const people = [
      ['Maya Patel','Northstar Studio','Founder','New','Brand strategy',1800],
      ['Theo Martin','Lumen Health','Growth Lead','Contacted','Email campaign',3200],
      ['Aisha Khan','Harbor & Co.','Marketing Director','Replied','Website copy',2400],
      ['Noah Williams','Vector Works','Co-founder','Interested','Sales deck',4500],
      ['Sofia Chen','Brightwell Labs','Head of Product','Proposal Sent','Product messaging',6000],
      ['Liam Brooks','Pine & Peak','Owner','Converted','Brand identity',3800],
      ['Elena Rossi','Cedar Finance','Operations Director','Contacted','Content strategy',2200],
      ['Marcus Reed','Atlas Talent','CEO','New','Lead generation',5000],
      ['Priya Shah','Nexa Commerce','Ecommerce Manager','Interested','Lifecycle email',2800],
      ['Owen Clark','Fieldnote Media','Publisher','Not Interested','Editorial support',1600],
      ['Zara Ali','Kinetic House','Creative Director','Proposal Sent','Launch campaign',7200],
      ['Ethan Moore','Clearpath Legal','Partner','Replied','Thought leadership',3500],
      ['Mia Santos','Golden Hour Goods','Founder','Contacted','Conversion copy',1900],
      ['Daniel Kim','Relay Systems','Revenue Lead','Interested','Outbound system',5400],
      ['Grace Turner','Juniper Collective','Owner','Converted','Website refresh',3100],
      ['Ibrahim Khan','Summit Advisory','Managing Director','New','Proposal writing',2700],
      ['Nora Evans','Modern Table','Marketing Lead','Replied','Social campaign',2100],
      ['Caleb Young','Orbit Freight','Commercial Director','Contacted','Sales enablement',4300]
    ];
    return people.map(([name, company, jobTitle, status, service, dealValue], index) => ({
      id: index + 1, name, company, jobTitle, industry:'Professional Services', location:'Remote', email:`sample${index + 1}@example.com`, linkedinUrl:'',
      dateAdded:isoDay(-30 + index), dateContacted:['New'].includes(status) ? '' : isoDay(-18 + index), hook:['Warm check-in','Value-first','Curiosity','Direct'][index % 4], status,
      nextFollowup:['Converted','Not Interested','New'].includes(status) ? '' : isoDay(index % 4 === 0 ? 0 : index % 5 - 2), followupCount:index % 3, followupSent:false, linkSent:false,
      leadSource:['LinkedIn','Referral','Email','Event'][index % 4], service, dealValue:`$${dealValue}`, tags:['Sample data', index % 3 === 0 ? 'Hot lead' : ''], tasks:index % 5 === 0 ? [{id:`sample-task-${index}`,title:'Prepare follow-up',due:isoDay(0),done:false,createdAt:new Date().toISOString()}] : [], customFields:{}, outcomeReason:'', notes:'Sample data. Replace or clear these records when you are ready.', interestedDate:['Interested','Proposal Sent','Converted'].includes(status) ? isoDay(-7) : ''
    }));
  }
  const firstRun = !localStorage.getItem(ONBOARDED_KEY);
  if (firstRun && data.length === 6 && data.every((row) => ['Alex Rivera','Jordan Blake','Morgan Ellis','Casey Nguyen','Taylor Osei','Sam Holden'].includes(row.name))) {
    data = sampleWorkspace();
    activities = Object.fromEntries(data.filter((row) => row.status !== 'New').map((row) => [row.id, [{type:'Message Sent',date:row.dateContacted || isoDay(-1),note:'Sample outreach activity',ts:Date.now()}]]));
    nextId = data.length + 1;
    saveData(data); saveActivities(activities); render();
  }

  document.querySelectorAll('.nav a[data-page]').forEach((link) => {
    const slot = link.querySelector('.nav-icon');
    if (slot && iconPaths[link.dataset.page]) slot.innerHTML = svg(iconPaths[link.dataset.page]);
  });

  function activeModal() { return document.querySelector('.modal-overlay.open, #page-gmail.active'); }
  function syncModalState() {
    const open = Boolean(activeModal());
    document.body.classList.toggle('modal-is-open', open);
    if (open) window.scrollTo(0, 0);
  }
  new MutationObserver(syncModalState).observe(document.body, {subtree:true, attributes:true, attributeFilter:['class']});
  syncModalState();

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const gmail = document.getElementById('page-gmail');
    if (gmail && gmail.classList.contains('active')) { event.preventDefault(); v27ShowPage('dashboard'); return; }
    const modal = document.querySelector('.modal-overlay.open');
    if (modal) { event.preventDefault(); modal.classList.remove('open'); }
  }, true);

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
    overlay.className = 'modal-overlay open';
    overlay.innerHTML = '<section class="modal" role="dialog" aria-modal="true" aria-label="Terms and Privacy"><div class="modal-head"><div class="modal-title">Terms and Privacy</div><button type="button" class="modal-close" aria-label="Close">×</button></div><div class="modal-body"><p>Your data is stored locally in this browser. Zorq Studio does not see or store your CRM data.</p><p>AI chat and Gmail sync only send data when you turn them on. You are responsible for complying with email, anti-spam, and privacy laws when contacting prospects.</p><p>This software is provided as is.</p></div></section>';
    document.body.appendChild(overlay);
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
      data.filter((row) => row.nextFollowup && !['Converted','Not Interested'].includes(row.status)).forEach((row) => {
        const date = row.nextFollowup.replaceAll('-', '');
        const title = `Follow up: ${row.name}${row.company ? ` at ${row.company}` : ''}`.replace(/[\\,;]/g, '\\$&');
        lines.push('BEGIN:VEVENT', `UID:oc-${row.id}-${date}@zorqstudio.com`, `DTSTART;VALUE=DATE:${date}`, `SUMMARY:${title}`, `DESCRIPTION:Outreach Command follow-up for ${title}`, 'END:VEVENT');
      });
      lines.push('END:VCALENDAR');
      const url = URL.createObjectURL(new Blob([lines.join('\r\n')], {type:'text/calendar;charset=utf-8'}));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'outreach-followups.ics';
      anchor.click();
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
    const saved = Number(localStorage.getItem(LAST_BACKUP_KEY) || 0);
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
    window.markBackup = function () {
      const result = existingMarkBackup.apply(this, arguments);
      updateBackupBanner();
      return result;
    };
  }
})();
