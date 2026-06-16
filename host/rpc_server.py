"""
YouTube Discord RPC Server
Shows YouTube videos as Discord Rich Presence.
Run: python rpc_server.py
"""

import asyncio
import json
import sys
import time
import threading
import queue as queue_mod

try:
    import websockets
except ImportError:
    print("[!] Install websockets: pip install websockets")
    sys.exit(1)

try:
    import pypresence
except ImportError:
    print("[!] Install pypresence: pip install pypresence")
    sys.exit(1)

CLIENT_ID = "1512498951419461703"
WS_PORT = 8765

connected_clients = set()
discord_rpc = None


class DiscordRPC:
    def __init__(self):
        self.connected = False
        self.cmd_queue = queue_mod.Queue()
        self.result_queue = queue_mod.Queue()
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def _run(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        rpc = None

        for attempt in range(1, 6):
            try:
                rpc = pypresence.Presence(CLIENT_ID)
                rpc.loop = loop
                loop.run_until_complete(rpc.handshake())
                self.connected = True
                self.result_queue.put({"status": "connected"})
                print("[OK] Discord connected!")
                break
            except Exception as e:
                print(f"[!] Discord attempt {attempt}/5: {e}")
                rpc = None
                if attempt < 5:
                    time.sleep(2)

        if not rpc:
            self.result_queue.put({"status": "failed"})
            print("[!] Discord not running. Waiting for reconnection...")
            while rpc is None:
                try:
                    cmd = self.cmd_queue.get(timeout=30)
                    if cmd.get("action") == "quit":
                        return
                except queue_mod.Empty:
                    try:
                        rpc = pypresence.Presence(CLIENT_ID)
                        rpc.loop = loop
                        loop.run_until_complete(rpc.handshake())
                        self.connected = True
                        self.result_queue.put({"status": "connected"})
                        print("[OK] Discord connected!")
                    except:
                        pass

        while True:
            try:
                cmd = self.cmd_queue.get(timeout=1)
            except queue_mod.Empty:
                continue

            action = cmd.get("action")

            if action == "quit":
                break

            if action == "clear" and rpc:
                try:
                    rpc.clear()
                    self.result_queue.put({"status": "cleared"})
                except Exception as e:
                    self.result_queue.put({"status": "error", "error": str(e)})

            elif action == "update" and rpc:
                data = cmd.get("data", {})
                try:
                    title = data.get("title", "Unknown")
                    channel = data.get("channel", "Unknown")
                    url = data.get("url", "")
                    duration = data.get("duration", 0)
                    elapsed = data.get("elapsed", 0)
                    playing = data.get("playing", True)
                    thumbnail = data.get("thumbnail", "")

                    if not playing:
                        rpc.clear()
                        self.result_queue.put({"status": "updated", "title": title[:50]})
                        continue

                    kwargs = {
                        "details": title[:100],
                        "state": channel[:50],
                        "large_image": thumbnail if thumbnail else "youtube_large",
                        "large_text": title[:128],
                        "small_image": "play",
                        "small_text": "Playing",
                    }

                    if elapsed > 0:
                        kwargs["start"] = time.time() - elapsed
                        if duration > 0:
                            kwargs["end"] = kwargs["start"] + duration

                    if url:
                        kwargs["buttons"] = [{"label": "Watch Video", "url": url}]

                    rpc.update(**kwargs)
                    self.result_queue.put({"status": "updated", "title": title[:50]})
                except Exception as e:
                    self.result_queue.put({"status": "error", "error": str(e)})

        if rpc:
            try:
                rpc.close()
            except:
                pass

    def update(self, data):
        self.cmd_queue.put({"action": "update", "data": data})

    def clear(self):
        self.cmd_queue.put({"action": "clear"})

    def stop(self):
        self.cmd_queue.put({"action": "quit"})


async def handler(websocket, path=None):
    connected_clients.add(websocket)
    print(f"[+] Extension connected ({len(connected_clients)} total)")

    try:
        await websocket.send(json.dumps({
            "type": "connected",
            "discord": discord_rpc.connected if discord_rpc else False
        }))

        async for message in websocket:
            try:
                data = json.loads(message)
            except (json.JSONDecodeError, ValueError):
                continue

            if data.get("type") == "clear":
                if discord_rpc:
                    discord_rpc.clear()
                try:
                    await websocket.send(json.dumps({"type": "cleared"}))
                except:
                    pass
                print("[OK] RPC cleared")
                continue

            title = data.get("title", "")
            if not title:
                continue

            if not discord_rpc or not discord_rpc.connected:
                try:
                    await websocket.send(json.dumps({
                        "type": "error",
                        "error": "Discord not connected - is Discord running?"
                    }))
                except:
                    pass
                continue

            discord_rpc.update(data)
            try:
                await websocket.send(json.dumps({"type": "updated", "title": title[:50]}))
            except:
                pass
            print(f"[OK] RPC: {title[:40]}...")

    except websockets.exceptions.ConnectionClosed:
        pass
    except Exception as e:
        print(f"[!] Client error: {e}")
    finally:
        connected_clients.discard(websocket)
        print(f"[-] Extension disconnected ({len(connected_clients)} total)")


async def main():
    global discord_rpc

    print("=" * 50)
    print("  YouTube Discord RPC Server")
    print("=" * 50)
    print()

    print("[*] Connecting to Discord...")
    discord_rpc = DiscordRPC()

    try:
        result = discord_rpc.result_queue.get(timeout=15)
        if result.get("status") == "connected":
            print("[OK] Discord connection confirmed!")
        else:
            print("[!] Discord not available yet, will retry...")
    except queue_mod.Empty:
        print("[!] Discord connection timeout, will retry...")

    print(f"[*] Starting WebSocket server on port {WS_PORT}...")
    server = await websockets.serve(handler, "localhost", WS_PORT)

    print(f"[OK] WebSocket server: ws://localhost:{WS_PORT}")
    print()
    print("  YouTube playing -> Shows YouTube video")
    print("  YouTube paused  -> Clears Discord presence")
    print()
    print("  Keep this window open!")
    print("  Press Ctrl+C to stop.")
    print()

    try:
        await asyncio.Future()
    except (KeyboardInterrupt, SystemExit):
        pass

    print("\n[*] Shutting down...")
    server.close()
    await server.wait_closed()
    if discord_rpc:
        discord_rpc.stop()
    print("[OK] Goodbye!")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
