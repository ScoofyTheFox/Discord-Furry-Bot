const { EmbedBuilder } = require('discord.js');

const base    = (client, color) => new EmbedBuilder().setColor(color ?? client.settings.bot_color).setFooter({ text: client.settings.bot_footer }).setTimestamp();
const success = (client, title, desc) => base(client, 0x2ECC71).setTitle(`✅ ${title}`).setDescription(desc);
const error   = (client, title, desc) => base(client, 0xE74C3C).setTitle(`❌ ${title}`).setDescription(desc);
const info    = (client, title, desc) => base(client, 0x3498DB).setTitle(`ℹ️ ${title}`).setDescription(desc);
const warn    = (client, title, desc) => base(client, 0xF39C12).setTitle(`⚠️ ${title}`).setDescription(desc);

module.exports = { base, success, error, info, warn };
