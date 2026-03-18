const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, loadEvents } = require('./utils/loader');
const keepAlive  = require('./utils/keepalive');
const store      = require('./utils/store');
const settings   = require('./utils/settings');
const ids        = require('./utils/ids');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration,
  ],
});

client.settings  = settings;    // reads settings.js defaults, overrides from JSONBin
client.ids       = ids;          // reads channel/role IDs from JSONBin
client.commands  = new Collection();
client.cooldowns = new Collection();

// In-memory only — these intentionally reset on restart
client.warnings  = new Map();   // userId → [{ reason, mod }]
client.giveaways = new Map();   // messageId → setTimeout handle

keepAlive();

(async () => {
  await store.load();    // loads channels, roles, settings from JSONBin
  await loadCommands(client);
  await loadEvents(client);
  client.login(ids.BOT_TOKEN);
})();
