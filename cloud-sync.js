(function () {
  'use strict';

  const SUPABASE_URL = 'https://yibouayqmiengsytjgkk.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_tGyjKJLaMEJicj8cmEFgEQ_tqBUrSBZ';
  const CLOUD_TABLE = 'oc_cloud_state';
  const APP_PREFIX = 'oc_';
  const client = window.supabase && window.supabase.createClient
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;

  if (!client) return;

  function appStorage() {
    return Object.keys(localStorage).filter((key) => key.startsWith(APP_PREFIX)).reduce((state, key) => {
      state[key] = localStorage.getItem(key);
      return state;
    }, {});
  }

  function formatTime(value) {
    return value ? new Date(value).toLocaleString() : 'Not yet saved';
  }

  function message(text, isError) {
    const el = document.getElementById('cloudSyncMessage');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('is-error', Boolean(isError));
  }

  async function getState(user) {
    const { data, error } = await client.from(CLOUD_TABLE).select('payload, updated_at').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function upload(user) {
    message('Saving your Outreach Command workspace securely…');
    const { error } = await client.from(CLOUD_TABLE).upsert({
      user_id: user.id,
      payload: { version: 1, savedAt: new Date().toISOString(), localStorage: appStorage() },
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) throw error;
    message('Cloud save complete.');
    await render(user);
  }

  async function restore(user) {
    const state = await getState(user);
    const stored = state && state.payload && state.payload.localStorage;
    if (!stored || !Object.keys(stored).length) {
      message('There is no cloud backup for this account yet.', true);
      return;
    }
    if (!window.confirm('Replace this browser’s Outreach Command data with your cloud backup? This browser will reload.')) return;
    Object.entries(stored).forEach(([key, value]) => localStorage.setItem(key, value));
    window.location.reload();
  }

  function modal() {
    document.getElementById('cloudSyncHub')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'cloudSyncHub';
    overlay.className = 'modal-overlay open client-workspace-overlay cloud-sync-overlay';
    overlay.innerHTML = `<section class="modal cloud-sync-modal" role="dialog" aria-modal="true" aria-label="Cloud sync"><div class="modal-head"><div><div class="modal-title">Cloud Sync</div><div class="client-workspace-sub">Private backups for your Outreach Command workspace.</div></div><button type="button" class="modal-close" data-cloud-close aria-label="Close">×</button></div><div class="modal-body" id="cloudSyncBody"></div></section>`;
    document.body.appendChild(overlay);
    overlay.querySelector('[data-cloud-close]').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.remove(); });
    client.auth.getUser().then(({ data }) => render(data.user)).catch((error) => message(error.message, true));
  }

  async function render(user) {
    const body = document.getElementById('cloudSyncBody');
    if (!body) return;
    if (!user) {
      body.innerHTML = `<p class="cloud-sync-copy">Sign in once to keep your CRM, messages, and workspace settings backed up privately. Your data is never stored in GitHub.</p><label class="form-label" for="cloudEmail">Email</label><input class="form-input" id="cloudEmail" type="email" autocomplete="email" placeholder="you@example.com"><label class="form-label" for="cloudPassword">Password</label><input class="form-input" id="cloudPassword" type="password" autocomplete="current-password" placeholder="At least 6 characters"><div class="cloud-sync-actions"><button class="btn btn-primary" type="button" id="cloudSignIn">Sign in</button><button class="btn" type="button" id="cloudSignUp">Create account</button></div><div id="cloudSyncMessage" class="cloud-sync-message"></div>`;
      const credentials = () => ({ email: body.querySelector('#cloudEmail').value.trim(), password: body.querySelector('#cloudPassword').value });
      body.querySelector('#cloudSignIn').addEventListener('click', async () => {
        try { const { error } = await client.auth.signInWithPassword(credentials()); if (error) throw error; const { data } = await client.auth.getUser(); await render(data.user); } catch (error) { message(error.message, true); }
      });
      body.querySelector('#cloudSignUp').addEventListener('click', async () => {
        try { const { error } = await client.auth.signUp({ ...credentials(), options: { emailRedirectTo: window.location.href.split('#')[0] } }); if (error) throw error; message('Account created. If confirmation is enabled, check your email, then sign in.'); } catch (error) { message(error.message, true); }
      });
      return;
    }
    let state = null;
    try { state = await getState(user); } catch (error) { body.innerHTML = `<div id="cloudSyncMessage" class="cloud-sync-message is-error">${error.message}</div>`; return; }
    body.innerHTML = `<div class="cloud-account"><span class="cloud-account-dot"></span><div><strong>${user.email}</strong><small>Private cloud workspace</small></div></div><p class="cloud-sync-copy">Last cloud save: <strong>${formatTime(state?.updated_at)}</strong>. This browser stays as your offline working copy.</p><div class="cloud-sync-actions"><button class="btn btn-primary" type="button" id="cloudUpload">Save this browser to cloud</button><button class="btn" type="button" id="cloudRestore" ${state ? '' : 'disabled'}>Restore cloud backup</button></div><button class="cloud-signout" type="button" id="cloudSignOut">Sign out</button><div id="cloudSyncMessage" class="cloud-sync-message"></div>`;
    body.querySelector('#cloudUpload').addEventListener('click', () => upload(user).catch((error) => message(error.message, true)));
    body.querySelector('#cloudRestore').addEventListener('click', () => restore(user).catch((error) => message(error.message, true)));
    body.querySelector('#cloudSignOut').addEventListener('click', async () => { await client.auth.signOut(); await render(null); });
  }

  const commandTools = document.querySelector('.command-tools');
  if (commandTools && !document.getElementById('cloudSyncButton')) {
    const button = document.createElement('button');
    button.id = 'cloudSyncButton'; button.className = 'top-workspace-button cloud-sync-button'; button.type = 'button'; button.innerHTML = '☁ Cloud Sync';
    button.addEventListener('click', modal);
    commandTools.appendChild(button);
  }
})();
