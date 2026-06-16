(function() {
  'use strict';

  let currentVideoId = null;
  let lastSentKey = null;
  let intervalId = null;
  let pendingVideoChange = null;

  function getVideoInfo() {
    try {
      const video = document.querySelector('video');
      if (!video) return null;

      const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, h1.title yt-formatted-string, #title h1 yt-formatted-string');
      const title = titleEl ? titleEl.textContent.trim() : document.title.replace(' - YouTube', '').trim();

      const channelEl = document.querySelector('#channel-name yt-formatted-string a, ytd-channel-name yt-formatted-string a, #owner-name a');
      const channel = channelEl ? channelEl.textContent.trim() : 'Unknown Channel';

      const videoId = new URLSearchParams(window.location.search).get('v');
      const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

      return {
        title: title.substring(0, 128),
        channel: channel.substring(0, 64),
        thumbnail,
        duration: Math.floor(video.duration) || 0,
        elapsed: Math.floor(video.currentTime) || 0,
        playing: !video.paused,
        url: window.location.href,
        videoId: videoId || ''
      };
    } catch (e) {
      return null;
    }
  }

  function sendVideoInfo(force) {
    const info = getVideoInfo();
    if (!info) return;

    const api = (typeof browser !== 'undefined') ? browser : chrome;

    if (force) {
      lastSentKey = null;
    }

    const sendKey = `${info.videoId}_${info.playing}_${info.title}`;
    if (sendKey === lastSentKey) return;
    lastSentKey = sendKey;

    api.runtime.sendMessage({ type: 'YT_RPC_VIDEO_INFO', data: info }, () => {
      if (chrome.runtime.lastError) {}
    });
  }

  function startMonitoring() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(function() { sendVideoInfo(false); }, 1000);
    sendVideoInfo(true);

    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('play', function() { sendVideoInfo(true); });
      video.addEventListener('pause', function() { sendVideoInfo(true); });
      video.addEventListener('ended', function() { sendVideoInfo(true); });
    }
  }

  function handleVideoChange() {
    if (pendingVideoChange) clearTimeout(pendingVideoChange);
    pendingVideoChange = setTimeout(function() {
      lastSentKey = null;
      startMonitoring();
    }, 500);
  }

  function init() {
    if (!window.location.search.includes('v=')) return;
    const check = setInterval(function() {
      if (document.querySelector('video')) {
        clearInterval(check);
        startMonitoring();
      }
    }, 500);
    setTimeout(function() { clearInterval(check); }, 8000);
  }

  let lastUrl = location.href;
  new MutationObserver(function() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      if (intervalId) clearInterval(intervalId);
      currentVideoId = null;
      handleVideoChange();
    }
  }).observe(document.body, { childList: true, subtree: true });

  init();
})();
