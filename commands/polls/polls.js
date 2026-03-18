const { SlashCommandBuilder } = require('discord.js');
const emb = require('../../utils/embed');

const poll = {
  data: new SlashCommandBuilder()
    .setName('poll').setDescription('Create a reaction poll 📊')
    .addStringOption(o => o.setName('question').setDescription('Question').setRequired(true))
    .addStringOption(o => o.setName('option1').setDescription('Option 1').setRequired(true))
    .addStringOption(o => o.setName('option2').setDescription('Option 2').setRequired(true))
    .addStringOption(o => o.setName('option3').setDescription('Option 3'))
    .addStringOption(o => o.setName('option4').setDescription('Option 4')),
  cooldown: 10,
  async execute(interaction, client) {
    const s       = client.settings;
    const question = interaction.options.getString('question');
    const options  = ['option1', 'option2', 'option3', 'option4']
      .map(k => interaction.options.getString(k))
      .filter(Boolean)
      .slice(0, s.poll_max_options);
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
    const embed  = emb.base(client, 0x3498DB)
      .setTitle(`📊 ${question}`)
      .setDescription(options.map((o, i) => `${emojis[i]}  **${o}**`).join('\n\n'));
    if (s.poll_show_author) embed.setFooter({ text: `Poll by ${interaction.user.username} • ${s.bot_footer}` });
    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (let i = 0; i < options.length; i++) await msg.react(emojis[i]);
    if (s.poll_pin_polls) msg.pin().catch(() => {});
  },
};

const quickpoll = {
  data: new SlashCommandBuilder()
    .setName('quickpoll').setDescription('Quick yes/no poll 👍')
    .addStringOption(o => o.setName('question').setDescription('Question').setRequired(true)),
  cooldown: 5,
  async execute(interaction, client) {
    const msg = await interaction.reply({ embeds: [emb.base(client, 0x3498DB)
      .setTitle(`📊 ${interaction.options.getString('question')}`)
      .setDescription('React to vote!')], fetchReply: true });
    await msg.react('👍');
    await msg.react('👎');
    await msg.react('🤷');
  },
};

module.exports = { poll, quickpoll };
