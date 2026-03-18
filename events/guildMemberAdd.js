const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const s = client.settings;

    const autoRole = client.ids.AUTO_ROLE;
    if (autoRole) member.roles.add(autoRole).catch(() => {});

    if (!s.welcome_system) return;

    const channelId = client.ids.WELCOME_CHANNEL;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const fmt = str => str
      .replace('{user}',     `<@${member.id}>`)
      .replace('{username}', member.user.username)
      .replace('{server}',   member.guild.name)
      .replace('{count}',    member.guild.memberCount);

    if (s.welcome_embed) {
      channel.send({
        content: s.welcome_ping ? `<@${member.id}>` : undefined,
        embeds: [new EmbedBuilder()
          .setColor(s.welcome_embed_color)
          .setTitle(`👋 Welcome to ${member.guild.name}!`)
          .setDescription(fmt(s.welcome_message))
          .setThumbnail(member.user.displayAvatarURL())
          .addFields(
            { name: '📅 Account Age', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: '👥 Member #',    value: `${member.guild.memberCount}`, inline: true },
          ).setTimestamp()],
      });
    } else {
      channel.send((s.welcome_ping ? `<@${member.id}> ` : '') + fmt(s.welcome_message));
    }

    if (s.welcome_dm) {
      member.send(fmt(s.welcome_dm_message)).catch(() => {});
    }
  },
};
