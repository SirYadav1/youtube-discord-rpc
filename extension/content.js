(function() {
  'use strict';

  let currentVideoId = null;
  let intervalId = null;

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

  function sendVideoInfo() {
    const info = getVideoInfo();
    if (!info) return;

    const videoKey = `${info.videoId}_${info.playing}`;
    if (videoKey === currentVideoId) return;
    currentVideoId = videoKey;

    const api = (typeof browser !== 'undefined') ? browser : chrome;
    api.runtime.sendMessage({ type: 'YT_RPC_VIDEO_INFO', data: info }, () => {
      if (chrome.runtime.lastError) {}
    });
  }

  function startMonitoring() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(sendVideoInfo, 3000);
    sendVideoInfo();

    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('play', sendVideoInfo);
      video.addEventListener('pause', sendVideoInfo);
      video.addEventListener('ended', sendVideoInfo);
    }
  }

  function init() {
    if (!window.location.search.includes('v=')) return;
    const check = setInterval(() => {
      if (document.querySelector('video')) {
        clearInterval(check);
        startMonitoring();
      }
    }, 1000);
    setTimeout(() => clearInterval(check), 10000);
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      if (intervalId) clearInterval(intervalId);
      currentVideoId = null;
      setTimeout(init, 1000);
    }
  }).observe(document.body, { childList: true, subtree: true });

  init();
})();
