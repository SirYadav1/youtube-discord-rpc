document.addEventListener('DOMContentLoaded', () => {
  const api = (typeof browser !== 'undefined') ? browser : chrome;
  const toggle = document.getElementById('rpcToggle');
  const statusBadge = document.getElementById('statusBadge');
  const serverStatus = document.getElementById('serverStatus');
  const videoSection = document.getElementById('videoInfo');
  const videoTitle = document.getElementById('videoTitle');
  const videoChannel = document.getElementById('videoChannel');
  const refreshBtn = document.getElementById('refreshBtn');

  function updateUI(response) {
    if (!response) return;
    toggle.checked = response.enabled;

    if (!response.enabled) {
      statusBadge.className = 'status-badge disconnected';
      statusBadge.textContent = 'Disabled';
      serverStatus.textContent = 'RPC turned off';
      serverStatus.className = 'status-text';
    } else if (response.connected) {
      statusBadge.className = 'status-badge connected';
      statusBadge.textContent = 'Connected';
      serverStatus.textContent = 'Server running';
      serverStatus.className = 'status-text ok';
    } else {
      statusBadge.className = 'status-badge error';
      statusBadge.textContent = 'Disconnected';
      serverStatus.textContent = 'Start server first!';
      serverStatus.className = 'status-text error';
    }

    if (response.lastVideo) {
      videoSection.classList.remove('hidden');
      videoTitle.textContent = response.lastVideo.title || 'Unknown';
      videoChannel.textContent = response.lastVideo.channel || 'Unknown';
    } else {
      videoSection.classList.add('hidden');
    }
  }

  api.runtime.sendMessage({ type: 'YT_RPC_STATUS' }, updateUI);

  toggle.addEventListener('change', () => {
    api.runtime.sendMessage({ type: 'YT_RPC_TOGGLE', enabled: toggle.checked }, (response) => {
      if (response) updateUI({ enabled: response.enabled, connected: false, lastVideo: null });
    });
  });

  refreshBtn.addEventListener('click', () => {
    api.runtime.sendMessage({ type: 'YT_RPC_STATUS' }, updateUI);
  });
});
