module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    const s = client.settings;
    if (!s.goodbye_enabled) return;

    const channelId = client.ids.GOODBYE_CHANNEL || client.ids.WELCOME_CHANNEL;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    channel.send(s.goodbye_message
      .replace('{user}',     member.user.tag)
      .replace('{username}', member.user.username)
      .replace('{server}',   member.guild.name));
  },
};
