// ================================================================
//  utils/store.js — Persistent storage via JSONBin
//
//  Stores ONLY:
//    - Channel IDs  (e.g. LOG_CHANNEL, WELCOME_CHANNEL)
//    - Role IDs     (e.g. AUTO_ROLE, MUTE_ROLE)
//    - Settings overrides from /setup commands
//
//  No user data. No XP. No coins. No warnings history.
//
//  Uses a single JSONBin to keep it simple.
//  Free tier at jsonbin.io is plenty for this.
// ================================================================

const KEY      = process.env.JSONBIN_KEY;
const BIN_ENV  = 'JSONBIN_BIN_pawbot';
const BASE     = 'https://api.jsonbin.io/v3';

// Everything lives here in memory, loaded once on startup
const store = {
  channels: {},   // LOG_CHANNEL, WELCOME_CHANNEL, etc.
  roles:    {},   // AUTO_ROLE, MUTE_ROLE, etc.
  settings: {},   // overrides from /setup commands
};

let binId      = process.env[BIN_ENV] || null;
let saveTimer  = null;

// ── HTTP ──────────────────────────────────────────────────────
async function http(method, path, body) {
  const { default: fetch } = await import('node-fetch');
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': KEY, 'X-Bin-Private': 'true' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`JSONBin ${method} ${path} → ${res.status}`);
  return res.json();
}

// ── Load from JSONBin on startup ──────────────────────────────
async function load() {
  if (!KEY) {
    console.warn('⚠️  JSONBIN_KEY not set — channels/roles/settings will reset on restart!');
    console.warn('   Get a free key at jsonbin.io\n');
    return;
  }

  if (!binId) {
    // First ever run — create the bin
    const res = await http('POST', '/b', store);
    binId = res.metadata.id;
    console.log('\n📦 JSONBin created! Add this env var to Railway:');
    console.log(`   JSONBIN_BIN_pawbot=${binId}\n`);
    return;
  }

  try {
    const res = await http('GET', `/b/${binId}/latest`);
    Object.assign(store, res.record || {});
    if (!store.channels) store.channels = {};
    if (!store.roles)    store.roles    = {};
    if (!store.settings) store.settings = {};
    console.log(`📦 Store loaded — ${Object.keys(store.channels).length} channel(s), ${Object.keys(store.roles).length} role(s), ${Object.keys(store.settings).length} setting override(s)`);
  } catch (e) {
    console.error('❌ Failed to load store from JSONBin:', e.message);
  }
}

// ── Save (debounced — batches rapid changes into one write) ───
function save() {
  if (!KEY || !binId) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await http('PUT', `/b/${binId}`, store);
    } catch (e) {
      console.error('❌ JSONBin save failed:', e.message);
    }
  }, 500);
}

// ── Channels ──────────────────────────────────────────────────
function getChannel(key)        { return process.env[key] || store.channels[key] || null; }
function setChannel(key, value) { store.channels[key] = value; save(); }

// ── Roles ─────────────────────────────────────────────────────
function getRole(key)        { return process.env[key] || store.roles[key] || null; }
function setRole(key, value) { store.roles[key] = value; save(); }

// ── Settings ──────────────────────────────────────────────────
function getSetting(key, defaults) { return key in store.settings ? store.settings[key] : defaults[key]; }
function setSetting(key, value)    { store.settings[key] = value; save(); }
function delSetting(key)           { delete store.settings[key]; save(); }
function getOverrides()            { return { ...store.settings }; }

module.exports = { load, getChannel, setChannel, getRole, setRole, getSetting, setSetting, delSetting, getOverrides };
