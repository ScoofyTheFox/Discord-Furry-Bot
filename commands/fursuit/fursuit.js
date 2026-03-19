const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emb = require('../../utils/embed');

const fursuitCheck = {
  data: new SlashCommandBuilder()
    .setName('fursuit-check').setDescription('Submit your fursuit for the daily check! 🦊')
    .addStringOption(o => o.setName('image').setDescription('Image URL').setRequired(true))
    .addStringOption(o => o.setName('name').setDescription('Fursuit/fursona name').setRequired(true))
    .addStringOption(o => o.setName('species').setDescription('Species')),
  async execute(interaction, client) {
    const s       = client.settings;
    const image   = interaction.options.getString('image');
    const name    = interaction.options.getString('name');
    const species = interaction.options.getString('species') || 'Unknown';

    const channelId = client.ids.FURSUIT_CHANNEL;
    if (!channelId) {
      return interaction.reply({ embeds: [emb.error(client, 'Not Configured', 'Set a fursuit channel with `/setup-channels`.')], flags: 64 });
    }

    const channel = interaction.guild.channels.cache.get(channelId);
    if (!channel) {
      return interaction.reply({ embeds: [emb.error(client, 'Not Found', 'Fursuit channel not found. Check `/setup-channels`.')], flags: 64 });
    }

    const pingRole = s.fursuit_ping_on_post && client.ids.FURSUIT_PING_ROLE;
    const msg = await channel.send({
      content: pingRole ? `<@&${client.ids.FURSUIT_PING_ROLE}>` : undefined,
      embeds: [new EmbedBuilder().setColor(0xFF69B4)
        .setTitle(`🐾 Fursuit Check — ${name}`)
        .setDescription(`**Suiter:** <@${interaction.user.id}>\n**Species:** ${species}`)
        .setImage(image)
        .setFooter({ text: `Rate it! ${s.fursuit_vote_emojis.join(' ')}` })
        .setTimestamp()],
    });

    for (const emoji of s.fursuit_vote_emojis) await msg.react(emoji).catch(() => {});

    await interaction.reply({ embeds: [emb.success(client, 'Submitted! 🐾', `Posted to <#${channelId}>!`)], flags: 64 });
  },
};

module.exports = { fursuitCheck };
