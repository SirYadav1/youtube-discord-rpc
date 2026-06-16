<p align="center">
  <img src="assets/logo.svg" alt="YouTube Discord RPC" width="100%">
</p>

<h3 align="center">Show what you're watching on YouTube — as your Discord Rich Presence.</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome&logoColor=white" alt="Chrome">
  <img src="https://img.shields.io/badge/Firefox-Add--on-orange?logo=firefox&logoColor=white" alt="Firefox">
  <img src="https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-gray" alt="License">
</p>

---

## What it does

Play any YouTube video and your Discord profile automatically shows:

- **Video title** and **channel name**
- **Thumbnail** from the video
- **Live elapsed / total time** bar
- **"Watch Video"** button for your friends to click

Pause a video — presence clears. Switch videos — it updates instantly.

---

## Quick Start

### 1. Install Python dependencies

```bash
pip install websockets pypresence
```

### 2. Set up your Discord Client ID

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create an application (or use an existing one)
3. Copy the **Client ID**
4. Create `host/config.json`:

```json
{
  "client_id": "YOUR_CLIENT_ID_HERE"
}
```

> **Windows users:** Just double-click `start-server.bat` — it will open `config.json` for you automatically.

### 3. Start the server

**Windows:**
```
Double-click start-server.bat
```

**Linux / macOS:**
```bash
cd host
python rpc_server.py
```

Keep the terminal window open.

### 4. Load the browser extension

**Chrome:**
1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder from this project

**Firefox:**
1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `extension/manifest.json`

### 5. That's it

Open [youtube.com](https://youtube.com), play any video. Your Discord status updates in ~1 second.

---

## How it works

```
YouTube page
    │
    ▼
content.js  ──── detects video title, channel, thumbnail, timestamp
    │
    ▼
background.js  ── sends data over WebSocket to local server
    │
    ▼
rpc_server.py  ── receives data, pushes it to Discord via pypresence
    │
    ▼
Discord  ──────── your profile shows the video info
```

Everything runs locally on your machine. No data is sent anywhere.

---

## Project Structure

```
youtube-discord-rpc/
├── extension/              # Browser extension
│   ├── manifest.json       # Extension config
│   ├── content.js          # Detects YouTube video info
│   ├── background.js       # Manages WebSocket connection
│   ├── popup.html/css/js   # Extension popup UI
│   └── icons/              # Extension icons
├── host/
│   ├── rpc_server.py       # WebSocket + Discord RPC server
│   ├── config.json.example # Config template
│   └── config.json         # Your config (gitignored)
├── assets/
│   └── logo.svg            # Project logo
├── start-server.bat        # Windows one-click launcher
├── .gitignore
└── README.md
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| RPC not showing on Discord | Make sure `rpc_server.py` is running AND Discord desktop app is open |
| Extension says "Disconnected" | Start the Python server first, then click **Refresh** in the popup |
| "Discord not connected" in terminal | Start Discord first, then run the server. It retries every 30s automatically |
| Thumbnail shows but title is wrong | Reload the YouTube page, the extension will re-detect everything |
| Timer is lagging on Discord | The extension updates every 1 second, Discord may take a moment to reflect |

---

## Contact

<p align="center">
  <a href="https://t.me/Siryadav">
    <img src="https://img.shields.io/badge/Telegram-Siryadav-26A5E4?style=flat-square&logo=telegram&logoColor=white&labelColor=26A5E4&height=35" alt="Telegram">
  </a>&nbsp;
  <a href="https://x.com/siryadav0">
    <img src="https://img.shields.io/badge/X-@siryadav0-000000?style=flat-square&logo=x&logoColor=white&labelColor=000000&height=35" alt="X">
  </a>&nbsp;
  <a href="mailto:osamabinladenfromindia@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-Email-EA4335?style=flat-square&logo=gmail&logoColor=white&labelColor=EA4335&height=35" alt="Gmail">
  </a>&nbsp;
  <a href="https://paypal.me/SundramYadav4601">
    <img src="https://img.shields.io/badge/PayPal-SundramYadav-00457C?style=flat-square&logo=paypal&logoColor=white&labelColor=00457C&height=35" alt="PayPal">
  </a>
</p>

---

## License

[MIT](LICENSE)
