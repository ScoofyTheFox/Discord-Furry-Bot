const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const emb  = require('../../utils/embed');
const { CHANNEL_KEYS, ROLE_KEYS } = require('../../utils/ids');

// All /setup-* commands write to JSONBin via client.ids proxy
// Changes are instant and survive every restart automatically

const setupChannels = {
  data: new SlashCommandBuilder()
    .setName('setup-channels')
    .setDescription('Set bot channels — saved automatically 💾')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(o => o.setName('log')           .setDescription('Mod action logs (bans, kicks, warns)').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('member-log')    .setDescription('Member join/leave logs').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('welcome')       .setDescription('Welcome messages').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('goodbye')       .setDescription('Goodbye messages').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('giveaways')     .setDescription('Default giveaway channel').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('fursuit')       .setDescription('Fursuit submissions').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('announcements') .setDescription('Announcements').addChannelTypes(ChannelType.GuildText)),
  async execute(interaction, client) {
    const map = {
      'log':           'LOG_CHANNEL',
      'member-log':    'MEMBER_LOG_CHANNEL',
      'welcome':       'WELCOME_CHANNEL',
      'goodbye':       'GOODBYE_CHANNEL',
      'giveaways':     'GIVEAWAY_CHANNEL',
      'fursuit':       'FURSUIT_CHANNEL',
      'announcements': 'ANNOUNCEMENT_CHANNEL',
    };

    const changes = [];
    for (const [option, key] of Object.entries(map)) {
      const ch = interaction.options.getChannel(option);
      if (ch) {
        client.ids[key] = ch.id;   // saves to JSONBin automatically
        changes.push(`✔️ ${key} → <#${ch.id}>`);
      }
    }

    if (!changes.length) {
      return interaction.reply({ embeds: [emb.info(client, 'No Changes', 'Pass at least one channel option.')], ephemeral: true });
    }

    await interaction.reply({ embeds: [emb.success(client, 'Channels Saved 💾',
      changes.join('\n') + '\n\n*Saved to JSONBin — survives restarts and redeploys.*')], ephemeral: true });
  },
};

const setupRoles = {
  data: new SlashCommandBuilder()
    .setName('setup-roles')
    .setDescription('Set bot roles — saved automatically 💾')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(o => o.setName('auto-role')         .setDescription('Given to all new members'))
    .addRoleOption(o => o.setName('mute-role')         .setDescription('Role used for muting'))
    .addRoleOption(o => o.setName('announcement-ping') .setDescription('Pinged on announcements'))
    .addRoleOption(o => o.setName('giveaway-required') .setDescription('Required to enter giveaways'))
    .addRoleOption(o => o.setName('fursuit-ping')      .setDescription('Pinged on new fursuit posts')),
  async execute(interaction, client) {
    const map = {
      'auto-role':         'AUTO_ROLE',
      'mute-role':         'MUTE_ROLE',
      'announcement-ping': 'ANNOUNCEMENT_ROLE',
      'giveaway-required': 'GIVEAWAY_REQUIRED_ROLE',
      'fursuit-ping':      'FURSUIT_PING_ROLE',
    };

    const changes = [];
    for (const [option, key] of Object.entries(map)) {
      const role = interaction.options.getRole(option);
      if (role) {
        client.ids[key] = role.id;   // saves to JSONBin automatically
        changes.push(`✔️ ${key} → <@&${role.id}>`);
      }
    }

    if (!changes.length) {
      return interaction.reply({ embeds: [emb.info(client, 'No Changes', 'Pass at least one role option.')], ephemeral: true });
    }

    await interaction.reply({ embeds: [emb.success(client, 'Roles Saved 💾',
      changes.join('\n') + '\n\n*Saved to JSONBin — survives restarts and redeploys.*')], ephemeral: true });
  },
};

const setupView = {
  data: new SlashCommandBuilder()
    .setName('setup-view')
    .setDescription('View all current channel and role configuration 📋')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const ids = client.ids;

    const channelLines = [
      ['LOG_CHANNEL',          '📋 Mod Logs'],
      ['MEMBER_LOG_CHANNEL',   '👥 Member Logs'],
      ['WELCOME_CHANNEL',      '👋 Welcome'],
      ['GOODBYE_CHANNEL',      '👋 Goodbye'],
      ['GIVEAWAY_CHANNEL',     '🎁 Giveaways'],
      ['FURSUIT_CHANNEL',      '📸 Fursuit'],
      ['ANNOUNCEMENT_CHANNEL', '📣 Announcements'],
    ].map(([k, label]) => ids[k] ? `✅ ${label}: <#${ids[k]}>` : `❌ ${label}: *not set*`);

    const roleLines = [
      ['AUTO_ROLE',             '🎭 Auto Role'],
      ['MUTE_ROLE',             '🔇 Mute Role'],
      ['ANNOUNCEMENT_ROLE',     '📣 Announcement Ping'],
      ['GIVEAWAY_REQUIRED_ROLE','🎁 Giveaway Required'],
      ['FURSUIT_PING_ROLE',     '📸 Fursuit Ping'],
    ].map(([k, label]) => ids[k] ? `✅ ${label}: <@&${ids[k]}>` : `❌ ${label}: *not set*`);

    await interaction.reply({ embeds: [emb.base(client)
      .setTitle('📋 Current Configuration')
      .addFields(
        { name: '📺 Channels', value: channelLines.join('\n'), inline: false },
        { name: '🎭 Roles',    value: roleLines.join('\n'),    inline: false },
      ).setFooter({ text: '💾 Stored in JSONBin — survives restarts' })],
      ephemeral: true });
  },
};

module.exports = { setupChannels, setupRoles, setupView };
