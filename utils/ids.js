// Wraps store so client.ids.LOG_CHANNEL works naturally
// Writing saves to JSONBin automatically
// Credentials (BOT_TOKEN etc.) always come from env vars, never stored

require('dotenv').config();
const store = require('./store');

// All the channel and role keys the bot uses
// Makes it easy to see everything in one place
const CHANNEL_KEYS = [
  'LOG_CHANNEL',
  'MEMBER_LOG_CHANNEL',
  'WELCOME_CHANNEL',
  'GOODBYE_CHANNEL',
  'GIVEAWAY_CHANNEL',
  'FURSUIT_CHANNEL',
  'ANNOUNCEMENT_CHANNEL',
];

const ROLE_KEYS = [
  'AUTO_ROLE',
  'MUTE_ROLE',
  'ANNOUNCEMENT_ROLE',
  'GIVEAWAY_REQUIRED_ROLE',
  'FURSUIT_PING_ROLE',
];

module.exports = new Proxy({}, {
  get(_, key) {
    // Credentials always from Railway env vars
    if (['BOT_TOKEN', 'CLIENT_ID', 'GUILD_ID'].includes(key)) {
      return process.env[key] || null;
    }
    // Channels
    if (CHANNEL_KEYS.includes(key)) return store.getChannel(key);
    // Roles
    if (ROLE_KEYS.includes(key)) return store.getRole(key);
    // Anything else (e.g. unknown key) — null
    return null;
  },
  set(_, key, value) {
    if (CHANNEL_KEYS.includes(key)) store.setChannel(key, value);
    else if (ROLE_KEYS.includes(key)) store.setRole(key, value);
    return true;
  },
});

module.exports.CHANNEL_KEYS = CHANNEL_KEYS;
module.exports.ROLE_KEYS    = ROLE_KEYS;
