const { contextBridge, ipcRenderer } = require('electron')
export {};

declare global {
  interface Window {
    appInfo: {
      versions: { node: string; chrome: string; electron: string };
    };
    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
      ping: () => Promise<unknown>;
    };
  }
}



const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
  console.log("🚀 ~ func ~ response:", response)
}

func()
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
})
function renderVersions(): void {
  const container = document.getElementById('versions');
  if (!container) return;
  const { node, chrome, electron } = window.appInfo.versions;
  container.innerHTML = [
    `<div class="tag">Node: ${node}</div>`,
    `<div class="tag">Chromium: ${chrome}</div>`,
    `<div class="tag">Electron: ${electron}</div>`,
  ].join('');
}

window.addEventListener('DOMContentLoaded', renderVersions);


