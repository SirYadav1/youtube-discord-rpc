<p align="center">
  <img src="assets/logo.svg" alt="YouTube Discord RPC" width="100%">
</p>

<h3 align="center">Show what you're watching on YouTube — as your Discord Rich Presence.</h3>

<p align="center">
  <a href="https://github.com/SirYadav1/youtube-discord-rpc/stargazers"><img src="https://img.shields.io/github/stars/SirYadav1/youtube-discord-rpc?style=flat-square&logo=github&color=yellow&label=Stars" alt="Stars"></a>
  <a href="https://github.com/SirYadav1/youtube-discord-rpc/network/members"><img src="https://img.shields.io/github/forks/SirYadav1/youtube-discord-rpc?style=flat-square&logo=github&color=blue&label=Forks" alt="Forks"></a>
  <a href="https://github.com/SirYadav1/youtube-discord-rpc/issues"><img src="https://img.shields.io/github/issues/SirYadav1/youtube-discord-rpc?style=flat-square&logo=github&color=red&label=Issues" alt="Issues"></a>
  <a href="https://github.com/SirYadav1/youtube-discord-rpc/pulls"><img src="https://img.shields.io/github/issues-pr/SirYadav1/youtube-discord-rpc?style=flat-square&logo=github&color=green&label=PRs" alt="PRs"></a>
  <a href="https://github.com/SirYadav1/youtube-discord-rpc/blob/main/LICENSE"><img src="https://img.shields.io/github/license/SirYadav1/youtube-discord-rpc?style=flat-square&color=purple&label=License" alt="License"></a>
  <img src="https://img.shields.io/github/last-commit/SirYadav1/youtube-discord-rpc?style=flat-square&color=orange&label=Last%20Commit" alt="Last Commit">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome">
  <img src="https://img.shields.io/badge/Firefox-Add--on-FF7139?style=flat-square&logo=firefox&logoColor=white" alt="Firefox">
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Discord-Rich%20Presence-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord">
  <img src="https://img.shields.io/badge/License-MIT-00ff00?style=flat-square" alt="License">
</p>

<br>

<table align="center">
  <tr>
    <td align="center">
      <b>Features</b><br><br>
      <code>• Video title & channel</code><br>
      <code>• Video thumbnail</code><br>
      <code>• Live elapsed / total time</code><br>
      <code>• Watch Video button</code><br>
      <code>• Auto-updates in 1s</code>
    </td>
    <td align="center" width="100">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </td>
    <td align="center">
      <b>Requirements</b><br><br>
      <code>• Python 3.8+</code><br>
      <code>• Discord Desktop App</code><br>
      <code>• Chrome / Firefox</code><br>
      <code>• pip install websockets pypresence</code>
    </td>
  </tr>
</table>

<br>

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
pip install websockets pypresence
```

### 2. Create `host/config.json`

```json
{
  "client_id": "YOUR_DISCORD_CLIENT_ID"
}
```

> Get your Client ID from [Discord Developer Portal](https://discord.com/developers/applications)

### 3. Start the server

```bash
# Windows: double-click start-server.bat

# Linux / macOS:
cd host
python rpc_server.py
```

### 4. Load the extension

| Browser | Steps |
|---------|-------|
| **Chrome** | `chrome://extensions` → Developer mode ON → Load unpacked → select `extension/` |
| **Firefox** | `about:debugging` → Load Temporary Add-on → select `manifest.json` |

### 5. Play a video

Open YouTube, play anything — your Discord status updates automatically.

---

## 🔧 How It Works

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐
│  YouTube    │───▶│  content.js │───▶│  background │───▶│  Server │───▶ Discord
│  Page       │    │  (detect)   │    │  (bridge)   │    │  (RPC)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────┘
```

Everything runs **locally** on your machine. No data is sent anywhere.

---

## 📁 Project Structure

```
youtube-discord-rpc/
├── extension/
│   ├── manifest.json       # Extension config
│   ├── content.js          # Detects YouTube video info
│   ├── background.js       # WebSocket connection manager
│   ├── popup.html/css/js   # Extension popup UI
│   └── icons/              # Extension icons
├── host/
│   ├── rpc_server.py       # WebSocket + Discord RPC server
│   ├── config.json.example # Config template
│   └── config.json         # Your config (gitignored)
├── assets/
│   └── logo.svg            # Project logo
├── start-server.bat        # Windows launcher
├── LICENSE
└── README.md
```

---

## 🐛 Troubleshooting

<details>
<summary><b>RPC not showing on Discord</b></summary>
<br>

- Make sure `rpc_server.py` is running
- Make sure Discord desktop app is open
- Check extension popup — status should say "Connected"
</details>

<details>
<summary><b>Extension says "Disconnected"</b></summary>
<br>

- Start the Python server first
- Click **Refresh** in the extension popup
</details>

<details>
<summary><b>"Discord not connected" in terminal</b></summary>
<br>

- Start Discord first, then run the server
- The server retries automatically every 30 seconds
</details>

<details>
<summary><b>Thumbnail shows but title is wrong</b></summary>
<br>

- Reload the YouTube page
- The extension will re-detect everything
</details>

---

## 📬 Contact

<p align="center">
  <a href="https://t.me/Siryadav">
    <img src="https://img.shields.io/badge/Telegram-Siryadav-26A5E4?style=flat-square&logo=telegram&logoColor=white&labelColor=26A5E4&height=35&borderRadius=10" alt="Telegram">
  </a>&nbsp;
  <a href="https://x.com/siryadav0">
    <img src="https://img.shields.io/badge/X-@siryadav0-000000?style=flat-square&logo=x&logoColor=white&labelColor=000000&height=35&borderRadius=10" alt="X">
  </a>&nbsp;
  <a href="mailto:osamabinladenfromindia@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-Email-EA4335?style=flat-square&logo=gmail&logoColor=white&labelColor=EA4335&height=35&borderRadius=10" alt="Gmail">
  </a>&nbsp;
  <a href="https://paypal.me/SundramYadav4601">
    <img src="https://img.shields.io/badge/PayPal-SundramYadav-00457C?style=flat-square&logo=paypal&logoColor=white&labelColor=00457C&height=35&borderRadius=10" alt="PayPal">
  </a>
</p>

---

## 📄 License

[MIT](LICENSE) — use it however you want.
