const { SlashCommandBuilder } = require('discord.js');
const emb  = require('../../utils/embed');
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const fursona = {
  data: new SlashCommandBuilder().setName('fursona').setDescription('Generate a random fursona 🐾'),
  cooldown: 10,
  async execute(interaction, client) {
    const s = client.settings;
    await interaction.reply({ embeds: [emb.base(client, 0xFF69B4)
      .setTitle(`🐾 ${interaction.user.username}'s Fursona`)
      .addFields(
        { name: '🐺 Species', value: pick(s.furry_species), inline: true },
        { name: '✨ Trait',   value: pick(s.furry_traits),  inline: true },
        { name: '🎨 Color',  value: pick(s.furry_colors),  inline: true },
        { name: '💛 Vibe',   value: pick(s.furry_vibes),   inline: true },
      ).setFooter({ text: 'This is your fursona now. No take-backsies. 🐾' })] });
  },
};

const species = {
  data: new SlashCommandBuilder().setName('species').setDescription('Random furry species 🦊'),
  cooldown: 5,
  async execute(interaction, client) {
    await interaction.reply({ embeds: [emb.base(client).setDescription(`🦊 Your species today is: **${pick(client.settings.furry_species)}**!`)] });
  },
};

const howl = {
  data: new SlashCommandBuilder().setName('howl').setDescription('Let out a howl 🐺'),
  cooldown: 5,
  async execute(interaction, client) {
    const howls = ['🐺 **AWOOOOOOOO!!**', '🐺 *howls into the void*', '🐺 AWOO AWOO AWOO!!', '🐺 awooooooo~ 💛'];
    await interaction.reply({ embeds: [emb.base(client).setDescription(`${pick(howls)}\n> howled by **${interaction.user.username}**`)] });
  },
};

const boop = {
  data: new SlashCommandBuilder()
    .setName('boop').setDescription('Boop someone on the snoot 👆')
    .addUserOption(o => o.setName('user').setDescription('Who to boop').setRequired(true)),
  cooldown: 3,
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    const lines  = [
      `👆 **${interaction.user.username}** booped **${target.username}** on the snoot! *bonk*`,
      `👆 **${target.username}** has been booped. They did not consent. We move on.`,
      `👆 *boop* — **${target.username}** booped by **${interaction.user.username}**!`,
    ];
    await interaction.reply({ embeds: [emb.base(client).setDescription(pick(lines))] });
  },
};

const pawbump = {
  data: new SlashCommandBuilder()
    .setName('pawbump').setDescription('Give someone a paw bump 🐾')
    .addUserOption(o => o.setName('user').setDescription('Who').setRequired(true)),
  cooldown: 3,
  async execute(interaction, client) {
    const target = interaction.options.getUser('user');
    await interaction.reply({ embeds: [emb.base(client).setDescription(`🐾 **${interaction.user.username}** gives **${target.username}** a big paw bump! UwU`)] });
  },
};

const floof = {
  data: new SlashCommandBuilder()
    .setName('floof').setDescription("Rate someone's floofiness 💛")
    .addUserOption(o => o.setName('user').setDescription('Who to rate')),
  cooldown: 5,
  async execute(interaction, client) {
    const target  = interaction.options.getUser('user') || interaction.user;
    const rating  = Math.floor(Math.random() * 101);
    const bar     = '█'.repeat(Math.floor(rating / 10)) + '░'.repeat(10 - Math.floor(rating / 10));
    const comment = rating >= 90 ? 'Certified Ultra Floof™ 🏆' : rating >= 50 ? 'Pretty floofy ngl 🐾' : 'Needs more floof 😔';
    await interaction.reply({ embeds: [emb.base(client, 0xFFD700)
      .setTitle(`💛 ${target.username}'s Floofiness`)
      .setDescription(`\`[${bar}]\` **${rating}%**\n> ${comment}`)] });
  },
};

module.exports = { fursona, species, howl, boop, pawbump, floof };
