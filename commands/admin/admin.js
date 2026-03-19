const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const emb     = require('../../utils/embed');
const { SYSTEMS } = require('../../utils/loader');

const adminSay = {
  data: new SlashCommandBuilder()
    .setName('admin-say').setDescription('Make the bot say something 📢')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('message').setDescription('Message').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Channel (default: current)')),
  async execute(interaction, client) {
    const msg = interaction.options.getString('message');
    const ch  = interaction.options.getChannel('channel') || interaction.channel;
    await ch.send(msg);
    await interaction.reply({ embeds: [emb.success(client, 'Sent', `Message sent to <#${ch.id}>`)], flags: 64 });
  },
};

const adminEmbed = {
  data: new SlashCommandBuilder()
    .setName('admin-embed').setDescription('Send a custom embed 📋')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('title').setDescription('Title').setRequired(true))
    .addStringOption(o => o.setName('description').setDescription('Description').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Channel'))
    .addStringOption(o => o.setName('color').setDescription('Hex color e.g. #FF69B4'))
    .addStringOption(o => o.setName('image').setDescription('Image URL'))
    .addStringOption(o => o.setName('footer').setDescription('Footer text')),
  async execute(interaction, client) {
    const ch      = interaction.options.getChannel('channel') || interaction.channel;
    const colorRaw = interaction.options.getString('color');
    let color     = client.settings.bot_color;
    if (colorRaw) { const p = parseInt(colorRaw.replace('#', ''), 16); if (!isNaN(p)) color = p; }

    const e = new EmbedBuilder()
      .setColor(color)
      .setTitle(interaction.options.getString('title'))
      .setDescription(interaction.options.getString('description'))
      .setTimestamp();

    const img = interaction.options.getString('image');
    const ftr = interaction.options.getString('footer');
    if (img) e.setImage(img);
    if (ftr) e.setFooter({ text: ftr });

    await ch.send({ embeds: [e] });
    await interaction.reply({ embeds: [emb.success(client, 'Sent', `Embed sent to <#${ch.id}>`)], flags: 64 });
  },
};

const adminDm = {
  data: new SlashCommandBuilder()
    .setName('admin-dm').setDescription('DM a user as the bot 📩')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Message').setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    try {
      await target.send(interaction.options.getString('message'));
      await interaction.reply({ embeds: [emb.success(client, 'DM Sent', `Sent to **${target.tag}**`)], flags: 64 });
    } catch {
      await interaction.reply({ embeds: [emb.error(client, 'Failed', `**${target.tag}** has DMs disabled.`)], flags: 64 });
    }
  },
};

const adminAnnounce = {
  data: new SlashCommandBuilder()
    .setName('admin-announce').setDescription('Post an announcement 📣')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('message').setDescription('Announcement').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Channel (default: ANNOUNCEMENT_CHANNEL)'))
    .addBooleanOption(o => o.setName('ping').setDescription('Ping announcement role?')),
  async execute(interaction, client) {
    const s         = client.settings;
    const msg       = interaction.options.getString('message');
    const channelId = interaction.options.getChannel('channel')?.id || client.ids.ANNOUNCEMENT_CHANNEL;
    if (!channelId) return interaction.reply({ embeds: [emb.error(client, 'No Channel', 'Set one with `/setup-channels`.')], flags: 64 });

    const ch = interaction.guild.channels.cache.get(channelId);
    if (!ch) return interaction.reply({ embeds: [emb.error(client, 'Not Found', 'Channel not found.')], flags: 64 });

    const doPing = interaction.options.getBoolean('ping') ?? false;
    const ping   = doPing ? (client.ids.ANNOUNCEMENT_ROLE ? `<@&${client.ids.ANNOUNCEMENT_ROLE}>` : '@everyone') : undefined;

    if (s.announcement_use_embed) {
      await ch.send({ content: ping, embeds: [new EmbedBuilder()
        .setColor(s.announcement_embed_color)
        .setTitle('📣 Announcement')
        .setDescription(msg)
        .setFooter({ text: `Posted by ${interaction.user.username}` })
        .setTimestamp()] });
    } else {
      await ch.send((ping ? ping + '\n' : '') + msg);
    }

    await interaction.reply({ embeds: [emb.success(client, 'Announced', `Posted to <#${channelId}>`)], flags: 64 });
  },
};

const adminGiveRole = {
  data: new SlashCommandBuilder()
    .setName('admin-give-role').setDescription('Give a role to a user or everyone 🎭')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))
    .addUserOption(o => o.setName('user').setDescription('User (blank = everyone)'))
    .addBooleanOption(o => o.setName('everyone').setDescription('Give to ALL members?')),
  async execute(interaction, client) {
    const role     = interaction.options.getRole('role');
    const target   = interaction.options.getMember('user');
    const everyone = interaction.options.getBoolean('everyone');

    if (everyone) {
      await interaction.reply({ embeds: [emb.info(client, 'Processing...', `Giving **${role.name}** to all members.`)], flags: 64 });
      const members = await interaction.guild.members.fetch();
      let count = 0;
      for (const [, m] of members) { await m.roles.add(role).catch(() => {}); count++; }
      await interaction.editReply({ embeds: [emb.success(client, 'Done', `Added **${role.name}** to **${count}** members.`)] });
    } else if (target) {
      await target.roles.add(role);
      await interaction.reply({ embeds: [emb.success(client, 'Role Given', `<@&${role.id}> → **${target.user.tag}**`)], flags: 64 });
    } else {
      await interaction.reply({ embeds: [emb.error(client, 'No Target', 'Specify a user or set `everyone: true`')], flags: 64 });
    }
  },
};

