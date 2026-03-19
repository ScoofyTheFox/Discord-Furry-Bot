const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const emb = require('../../utils/embed');

function sendLog(client, guild, embed) {
  const ch = guild.channels.cache.get(client.ids.LOG_CHANNEL);
  if (ch) ch.send({ embeds: [embed] });
}

function dmUser(client, user, guild, action, reason) {
  if (!client.settings.moderation_dm_on_action) return;
  user.send(`⚠️ You were **${action}** in **${guild.name}**.\n📝 Reason: ${reason}`).catch(() => {});
}

const kick = {
  data: new SlashCommandBuilder()
    .setName('kick').setDescription('Kick a member 👢')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    if (!target?.kickable) return interaction.reply({ embeds: [emb.error(client, 'Cannot Kick', 'I cannot kick that user.')], flags: 64 });
    dmUser(client, target.user, interaction.guild, 'kicked', reason);
    await target.kick(reason);
    await interaction.reply({ embeds: [emb.warn(client, 'Member Kicked', `**${target.user.tag}** was kicked.\n📝 ${reason}`)] });
    sendLog(client, interaction.guild, new EmbedBuilder().setColor(0xE67E22).setTitle('👢 Kick')
      .addFields({ name: 'User', value: target.user.tag, inline: true }, { name: 'Mod', value: interaction.user.tag, inline: true }, { name: 'Reason', value: reason }).setTimestamp());
  },
};

const ban = {
  data: new SlashCommandBuilder()
    .setName('ban').setDescription('Ban a member 🔨')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .addIntegerOption(o => o.setName('days').setDescription('Delete message history (0-7)').setMinValue(0).setMaxValue(7)),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const days   = interaction.options.getInteger('days') || 0;
    if (!target?.bannable) return interaction.reply({ embeds: [emb.error(client, 'Cannot Ban', 'I cannot ban that user.')], flags: 64 });
    dmUser(client, target.user, interaction.guild, 'banned', reason);
    await target.ban({ deleteMessageDays: days, reason });
    await interaction.reply({ embeds: [emb.base(client, 0xE74C3C).setTitle('🔨 Member Banned').setDescription(`**${target.user.tag}** banned.\n📝 ${reason}`)] });
    sendLog(client, interaction.guild, new EmbedBuilder().setColor(0xE74C3C).setTitle('🔨 Ban')
      .addFields({ name: 'User', value: target.user.tag, inline: true }, { name: 'Mod', value: interaction.user.tag, inline: true }, { name: 'Reason', value: reason }).setTimestamp());
  },
};

const unban = {
  data: new SlashCommandBuilder()
    .setName('unban').setDescription('Unban a user 🔓')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  async execute(interaction, client) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      await interaction.guild.members.unban(userId, reason);
      await interaction.reply({ embeds: [emb.success(client, 'Unbanned', `<@${userId}> unbanned.`)] });
    } catch {
      await interaction.reply({ embeds: [emb.error(client, 'Failed', 'User not found in ban list.')], flags: 64 });
    }
  },
};

const timeout = {
  data: new SlashCommandBuilder()
    .setName('timeout').setDescription('Timeout a member ⏱️')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Duration').setRequired(true).setMinValue(1).setMaxValue(10080))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  async execute(interaction, client) {
    const target  = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes');
    const reason  = interaction.options.getString('reason') || 'No reason provided';
    dmUser(client, target.user, interaction.guild, `timed out for ${minutes}m`, reason);
    await target.timeout(minutes * 60 * 1000, reason);
    await interaction.reply({ embeds: [emb.warn(client, 'Timed Out', `**${target.user.tag}** timed out for **${minutes}m**.\n📝 ${reason}`)] });
  },
};

const untimeout = {
  data: new SlashCommandBuilder()
    .setName('untimeout').setDescription('Remove a timeout ✅')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getMember('user');
    await target.timeout(null);
    await interaction.reply({ embeds: [emb.success(client, 'Timeout Removed', `**${target.user.tag}**'s timeout removed.`)] });
  },
};

