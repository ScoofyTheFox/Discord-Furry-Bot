const spamTracker = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;
    if (!client.settings.automod_system) return;

    const s = client.settings;

    // Check exemptions
    const exemptRole = s.automod_exempt_roles.some(r => message.member?.roles.cache.has(r));
    const exemptChan = s.automod_exempt_channels.includes(message.channelId);
    if (exemptRole || exemptChan) return;

    // Bad words
    if (s.automod_bad_words.length) {
      const lower = message.content.toLowerCase();
      if (s.automod_bad_words.some(w => lower.includes(w.toLowerCase()))) {
        return message.delete().catch(() => {});
      }
    }

    // Anti-spam
    if (s.automod_antispam) {
      const now   = Date.now();
      const uid   = message.author.id;
      const times = (spamTracker.get(uid) || []).filter(t => now - t < s.automod_spam_window_ms);
      times.push(now);
      spamTracker.set(uid, times);
      if (times.length >= s.automod_spam_threshold) {
        message.delete().catch(() => {});
        const warning = await message.channel.send(`⚠️ <@${uid}> slow down!`);
        setTimeout(() => warning.delete().catch(() => {}), 4000);
        spamTracker.set(uid, []);
        return;
      }
    }

    // Link filter
    if (s.automod_block_links && /https?:\/\//i.test(message.content)) {
      const isDiscord = /discord\.(gg|com)/i.test(message.content);
      if (!(s.automod_allow_discord_links && isDiscord)) {
        return message.delete().catch(() => {});
      }
    }

    // Caps filter
    if (s.automod_max_caps_percent && message.content.length >= s.automod_min_caps_length) {
      const letters = message.content.replace(/[^a-zA-Z]/g, '');
      if (letters.length > 0) {
        const caps = (message.content.match(/[A-Z]/g) || []).length;
        if ((caps / letters.length) * 100 >= s.automod_max_caps_percent) {
          return message.delete().catch(() => {});
        }
      }
    }
  },
};
