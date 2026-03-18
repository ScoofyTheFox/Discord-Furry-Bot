require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { SYSTEMS } = require('./utils/loader');
const settings = require('./settings');
const fs   = require('fs');
const path = require('path');

const token    = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId  = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error('❌ Missing BOT_TOKEN, CLIENT_ID, or GUILD_ID in .env');
  process.exit(1);
}

const commands     = [];
const commandsPath = path.join(__dirname, 'commands');

for (const folder of fs.readdirSync(commandsPath).sort()) {
  const folderPath = path.join(commandsPath, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  const key = SYSTEMS[folder];
  if (key && settings[key] === false) {
    console.log(`⏭️  [${folder}] disabled — skipping`);
    continue;
  }

  for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
    const mod = require(path.join(folderPath, file));
    for (const cmd of Object.values(mod)) {
      if (cmd?.data?.toJSON) commands.push(cmd.data.toJSON());
    }
  }
}

(async () => {
  const rest = new REST().setToken(token);
  console.log(`🔄 Deploying ${commands.length} commands to guild ${guildId}...`);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
  console.log(`✅ Done! Registered: ${commands.map(c => `/${c.name}`).join(', ')}`);
})().catch(console.error);
