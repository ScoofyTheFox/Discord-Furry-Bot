const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const emb = require('../../utils/embed');

async function endGiveaway(client, { prize, winnerCount, channelId, messageId, host }) {
  try {
    const channel  = client.channels.cache.get(channelId);
    if (!channel) return;
    const msg      = await channel.messages.fetch(messageId);
    const reaction = msg.reactions.cache.get('🎉');
    const users    = reaction ? await reaction.users.fetch() : null;
    const entries  = users ? users.filter(u => !u.bot).map(u => u) : [];

    const endEmbed = new EmbedBuilder()
      .setColor(0x95A5A6).setTitle('🎉 GIVEAWAY ENDED')
      .setFooter({ text: `Hosted by ${host}` }).setTimestamp();

    if (!entries.length) {
      endEmbed.setDescription(`**${prize}**\n\n😔 No one entered!`);
      await msg.edit({ embeds: [endEmbed] });
      return;
    }

    const pool    = [...entries];
    const winners = [];
    for (let i = 0; i < Math.min(winnerCount, pool.length); i++) {
      const idx = Math.floor(Math.random() * pool.length);
      winners.push(pool.splice(idx, 1)[0]);
    }

    const mentions = winners.map(w => `<@${w.id}>`).join(', ');
    endEmbed.setDescription(`**${prize}**\n\n🏆 Winners: ${mentions}`);
    await msg.edit({ embeds: [endEmbed] });

    if (client.settings.giveaway_announce_in_channel) {
      channel.send(`🎉 Congratulations ${mentions}! You won **${prize}**!`);
    }
    if (client.settings.giveaway_dm_winner) {
      winners.forEach(w => w.send(`🎉 You won **${prize}**!`).catch(() => {}));
    }
  } catch (e) {
    console.error('Giveaway end error:', e.message);
  }
  client.giveaways.delete(messageId);
}

const giveaway = {
  data: new SlashCommandBuilder()
    .setName('giveaway').setDescription('Start a giveaway 🎉')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName('prize').setDescription('Prize').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Duration in minutes').setRequired(true).setMinValue(1).setMaxValue(10080))
    .addIntegerOption(o => o.setName('winners').setDescription('Number of winners').setMinValue(1).setMaxValue(10))
    .addChannelOption(o => o.setName('channel').setDescription('Channel to post in')),
  cooldown: 10,
  async execute(interaction, client) {
    const s           = client.settings;
    const prize       = interaction.options.getString('prize');
    const minutes     = interaction.options.getInteger('minutes');
    const winnerCount = Math.min(interaction.options.getInteger('winners') || 1, s.giveaway_max_winners);
    const channelId   = interaction.options.getChannel('channel')?.id || client.ids.GIVEAWAY_CHANNEL || interaction.channelId;
    const channel     = interaction.guild.channels.cache.get(channelId);

    if (!channel) {
      return interaction.reply({ embeds: [emb.error(client, 'No Channel', 'Set a giveaway channel with `/setup-channels`.')], ephemeral: true });
    }

    const endTime = Date.now() + minutes * 60 * 1000;
    const data    = { prize, winnerCount, channelId, host: interaction.user.username };

    const msg = await channel.send({
      embeds: [new EmbedBuilder().setColor(0xF1C40F).setTitle('🎉 GIVEAWAY!')
        .setDescription(`**${prize}**\n\nReact with 🎉 to enter!\n\n🏆 Winners: **${winnerCount}**\n⏰ Ends: <t:${Math.floor(endTime / 1000)}:R>`)
        .setFooter({ text: `Hosted by ${interaction.user.username}` }).setTimestamp(endTime)],
    });
    await msg.react('🎉');

    data.messageId = msg.id;
    const timer = setTimeout(() => endGiveaway(client, data), minutes * 60 * 1000);
    client.giveaways.set(msg.id, timer);

    await interaction.reply({ embeds: [emb.success(client, 'Giveaway Started! 🎉',
      channelId !== interaction.channelId
        ? `Posted in <#${channelId}>!`
        : `Ends <t:${Math.floor(endTime / 1000)}:R>`)], ephemeral: true });
  },
};

const giveawayReroll = {
  data: new SlashCommandBuilder()
    .setName('giveaway-reroll').setDescription('Reroll a giveaway winner 🎲')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName('message-id').setDescription('Message ID of the giveaway').setRequired(true)),
  async execute(interaction, client) {
    try {
      const msg      = await interaction.channel.messages.fetch(interaction.options.getString('message-id'));
      const reaction = msg?.reactions.cache.get('🎉');
      if (!reaction) return interaction.reply({ embeds: [emb.error(client, 'Not Found', 'Could not find that giveaway.')], ephemeral: true });
      const users   = await reaction.users.fetch();
      const entries = users.filter(u => !u.bot).map(u => u);
      if (!entries.length) return interaction.reply({ embeds: [emb.warn(client, 'No Entries', 'No one to reroll.')], ephemeral: true });
      const winner = entries[Math.floor(Math.random() * entries.length)];
      await interaction.reply({ embeds: [emb.success(client, '🎲 Rerolled!', `New winner: <@${winner.id}>!`)] });
    } catch {
      await interaction.reply({ embeds: [emb.error(client, 'Error', 'Could not reroll that giveaway.')], ephemeral: true });
    }
  },
};

module.exports = { giveaway, giveawayReroll };
