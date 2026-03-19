const fs   = require('fs');
const path = require('path');

// Maps folder name → settings.js key
// null = always load (admin commands)
const SYSTEMS = {
  fun:       'fun_system',
  polls:     'poll_system',
  giveaways: 'giveaway_system',
  furry:     'furry_system',
  fursuit:   'fursuit_system',
  moderation:'moderation_system',
  automod:   'automod_system',
  utility:   'utility_system',
  admin:     null,
};

async function loadCommands(client) {
  const dir = path.join(__dirname, '..', 'commands');
  let loaded = 0;

  for (const folder of fs.readdirSync(dir).sort()) {
    const folderPath = path.join(dir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const key = SYSTEMS[folder];
    if (key && client.settings[key] === false) {
      console.log(`⏭️  [${folder}] disabled`);
      continue;
    }

    for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
      const mod = require(path.join(folderPath, file));
      for (const cmd of Object.values(mod)) {
        if (cmd?.data?.name && cmd?.execute) {
          client.commands.set(cmd.data.name, cmd);
          loaded++;
        }
      }
    }
    console.log(`✅ [${folder}]`);
  }

  console.log(`\n🐾 ${loaded} commands ready\n`);
}

async function loadEvents(client) {
  const dir = path.join(__dirname, '..', 'events');
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(dir, file));
    const fn    = (...args) => event.execute(...args, client);
    event.once ? client.once(event.name, fn) : client.on(event.name, fn);
  }
}

module.exports = { loadCommands, loadEvents, SYSTEMS };
