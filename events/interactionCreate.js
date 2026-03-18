const emb = require('../utils/embed');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // ── Cooldown check ──────────────────────────────────────
    if (!client.cooldowns.has(command.data.name)) {
      client.cooldowns.set(command.data.name, new Map());
    }

    const timestamps = client.cooldowns.get(command.data.name);
    const cdMs       = (command.cooldown || 3) * 1000;
    const now        = Date.now();

    if (timestamps.has(interaction.user.id)) {
      const expiry = timestamps.get(interaction.user.id) + cdMs;
      if (now < expiry) {
        const left = ((expiry - now) / 1000).toFixed(1);
        return interaction.reply({
          embeds: [emb.warn(client, 'Slow Down', `Wait **${left}s** before using that again.`)],
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cdMs);

    // ── Run command ─────────────────────────────────────────
    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(`❌ Error in /${command.data.name}:`, err);
      const reply = { embeds: [emb.error(client, 'Error', 'Something went wrong running that command.')], ephemeral: true };
      interaction.replied || interaction.deferred
        ? interaction.followUp(reply)
        : interaction.reply(reply);
    }
  },
};
