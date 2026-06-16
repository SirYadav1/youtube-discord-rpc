(function() {
  'use strict';

  let ws = null;
  let rpcEnabled = true;
  let reconnectTimer = null;
  let lastVideoInfo = null;
  let serverConnected = false;

  const WS_PORT = 8765;
  const WS_URL = `ws://localhost:${WS_PORT}`;

  const api = (typeof browser !== 'undefined') ? browser : chrome;

  api.storage.local.get(['rpcEnabled'], (result) => {
    rpcEnabled = result.rpcEnabled !== false;
    if (rpcEnabled) connectWebSocket();
  });

  function connectWebSocket() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        serverConnected = true;
        updateBadge('connected');
        if (lastVideoInfo) sendToServer(lastVideoInfo);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'updated') console.log('[YT-RPC] Updated:', msg.title);
          if (msg.type === 'error') console.warn('[YT-RPC] Error:', msg.error);
        } catch (e) {}
      };

      ws.onclose = () => {
        serverConnected = false;
        updateBadge('disconnected');
        scheduleReconnect();
      };

      ws.onerror = () => {
        serverConnected = false;
        updateBadge('error');
      };
    } catch (e) {
      scheduleReconnect();
    }
  }

  function scheduleReconnect() {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      if (rpcEnabled) connectWebSocket();
    }, 3000);
  }

  function sendToServer(data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  function updateBadge(status) {
    const colors = { connected: '#43b581', disconnected: '#747f8d', error: '#f04747' };
    const texts = { connected: 'ON', disconnected: 'OFF', error: 'ERR' };
    api.browserAction.setBadgeBackgroundColor({ color: colors[status] || '#747f8d' });
    api.browserAction.setBadgeText({ text: rpcEnabled ? texts[status] : '' });
  }

  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'YT_RPC_VIDEO_INFO') {
      lastVideoInfo = message.data;
      if (rpcEnabled) {
        if (!ws || ws.readyState !== WebSocket.OPEN) connectWebSocket();
        sendToServer(message.data);
      }
      sendResponse({ received: true });
    }

    if (message.type === 'YT_RPC_TOGGLE') {
      rpcEnabled = message.enabled;
      api.storage.local.set({ rpcEnabled });
      if (rpcEnabled) {
        connectWebSocket();
      } else {
        if (ws) ws.close();
        sendToServer({ type: 'clear' });
      }
      updateBadge('disconnected');
      sendResponse({ enabled: rpcEnabled });
    }

    if (message.type === 'YT_RPC_STATUS') {
      sendResponse({
        enabled: rpcEnabled,
        connected: serverConnected,
        lastVideo: lastVideoInfo
      });
    }

    return true;
  });
})();
