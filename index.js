const fs = require('fs');

// ── Environment loading ──────────────────────────────────────────
// Railway variables are already in process.env before the app starts.
// .env is loaded AFTER so Railway vars always win (dotenv skips vars
// that are already set unless you use { override: false } which is default).
//
// Priority: Railway dashboard > .env file > unset
if (fs.existsSync('./.env')) {
  require('dotenv').config(); // dotenv won't overwrite already-set env vars
  const onRailway = !!process.env.RAILWAY_PUBLIC_DOMAIN || !!process.env.RAILWAY_ENVIRONMENT;
  if (onRailway) {
    console.log('🚆 Railway detected — Railway variables take priority over .env');
  } else {
    console.log('📄 Loaded .env file (local dev)');
  }
} else {
  console.log('🚆 No .env file — using Railway/system environment variables');
}

console.log(`
                     0                                     0                     
                   000000                               000000                   
                 000000000000                       000000000000                 
                0000000000000000                 0000000000000000                
              00000000 000000000000           000000000000  0000000              
             0000000       0000000000       0000000000       0000000             
             000000           00000000     00000000           000000             
             00000              000000     000000              00000             
            000000                 000     0000                000000            
            000000                   0     0                   000000            
            000000                                             000000            
                                                                                 
                                                                                 
            00000            0                                  00000            
            00000          00000                                00000            
            00000        0000 00000                             00000            
            00000      0000     0000                            00000            
            00000      000                                      00000            
            00000      000                                      00000            
            00000      0000                                     00000            
            00000       00000                                   00000            
            00000         00000              000000      00     00000            
            00000           00000         00000000       00     00000            
            00000             0000       0000        0000000000 00000            
            00000               0000    000              00     00000            
            00000                0000   000          00  00 000 00000            
            00000     000       0000    000          0000 0000  00000            
            00000     000000000000      000            00000    00000            
            00000          00000        0000000000     000000   00000            
            00000                          00000000000000  000  00000            
            00000                                               00000            
                                                                                 
                                                                                 
              000000000000000                       000000000000000              
                 0000000000000000               0000000000000000                 
                     00000000000000000     00000000000000000                     
                           00000000000     00000000000                           
                               0000000     0000000                               
                                    00     00
`);
console.log('  🐾 FurBot is starting up...\n');



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
  // Validate required env vars before attempting login
  const token = ids.BOT_TOKEN;
  const onRailway = !!process.env.RAILWAY_PUBLIC_DOMAIN || !!process.env.RAILWAY_ENVIRONMENT;
  if (!token) {
    console.error('\n❌ BOT_TOKEN is not set!');
    if (onRailway) {
      console.error('   → Go to your Railway project → Variables tab → add BOT_TOKEN');
    } else {
      console.error('   → Fill in BOT_TOKEN in your .env file');
      console.error('   → See .env.example for all required variables');
    }
    console.error('');
    process.exit(1);
  }
  const tokenSource = onRailway ? 'Railway dashboard' : '.env file';
  console.log(`🔑 Token source: ${tokenSource}`);


  await store.load();
  await loadCommands(client);
  await loadEvents(client);
  client.login(token);
})();
