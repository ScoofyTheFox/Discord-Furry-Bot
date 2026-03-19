# 🐾 FurBot
### Customizable Furry Discord Bot Template

![GitHub stars](https://img.shields.io/github/stars/ScoofyTheFox/Customizable-Furry-Discord-Bot?style=for-the-badge)
![License](https://img.shields.io/github/license/ScoofyTheFox/Customizable-Furry-Discord-Bot?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D18-green?style=for-the-badge)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)

---

## 🐾 About

**FurBot** is a fully customizable furry Discord bot made by **Scoofyx**.

It's designed to be:
* easy to set up ⚡
* easy to customize 🎨
* easy to deploy 🚆

👉 Use it as a **template** and turn it into your own bot.

---

## ✨ Features

* 🧩 Extremely customizable (`settings.js`)
* 🐾 Furry generator (species, traits, vibes, etc.)
* 🛠️ Moderation system (warns, timeouts, logs)
* 🎉 Giveaways + polls
* 🤖 Automod (optional)
* 👋 Welcome & goodbye system
* 💾 Optional JSONBin storage
* 🚆 Railway ready

---

## 🚀 Quick Start

```bash
git clone https://github.com/ScoofyTheFox/Customizable-Furry-Discord-Bot
cd Customizable-Furry-Discord-Bot
npm install
node deploy.js
npm start
```

---

## ⚙️ Setup

### Local
Copy `.env.example` to `.env` and fill in your values:
```
BOT_TOKEN=your_token
CLIENT_ID=your_client_id
GUILD_ID=your_server_id
JSONBIN_KEY=optional
```

### Railway
Set the same variables in your Railway project → **Variables** tab.
Railway variables automatically override `.env` — no file upload needed.

Then in Discord:
* `/setup-channels` — set bot channels *(requires JSONBin to save)*
* `/setup-roles` — set bot roles *(requires JSONBin to save)*
* `/setup-view` — view current config *(requires JSONBin to save)*

> ⚠️ Without JSONBin, `/setup` changes reset on restart.
> You can also set IDs manually in `settings.js` as a permanent alternative.

---

## 🎨 Customization

Everything is in `settings.js` — no other files need touching:

* Bot name, color & status 🐾
* Enable/disable systems 🧩
* Welcome & goodbye messages 👋
* Furry species, traits, vibes & colors 🐺
* Fun command responses (8ball, roasts, compliments, etc.) 💬
* Automod filters & thresholds 🤖
* Moderation settings ⚖️
* Giveaway & poll options 🎉

---

## 🚆 Deploy (Railway)

1. Fork or push to GitHub
2. Go to [Railway](https://railway.app) → New Project → Deploy from repo
3. Add environment variables in the Variables tab:
   - `BOT_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
   - `JSONBIN_KEY` *(optional)*
4. Railway auto-deploys on every push ✅

---

## 💡 Notes

* No database required
* `.env` should **never** be uploaded to GitHub — use `.env.example` as a template
* `node_modules/` is not needed in the repo — Railway runs `npm install` automatically
* Run `node deploy.js` once after cloning to register slash commands with Discord

---

## 📄 License

MIT License — you can use, modify, and share freely.
Credit is appreciated but **not required**. 🐾

---

## ⭐ Support

If you like this project:
* ⭐ Star the repo
* 🍴 Fork it and make it yours
* 🐾 Share it with other furries

---

## 🐾 Made by Scoofyx
*for furries* 🌟
