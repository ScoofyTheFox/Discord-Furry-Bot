const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const emb = require('../../utils/embed');
const settings = require('../../settings');

// ─────────────────────────────────────────────
// Setup Channels
// ─────────────────────────────────────────────

const setupChannels = {
  data: new SlashCommandBuilder()
    .setName('setup-channels')
    .setDescription('Set bot channels — saved automatically 💾 (requires JSONBin)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(o => o.setName('log').setDescription('Mod action logs').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('member-log').setDescription('Member join/leave logs').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('welcome').setDescription('Welcome messages').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('goodbye').setDescription('Goodbye messages').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('giveaways').setDescription('Default giveaway channel').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('fursuit').setDescription('Fursuit submissions').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('announcements').setDescription('Announcements').addChannelTypes(ChannelType.GuildText)),

  async execute(interaction, client) {
    if (!process.env.JSONBIN_KEY) {
      return interaction.reply({
        embeds: [emb.warn(client, 'JSONBin Not Configured', 'This command requires a JSONBin API key to save settings.\nSet `JSONBIN_KEY` in your `.env` file — get a free key at **jsonbin.io**\n\nYou can still set channels manually in `settings.js`.')],
        flags: 64
      });
    }
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
        client.ids[key] = ch.id;
        changes.push(`✔️ ${key} → <#${ch.id}>`);
      }
    }

    if (!changes.length) {
      return interaction.reply({
        embeds: [emb.info(client, 'No Changes', 'Pass at least one channel option.')],
        flags: 64
      });
    }

    await interaction.reply({
      embeds: [emb.success(
        client,
        'Channels Saved 💾',
        changes.join('\n') + '\n\n*Saved to JSONBin — takes priority over manual settings.*'
      )],
      flags: 64
    });
  },
};

// ─────────────────────────────────────────────
// Setup Roles
// ─────────────────────────────────────────────

const setupRoles = {
  data: new SlashCommandBuilder()
    .setName('setup-roles')
    .setDescription('Set bot roles — saved automatically 💾 (requires JSONBin)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(o => o.setName('auto-role').setDescription('Given to all new members'))
    .addRoleOption(o => o.setName('mute-role').setDescription('Role used for muting'))
    .addRoleOption(o => o.setName('announcement-ping').setDescription('Pinged on announcements'))
    .addRoleOption(o => o.setName('giveaway-required').setDescription('Required to enter giveaways'))
    .addRoleOption(o => o.setName('fursuit-ping').setDescription('Pinged on fursuit posts')),

  async execute(interaction, client) {
    if (!process.env.JSONBIN_KEY) {
      return interaction.reply({
        embeds: [emb.warn(client, 'JSONBin Not Configured', 'This command requires a JSONBin API key to save settings.\nSet `JSONBIN_KEY` in your `.env` file — get a free key at **jsonbin.io**\n\nYou can still set roles manually in `settings.js`.')],
        flags: 64
      });
    }
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
        client.ids[key] = role.id;
        changes.push(`✔️ ${key} → <@&${role.id}>`);
      }
    }

    if (!changes.length) {
      return interaction.reply({
        embeds: [emb.info(client, 'No Changes', 'Pass at least one role option.')],
        flags: 64
      });
    }

    await interaction.reply({
      embeds: [emb.success(
        client,
        'Roles Saved 💾',
        changes.join('\n') + '\n\n*Saved to JSONBin — takes priority over manual settings.*'
      )],
      flags: 64
    });
  },
};

// ─────────────────────────────────────────────
// Setup View
// ─────────────────────────────────────────────

const setupView = {
  data: new SlashCommandBuilder()
    .setName('setup-view')
    .setDescription('View all current config 📋 (requires JSONBin to save)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    if (!process.env.JSONBIN_KEY) {
      return interaction.reply({
        embeds: [emb.warn(client, 'JSONBin Not Configured', 'JSONBin is not set up — saved settings are unavailable.\nSet `JSONBIN_KEY` in your `.env` to enable saving.\n\nYou can still configure everything manually in `settings.js`.')],
        flags: 64
      });
    }
    const ids = client.ids;
    const fallback = settings.channels || {};
    const fallbackRoles = settings.roles || {};

    const channelLines = [
      ['LOG_CHANNEL', '📋 Mod Logs', fallback.log],
      ['MEMBER_LOG_CHANNEL', '👥 Member Logs', fallback.member_log],
      ['WELCOME_CHANNEL', '👋 Welcome', fallback.welcome],
      ['GOODBYE_CHANNEL', '👋 Goodbye', fallback.goodbye],
      ['GIVEAWAY_CHANNEL', '🎁 Giveaways', fallback.giveaway],
      ['FURSUIT_CHANNEL', '📸 Fursuit', fallback.fursuit],
      ['ANNOUNCEMENT_CHANNEL', '📣 Announcements', fallback.announcements],
    ].map(([key, label, fallbackId]) => {
      const id = ids[key] || fallbackId;
      if (!id) return `❌ ${label}: *not set*`;
      return ids[key]
        ? `✅ ${label}: <#${id}> *(JSONBin)*`
        : `🟡 ${label}: <#${id}> *(manual)*`;
    });

    const roleLines = [
      ['AUTO_ROLE', '🎭 Auto Role', fallbackRoles.auto_role],
      ['MUTE_ROLE', '🔇 Mute Role', fallbackRoles.mute],
      ['ANNOUNCEMENT_ROLE', '📣 Announcement Ping', fallbackRoles.announcement],
      ['GIVEAWAY_REQUIRED_ROLE', '🎁 Giveaway Required', fallbackRoles.giveaway],
      ['FURSUIT_PING_ROLE', '📸 Fursuit Ping', fallbackRoles.fursuit],
    ].map(([key, label, fallbackId]) => {
      const id = ids[key] || fallbackId;
      if (!id) return `❌ ${label}: *not set*`;
      return ids[key]
        ? `✅ ${label}: <@&${id}> *(JSONBin)*`
        : `🟡 ${label}: <@&${id}> *(manual)*`;
    });

    await interaction.reply({
      embeds: [
        emb.base(client)
          .setTitle('📋 Current Configuration')
          .addFields(
            { name: '📺 Channels', value: channelLines.join('\n'), inline: false },
            { name: '🎭 Roles', value: roleLines.join('\n'), inline: false }
          )
          .setFooter({ text: 'JSONBin takes priority over manual settings' })
      ],
      flags: 64
    });
  },
};

module.exports = { setupChannels, setupRoles, setupView };
