module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    const typeMap = { PLAYING: 0, WATCHING: 3, LISTENING: 2, COMPETING: 5 };
    client.user.setActivity(client.settings.bot_status, {
      type: typeMap[client.settings.bot_status_type] ?? 3,
    });
    console.log(`\n🐾 ${client.user.tag} is online!`);
    console.log(`📡 ${client.guilds.cache.size} server | ${client.commands.size} commands\n`);
  },
};
