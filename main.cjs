// Minimal Electron main (CommonJS)
const electron = require('electron');
console.log('electron module keys:', Object.keys(electron));
const path = require('node:path');

let mainWindow = null;

function createMainWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1024,
    height: 700,
    minWidth: 360,
    minHeight: 560,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'dist/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow && mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => { electron.shell.openExternal(url); return { action: 'deny' }; });
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (url !== mainWindow.webContents.getURL()) { e.preventDefault(); electron.shell.openExternal(url); }
  });

  const indexHtml = path.join(__dirname, 'dist/renderer/index.html');
  mainWindow.loadFile(indexHtml);
}

electron.app.whenReady().then(() => {
  createMainWindow();
  electron.app.on('activate', () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});
electron.app.on('window-all-closed', () => { if (process.platform !== 'darwin') electron.app.quit(); });


