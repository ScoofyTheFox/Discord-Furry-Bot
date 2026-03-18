// ================================================================
//  🐾 PAWBOT — settings.js
//
//  This is the only config file you need to edit when forking.
//  Push changes to GitHub → Railway auto-redeploys.
//
//  Channels and roles are set via /setup commands in Discord
//  and saved automatically — no manual editing needed.
// ================================================================

module.exports = {

  // ── Bot identity ─────────────────────────────────────────────
  bot_name:        'PawBot',
  bot_color:       0xFF69B4,      // embed color (hex)
  bot_footer:      '🐾 PawBot',
  bot_status:      '🐾 /help',
  bot_status_type: 'WATCHING',    // PLAYING | WATCHING | LISTENING | COMPETING


  // ── Enable or disable entire systems ─────────────────────────
  // false = those commands don't load at all

  fun_system:       true,
  poll_system:      true,
  giveaway_system:  true,
  furry_system:     true,
  fursuit_system:   true,
  moderation_system: true,
  automod_system:   false,
  welcome_system:   true,
  utility_system:   true,


  // ── Welcome & goodbye ─────────────────────────────────────────
  // Channel is set via /setup-channels in Discord

  welcome_message:     'Welcome to **{server}**, {user}! 🐾 You\'re member **#{count}**.',
  welcome_embed:       true,
  welcome_embed_color: 0x2ECC71,
  welcome_ping:        true,      // ping the user in the welcome message
  welcome_dm:          false,
  welcome_dm_message:  'Welcome to **{server}**! 🐾',

  goodbye_enabled: true,
  goodbye_message: '**{username}** has left the server. 👋',


  // ── Moderation ────────────────────────────────────────────────
  // Log channel is set via /setup-channels in Discord
  // Mod role is set via /setup-roles in Discord

  moderation_max_warnings:      3,
  moderation_warn_action:       'timeout',  // 'ban' | 'kick' | 'timeout' | 'none'
  moderation_warn_timeout_mins: 60,
  moderation_dm_on_action:      true,       // DM the user when moderated


  // ── Automod (only runs if automod_system: true) ───────────────
  automod_bad_words:           [],      // ['word1', 'word2']
  automod_block_links:         false,
  automod_allow_discord_links: true,
  automod_antispam:            true,
  automod_spam_threshold:      5,       // messages within spam_window_ms to trigger
  automod_spam_window_ms:      5000,
  automod_max_caps_percent:    70,
  automod_min_caps_length:     10,
  automod_exempt_roles:        [],      // role IDs exempt from automod
  automod_exempt_channels:     [],      // channel IDs exempt from automod


  // ── Polls ─────────────────────────────────────────────────────
  poll_max_options: 4,
  poll_show_author: true,
  poll_pin_polls:   false,


  // ── Giveaways ─────────────────────────────────────────────────
  // In-memory only — ends if bot restarts mid-giveaway (fine for short ones)
  giveaway_max_winners:         10,
  giveaway_dm_winner:           true,
  giveaway_announce_in_channel: true,


  // ── Furry ─────────────────────────────────────────────────────
  furry_species: [
    'Wolf', 'Fox', 'Dragon', 'Cat', 'Dog', 'Bunny', 'Deer', 'Bear',
    'Sergal', 'Protogen', 'Hyena', 'Tiger', 'Shark', 'Raccoon', 'Otter',
    'Kobold', 'Gryphon', 'Skunk', 'Red Panda', 'Bat',
  ],
  furry_traits: [
    'fluffy', 'scrunkly', 'feral', 'big and gay', 'tiny and menacing',
    'sparkledog', 'mythical', 'chaotic', 'sleepy', 'hyper',
  ],
  furry_colors: [
    'midnight black', 'snow white', 'galaxy purple', 'fiery red',
    'ocean blue', 'neon pink', 'forest green', 'golden', 'silver',
  ],
  furry_vibes: [
    'chaotic good', 'lawful floof', 'neutral gay', 'true feral',
    'chaotic gay', 'lawful sleepy',
  ],


  // ── Fursuit check ─────────────────────────────────────────────
  // Channel is set via /setup-channels in Discord
  fursuit_vote_emojis:  ['❤️', '🔥', '✨', '🐾'],
  fursuit_ping_on_post: false,


  // ── Fun command customization ─────────────────────────────────
  fun_8ball_good:    ['It is certain.', 'Without a doubt.', 'Yes, definitely.', 'Most likely.'],
  fun_8ball_neutral: ['Reply hazy, try again.', 'Ask again later.', 'Cannot predict now.'],
  fun_8ball_bad:     ["Don't count on it.", 'My sources say no.', 'Very doubtful.'],

  fun_rate_responses: {
    0: '💀 Absolutely terrible.', 1: '😬 Yikes.',        2: '😕 Actually just bad.',
    3: '🤔 Exists, I guess.',     4: '😐 Below average.', 5: '😶 Perfectly mediocre.',
    6: '🙂 Decent!',              7: '😊 Pretty good!',   8: '😄 Really good!',
    9: '🤩 Almost perfect!',      10: '💎 PERFECTION.',
  },

  fun_compliments: [
    'has the most amazing energy in this server 💛',
    'is criminally underrated and deserves more hugs 🤗',
    'makes this server a better place just by existing 🌟',
    'radiates good vibes at all times ✨',
    'is built different (in the best way) 💪',
  ],

  fun_roasts: [
    'has the personality of a wet sock.',
    'makes onions cry.',
    'is the reason we have instruction manuals.',
    'could lose a staring contest with a painting.',
  ],

  fun_facts: [
    'Honey never spoils — 3000-year-old honey was found in Egyptian tombs.',
    'A group of flamingos is called a flamboyance.',
    'Otters hold hands while sleeping so they don\'t drift apart.',
    'Squirrels accidentally plant thousands of trees by forgetting where they buried nuts.',
  ],

  fun_wyr: [
    ['Have paws for hands', 'Have hooves for feet'],
    ['Speak every language', 'Play every instrument'],
    ['Be permanently feral', 'Be permanently anthro'],
    ['Have a tail but no ears', 'Have ears but no tail'],
    ['Only eat pizza forever', 'Never eat pizza again'],
  ],

};
