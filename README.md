# 🐾 FurBot

### Customizable Furry Discord Bot Template

![GitHub stars](https://img.shields.io/github/stars/ScoofyTheFox/Discord-Furry-Bot?style=for-the-badge)
![License](https://img.shields.io/github/license/ScoofyTheFox/Discord-Furry-Bot?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D18-green?style=for-the-badge)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)

---

## 🐾 About

**FurBot** is a fully customizable furry Discord bot made by **Scoofyx**.

It’s designed to be:

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
git clone https://github.com/ScoofyTheFox/Discord-Furry-Bot
cd Discord-Furry-Bot
npm install
node deploy.js
npm start
```

---

## ⚙️ Setup

Fill in your `.env`:

```
BOT_TOKEN=your_token
CLIENT_ID=your_client_id
GUILD_ID=your_server_id
JSONBIN_KEY=optional
```

Then in Discord:

* `/setup-channels`
* `/setup-roles`
* `/setup-view`

⚠️ Without JSONBin, setup resets on restart

---

## 🎨 Customization

Everything important is in:

```
settings.js
```

You can change:

* bot name 🐾
* colors + status 🎨
* systems on/off 🧩
* messages + responses 💬
* furry content 🐺

---

## 🚆 Deploy (Railway)

1. Push to GitHub
2. Go to Railway → New Project
3. Deploy from repo
4. Add env variables
5. Done

---

## 💡 Notes

* No database required
* `.env` should NOT be uploaded
* `node_modules` not needed

---

## 📄 License

MIT License

✔️ You can use, modify, and share
👍 Credit is appreciated but **not required**

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🐾 Make your own version

---

## 🐾 Made by Scoofyx

for furries, devs, and chaotic gremlins