// Warnings are in-memory — they reset on restart
// That's fine because bans/kicks/timeouts are enforced by Discord itself
const warn = {
  data: new SlashCommandBuilder()
    .setName('warn').setDescription('Warn a member ⚠️')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction, client) {
    const s      = client.settings;
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const warns  = client.warnings.get(target.id) || [];
    warns.push({ reason, mod: interaction.user.tag });
    client.warnings.set(target.id, warns);

    await interaction.reply({ embeds: [emb.warn(client, 'Member Warned',
      `**${target.tag}** warned (${warns.length}/${s.moderation_max_warnings}).\n📝 ${reason}\n\n*Note: warnings clear if the bot restarts.*`)] });

    dmUser(client, target, interaction.guild, 'warned', reason);

    if (warns.length >= s.moderation_max_warnings && s.moderation_warn_action !== 'none') {
      const member = await interaction.guild.members.fetch(target.id).catch(() => null);
      if (!member) return;
      if (s.moderation_warn_action === 'ban'     && member.bannable) { await member.ban({ reason: 'Reached max warnings' }); interaction.followUp({ embeds: [emb.base(client, 0xE74C3C).setDescription(`🔨 **${target.tag}** auto-banned.`)] }); }
      if (s.moderation_warn_action === 'kick'    && member.kickable) { await member.kick('Reached max warnings'); interaction.followUp({ embeds: [emb.base(client, 0xE67E22).setDescription(`👢 **${target.tag}** auto-kicked.`)] }); }
      if (s.moderation_warn_action === 'timeout')                    { await member.timeout(s.moderation_warn_timeout_mins * 60000, 'Max warnings'); interaction.followUp({ embeds: [emb.warn(client, 'Auto Timeout', `**${target.tag}** timed out for ${s.moderation_warn_timeout_mins}m.`)] }); }
    }
  },
};

const warnings = {
  data: new SlashCommandBuilder()
    .setName('warnings').setDescription('View warnings for a user 📋')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const warns  = client.warnings.get(target.id) || [];
    if (!warns.length) return interaction.reply({ embeds: [emb.success(client, 'Clean', `**${target.tag}** has no warnings this session.`)], flags: 64 });
    const lines = warns.map((w, i) => `**${i + 1}.** ${w.reason} — *${w.mod}*`);
    await interaction.reply({ embeds: [emb.warn(client, `Warnings — ${target.tag}`, lines.join('\n') + '\n\n*Resets on bot restart.*')], flags: 64 });
  },
};

const clearwarns = {
  data: new SlashCommandBuilder()
    .setName('clearwarns').setDescription('Clear warnings for a user ✅')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    client.warnings.delete(target.id);
    await interaction.reply({ embeds: [emb.success(client, 'Cleared', `Warnings cleared for **${target.tag}**`)], flags: 64 });
  },
};

const purge = {
  data: new SlashCommandBuilder()
    .setName('purge').setDescription('Bulk delete messages 🗑️')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(o => o.setName('amount').setDescription('1-100').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('user').setDescription('Only from this user')),
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });
    const amount     = interaction.options.getInteger('amount');
    const filterUser = interaction.options.getUser('user');
    let messages     = await interaction.channel.messages.fetch({ limit: 100 });
    if (filterUser) messages = messages.filter(m => m.author.id === filterUser.id);
    const deleted = await interaction.channel.bulkDelete([...messages.values()].slice(0, amount), true);
    await interaction.editReply({ embeds: [emb.success(client, 'Purged', `Deleted **${deleted.size}** messages.`)] });
  },
};

const slowmode = {
  data: new SlashCommandBuilder()
    .setName('slowmode').setDescription('Set channel slowmode 🐌')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(o => o.setName('seconds').setDescription('0 to disable').setRequired(true).setMinValue(0).setMaxValue(21600)),
  async execute(interaction, client) {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply({ embeds: [emb.success(client, 'Slowmode', seconds === 0 ? 'Disabled.' : `Set to **${seconds}s**.`)] });
  },
};

const lock = {
  data: new SlashCommandBuilder()
    .setName('lock').setDescription('Lock this channel 🔒')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(o => o.setName('reason').setDescription('Reason')),
  async execute(interaction, client) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
    await interaction.reply({ embeds: [emb.base(client, 0xE74C3C)
      .setTitle('🔒 Channel Locked')
      .setDescription(interaction.options.getString('reason') || 'Channel locked by moderator.')] });
  },
};

const unlock = {
  data: new SlashCommandBuilder()
    .setName('unlock').setDescription('Unlock this channel 🔓')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction, client) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
    await interaction.reply({ embeds: [emb.success(client, 'Channel Unlocked', 'This channel is now unlocked.')] });
  },
};

module.exports = { kick, ban, unban, timeout, untimeout, warn, warnings, clearwarns, purge, slowmode, lock, unlock };
