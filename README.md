# YouTube Discord RPC

Browser extension + Python server that shows whatever you're watching on YouTube as your Discord Rich Presence.

![Chrome](https://img.shields.io/badge/Chrome-Extension-green) ![Firefox](https://img.shields.io/badge/Firefox-Add--on-orange) ![Python](https://img.shields.io/badge/Python-3.8+-blue)

## Demo

Your Discord profile automatically shows:
- Video title
- Channel name
- Thumbnail
- Elapsed / total time
- "Watch Video" button

When you pause, the presence clears. When you switch videos, it updates.

## Requirements

- Python 3.8+
- Discord desktop app (running)
- Chrome or Firefox

## Install

### 1. Python dependencies

```bash
pip install websockets pypresence
```

### 2. Start the server

**Windows:**
Double-click `start-server.bat`

**Linux / macOS:**
```bash
cd host
python rpc_server.py
```

Keep this terminal open.

### 3. Load the extension

**Chrome:**
1. Open `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `extension/` folder

**Firefox:**
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `extension/manifest.json`

### 4. Play a video

Open [youtube.com](https://youtube.com), play anything. Your Discord status updates automatically.

## How it works

```
YouTube page
    -> content.js detects video info
    -> background.js sends it over WebSocket
    -> rpc_server.py receives it
    -> pypresence pushes it to Discord
```

All communication is local. Nothing leaves your machine.

## Troubleshooting

**RPC not showing?**
- Make sure `rpc_server.py` is running
- Make sure Discord desktop app is open
- Check the extension popup (click the icon) - it should say "Connected"

**"Discord not connected" in terminal?**
- Start Discord first, then run the server
- The server retries automatically every 30 seconds

**Extension says "Disconnected"?**
- Start the Python server first, then click "Refresh" in the popup

## License

MIT
