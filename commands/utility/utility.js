const { SlashCommandBuilder } = require('discord.js');
const emb     = require('../../utils/embed');
const { SYSTEMS } = require('../../utils/loader');

const userinfo = {
  data: new SlashCommandBuilder()
    .setName('userinfo').setDescription('View user info 👤')
    .addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user') || interaction.member;
    const user   = target.user;
    const roles  = target.roles.cache.filter(r => r.id !== interaction.guild.id).sort((a, b) => b.position - a.position);
    await interaction.reply({ embeds: [emb.base(client, target.displayHexColor || null)
      .setTitle(`👤 ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: '🏷️ Tag',         value: user.tag,  inline: true },
        { name: '🆔 ID',          value: user.id,   inline: true },
        { name: '🤖 Bot',         value: user.bot ? 'Yes' : 'No', inline: true },
        { name: '📅 Joined',      value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: '📅 Account Age', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: `🎭 Roles (${roles.size})`, value: roles.size ? roles.map(r => `<@&${r.id}>`).slice(0, 10).join(' ') : 'None' },
      )] });
  },
};

const serverinfo = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('View server info 📊'),
  async execute(interaction, client) {
    const g = interaction.guild;
    await interaction.reply({ embeds: [emb.base(client, 0x3498DB)
      .setTitle(`📊 ${g.name}`)
      .setThumbnail(g.iconURL())
      .addFields(
        { name: '👑 Owner',    value: `<@${g.ownerId}>`, inline: true },
        { name: '👥 Members', value: `${g.memberCount}`, inline: true },
        { name: '🌟 Boosts',  value: `${g.premiumSubscriptionCount} (Tier ${g.premiumTier})`, inline: true },
        { name: '💬 Text',    value: `${g.channels.cache.filter(c => c.type === 0).size}`, inline: true },
        { name: '🔊 Voice',   value: `${g.channels.cache.filter(c => c.type === 2).size}`, inline: true },
        { name: '🎭 Roles',   value: `${g.roles.cache.size}`, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true },
      )] });
  },
};

const avatar = {
  data: new SlashCommandBuilder()
    .setName('avatar').setDescription("Get a user's avatar 🖼️")
    .addUserOption(o => o.setName('user').setDescription('User')),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user') || interaction.user;
    await interaction.reply({ embeds: [emb.base(client)
      .setTitle(`🖼️ ${target.username}'s Avatar`)
      .setImage(target.displayAvatarURL({ size: 1024 }))
      .setDescription(`[PNG](${target.displayAvatarURL({ extension: 'png', size: 1024 })}) | [WEBP](${target.displayAvatarURL({ extension: 'webp', size: 1024 })})`)] });
  },
};

const ping = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Bot latency 🏓'),
  async execute(interaction, client) {
    const sent = await interaction.reply({ embeds: [emb.info(client, 'Pinging...', '...')], fetchReply: true });
    const ms   = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply({ embeds: [emb.base(client, ms < 100 ? 0x2ECC71 : ms < 200 ? 0xF39C12 : 0xE74C3C)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '⏱️ Roundtrip', value: `${ms}ms`, inline: true },
        { name: '💓 API',       value: `${Math.round(client.ws.ping)}ms`, inline: true },
      )] });
  },
};

const botinfo = {
  data: new SlashCommandBuilder().setName('botinfo').setDescription('About this bot 🤖'),
  async execute(interaction, client) {
    const up      = process.uptime();
    const uptime  = `${Math.floor(up / 86400)}d ${Math.floor((up % 86400) / 3600)}h ${Math.floor((up % 3600) / 60)}m`;
    const enabled = Object.entries(SYSTEMS)
      .filter(([, k]) => k === null || client.settings[k] !== false)
      .map(([name]) => name).join(', ');
    await interaction.reply({ embeds: [emb.base(client)
      .setTitle(`🤖 ${client.settings.bot_name}`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '⏰ Uptime',    value: uptime, inline: true },
        { name: '🏓 Ping',     value: `${Math.round(client.ws.ping)}ms`, inline: true },
        { name: '🖥️ Memory',   value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`, inline: true },
        { name: '📦 Commands', value: `${client.commands.size}`, inline: true },
        { name: '✅ Modules',  value: enabled },
      )] });
  },
};

const help = {
  data: new SlashCommandBuilder().setName('help').setDescription('All available commands 📖'),
  async execute(interaction, client) {
    const cats = {};
    for (const [, cmd] of client.commands) {
      const cat = cmd.data.name.split('-')[0];
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(`\`/${cmd.data.name}\``);
    }
    const embed = emb.base(client).setTitle(`📖 ${client.settings.bot_name} — Commands`);
    for (const [cat, cmds] of Object.entries(cats).sort()) {
      embed.addFields({ name: cat, value: cmds.join(' ') });
    }
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

module.exports = { userinfo, serverinfo, avatar, ping, botinfo, help };
