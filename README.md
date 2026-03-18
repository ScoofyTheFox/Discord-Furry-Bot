# 🐾 PawBot — Desktop Setup Guide

Follow these steps to run PawBot on your PC for testing.

---

## Step 1 — Install Node.js

Download and install from **nodejs.org** — get the LTS version.

---

## Step 2 — Fill in `.env`

Open the `.env` file in this folder and fill in your values:

```
BOT_TOKEN=    ← from discord.com/developers → your app → Bot tab → Reset Token
CLIENT_ID=    ← from discord.com/developers → your app → General Information
GUILD_ID=     ← right click your server in Discord → Copy Server ID
JSONBIN_KEY=  ← sign up free at jsonbin.io → API Keys → Create Access Key
```

To get the Guild ID you need Developer Mode on in Discord:
**Settings → Advanced → Developer Mode → ON**
Then right click your server icon → **Copy Server ID**

---

## Step 3 — Invite the bot to your server

1. Go to discord.com/developers/applications → your app
2. **OAuth2 → URL Generator**
3. Check `bot` and `applications.commands`
4. Under Bot Permissions check `Administrator`
5. Copy the URL → open in browser → invite to your server

Also go to the **Bot** tab and turn on all 3 **Privileged Gateway Intents**.

---

## Step 4 — Open a terminal in this folder

- **Windows**: Right click inside the folder → "Open in Terminal"  
  or press `Win + R` → type `cmd` → `cd` to the folder path
- **Mac/Linux**: Right click → "New Terminal at Folder"

---

## Step 5 — Install and run

```bash
npm install          # install dependencies (only needed once)
node deploy.js       # register slash commands (only needed once, or after changes)
npm start            # start the bot!
```

You should see:
```
🌐 Keep-alive on :3000
📦 Store loaded — 0 channel(s), 0 role(s), 0 setting override(s)
✅ [admin]
✅ [fun]
✅ [furry]
...
🐾 YourBot#1234 is online!
```

---

## Step 6 — Set up channels and roles in Discord

Use these commands in your server (you need Administrator):

- `/setup-channels` — set your log channel, welcome channel, etc.
- `/setup-roles` — set auto-role, mute role, etc.
- `/setup-view` — see everything that's configured

---

## Tips

- To stop the bot: press `Ctrl + C` in the terminal
- To restart: run `npm start` again
- If you add/remove commands in `commands/`: run `node deploy.js` again
- JSONBin bin ID will be printed on first run — add it to `.env` so data persists
- When you're ready to push to GitHub: uncomment `.env` in `.gitignore`!

---

## Customization

Edit `settings.js` to change:
- Bot name, color, status
- Which systems are enabled/disabled
- Welcome messages, moderation settings, etc.