const adminRemoveRole = {
  data: new SlashCommandBuilder()
    .setName('admin-remove-role').setDescription('Remove a role from a user or everyone 🎭')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))
    .addUserOption(o => o.setName('user').setDescription('User (blank = everyone)'))
    .addBooleanOption(o => o.setName('everyone').setDescription('Remove from ALL members?')),
  async execute(interaction, client) {
    const role     = interaction.options.getRole('role');
    const target   = interaction.options.getMember('user');
    const everyone = interaction.options.getBoolean('everyone');

    if (everyone) {
      await interaction.reply({ embeds: [emb.info(client, 'Processing...', `Removing **${role.name}** from all.`)], flags: 64 });
      const members = await interaction.guild.members.fetch();
      let count = 0;
      for (const [, m] of members) { if (m.roles.cache.has(role.id)) { await m.roles.remove(role).catch(() => {}); count++; } }
      await interaction.editReply({ embeds: [emb.success(client, 'Done', `Removed **${role.name}** from **${count}** members.`)] });
    } else if (target) {
      await target.roles.remove(role);
      await interaction.reply({ embeds: [emb.success(client, 'Role Removed', `Removed from **${target.user.tag}**`)], flags: 64 });
    } else {
      await interaction.reply({ embeds: [emb.error(client, 'No Target', 'Specify a user or set `everyone: true`')], flags: 64 });
    }
  },
};

const adminNick = {
  data: new SlashCommandBuilder()
    .setName('admin-nick').setDescription("Change a user's nickname ✏️")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('nickname').setDescription('New nickname (blank = reset)')),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const nick   = interaction.options.getString('nickname') || null;
    await target.setNickname(nick);
    await interaction.reply({ embeds: [emb.success(client, 'Updated', nick ? `Nickname set to **${nick}**` : 'Nickname reset')], flags: 64 });
  },
};

const adminSetstatus = {
  data: new SlashCommandBuilder()
    .setName('admin-setstatus').setDescription("Change the bot's status 🟢")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('status').setDescription('Status text').setRequired(true))
    .addStringOption(o => o.setName('type').setDescription('Activity type').addChoices(
      { name: 'Playing',   value: 'PLAYING' },
      { name: 'Watching',  value: 'WATCHING' },
      { name: 'Listening', value: 'LISTENING' },
      { name: 'Competing', value: 'COMPETING' },
    )),
  async execute(interaction, client) {
    const status  = interaction.options.getString('status');
    const type    = interaction.options.getString('type') || 'WATCHING';
    const typeMap = { PLAYING: 0, WATCHING: 3, LISTENING: 2, COMPETING: 5 };
    client.user.setActivity(status, { type: typeMap[type] ?? 3 });
    client.settings.bot_status      = status;   // saved to JSONBin
    client.settings.bot_status_type = type;
    await interaction.reply({ embeds: [emb.success(client, 'Status Updated 💾', `Now **${type}** "${status}"`)], flags: 64 });
  },
};

const adminConfig = {
  data: new SlashCommandBuilder()
    .setName('admin-config').setDescription('View current configuration ⚙️')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const s = client.settings;
    const systems = Object.entries(SYSTEMS).map(([name, key]) =>
      `${key === null || s[key] !== false ? '✅' : '❌'} ${name}`
    );
    const half = Math.ceil(systems.length / 2);
    await interaction.reply({ embeds: [emb.base(client)
      .setTitle('⚙️ Configuration')
      .addFields(
        { name: 'Systems',       value: systems.slice(0, half).join('\n'), inline: true },
        { name: '​',              value: systems.slice(half).join('\n'),    inline: true },
        { name: '🤖 Status',    value: `${s.bot_status_type} "${s.bot_status}"`, inline: false },
      ).setFooter({ text: 'Edit settings.js in GitHub to change defaults' })],
      flags: 64 });
  },
};

const adminInfo = {
  data: new SlashCommandBuilder()
    .setName('admin-info').setDescription('List all admin commands 👑')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    await interaction.reply({ embeds: [emb.base(client, 0x9B59B6)
      .setTitle('👑 Admin Commands')
      .addFields(
        { name: '📢 Send',     value: '`/admin-say` `/admin-embed` `/admin-dm` `/admin-announce`' },
        { name: '🎭 Roles',   value: '`/admin-give-role` `/admin-remove-role`' },
        { name: '✏️ Manage',  value: '`/admin-nick` `/admin-setstatus`' },
        { name: '⚙️ Setup',   value: '`/setup-channels` `/setup-roles` `/setup-view` `/admin-config`' },
      )], flags: 64 });
  },
};

module.exports = { adminSay, adminEmbed, adminDm, adminAnnounce, adminGiveRole, adminRemoveRole, adminNick, adminSetstatus, adminConfig, adminInfo };
