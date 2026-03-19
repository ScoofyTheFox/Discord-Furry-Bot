const { SlashCommandBuilder } = require('discord.js');
const emb  = require('../../utils/embed');
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const eightball = {
  data: new SlashCommandBuilder()
    .setName('8ball').setDescription('Ask the magic 8ball 🎱')
    .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),
  cooldown: 5,
  async execute(interaction, client) {
    const s   = client.settings;
    const all = [...s.fun_8ball_good, ...s.fun_8ball_neutral, ...s.fun_8ball_bad];
    const res = pick(all);
    const color = s.fun_8ball_good.includes(res) ? 0x2ECC71 : s.fun_8ball_neutral.includes(res) ? 0xF39C12 : 0xE74C3C;
    await interaction.reply({ embeds: [emb.base(client, color)
      .setTitle('🎱 Magic 8Ball')
      .addFields(
        { name: 'Question', value: interaction.options.getString('question') },
        { name: 'Answer',   value: res },
      )] });
  },
};

const coinflip = {
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin 🪙'),
  cooldown: 3,
  async execute(interaction, client) {
    const result = Math.random() < 0.5 ? '🌕 Heads' : '🌑 Tails';
    await interaction.reply({ embeds: [emb.base(client).setTitle('🪙 Coin Flip').setDescription(`**${result}**!`)] });
  },
};

const dice = {
  data: new SlashCommandBuilder()
    .setName('dice').setDescription('Roll a dice 🎲')
    .addIntegerOption(o => o.setName('sides').setDescription('Number of sides (default 6)').setMinValue(2).setMaxValue(1000)),
  cooldown: 3,
  async execute(interaction, client) {
    const sides = interaction.options.getInteger('sides') || 6;
    const roll  = Math.floor(Math.random() * sides) + 1;
    await interaction.reply({ embeds: [emb.base(client).setTitle('🎲 Dice Roll').setDescription(`You rolled a **d${sides}** and got **${roll}**!`)] });
  },
};

const rps = {
  data: new SlashCommandBuilder()
    .setName('rps').setDescription('Rock Paper Scissors ✂️')
    .addStringOption(o => o.setName('choice').setDescription('Your choice').setRequired(true)
      .addChoices(
        { name: '🪨 Rock',     value: 'rock' },
        { name: '📄 Paper',    value: 'paper' },
        { name: '✂️ Scissors', value: 'scissors' },
      )),
  cooldown: 3,
  async execute(interaction, client) {
    const emoji  = { rock: '🪨', paper: '📄', scissors: '✂️' };
    const player = interaction.options.getString('choice');
    const bot    = pick(['rock', 'paper', 'scissors']);
    const wins   = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
    const result = player === bot ? '🤝 Tie!' : wins[player] === bot ? '🎉 You win!' : '😔 You lose!';
    await interaction.reply({ embeds: [emb.base(client).setTitle('✂️ Rock Paper Scissors').setDescription(`${emoji[player]} vs ${emoji[bot]} — **${result}**`)] });
  },
};

const rate = {
  data: new SlashCommandBuilder()
    .setName('rate').setDescription('Rate anything out of 10 🔢')
    .addStringOption(o => o.setName('thing').setDescription('What to rate').setRequired(true)),
  cooldown: 5,
  async execute(interaction, client) {
    const score = Math.floor(Math.random() * 11);
    const bar   = '█'.repeat(score) + '░'.repeat(10 - score);
    const color = score >= 7 ? 0x2ECC71 : score >= 4 ? 0xF39C12 : 0xE74C3C;
    await interaction.reply({ embeds: [emb.base(client, color)
      .setTitle(`🔢 Rating: ${interaction.options.getString('thing')}`)
      .setDescription(`\`[${bar}]\` **${score}/10**\n\n${client.settings.fun_rate_responses[score]}`)] });
  },
};

const ship = {
  data: new SlashCommandBuilder()
    .setName('ship').setDescription('Ship two people 💞')
    .addUserOption(o => o.setName('user1').setDescription('Person 1').setRequired(true))
    .addUserOption(o => o.setName('user2').setDescription('Person 2').setRequired(true)),
  cooldown: 5,
  async execute(interaction, client) {
    const u1    = interaction.options.getUser('user1');
    const u2    = interaction.options.getUser('user2');
    const score = Math.floor(Math.random() * 101);
    const bar   = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
    const name  = u1.username.slice(0, Math.ceil(u1.username.length / 2)) + u2.username.slice(Math.floor(u2.username.length / 2));
    const comment = score >= 90 ? '💍 Soulmates!' : score >= 70 ? '💞 Strong vibes.' : score >= 50 ? '💛 Could work.' : '💔 Not meant to be.';
    await interaction.reply({ embeds: [emb.base(client, 0xFF69B4)
      .setTitle(`💞 ${u1.username} + ${u2.username}`)
      .setDescription(`**Ship name:** ${name}\n\`[${bar}]\` **${score}%**\n\n${comment}`)] });
  },
};

const wyr = {
  data: new SlashCommandBuilder().setName('would-you-rather').setDescription('Would you rather? 🤔'),
  cooldown: 5,
  async execute(interaction, client) {
    const [a, b] = pick(client.settings.fun_wyr);
    const msg = await interaction.reply({ embeds: [emb.base(client, 0x9B59B6)
      .setTitle('🤔 Would You Rather...')
      .addFields({ name: '🅰️', value: a, inline: true }, { name: '🅱️', value: b, inline: true })
      .setDescription('React to vote!')], fetchReply: true });
    await msg.react('🅰️');
    await msg.react('🅱️');
  },
};

const compliment = {
  data: new SlashCommandBuilder()
    .setName('compliment').setDescription('Give someone a compliment 💛')
    .addUserOption(o => o.setName('user').setDescription('Who').setRequired(true)),
  cooldown: 5,
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    await interaction.reply({ embeds: [emb.base(client, 0xF1C40F).setDescription(`💛 **${target.username}** ${pick(client.settings.fun_compliments)}`)] });
  },
};

const roast = {
  data: new SlashCommandBuilder()
    .setName('roast').setDescription('Roast someone 🔥')
    .addUserOption(o => o.setName('user').setDescription('Who').setRequired(true)),
  cooldown: 10,
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    await interaction.reply({ embeds: [emb.base(client, 0xE74C3C).setDescription(`🔥 **${target.username}** ${pick(client.settings.fun_roasts)}`)] });
  },
};

const fact = {
  data: new SlashCommandBuilder().setName('fact').setDescription('Random fun fact 🧠'),
  cooldown: 5,
  async execute(interaction, client) {
    await interaction.reply({ embeds: [emb.base(client, 0x3498DB).setTitle('🧠 Fun Fact').setDescription(pick(client.settings.fun_facts))] });
  },
};

module.exports = { eightball, coinflip, dice, rps, rate, ship, wyr, compliment, roast, fact };
