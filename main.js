// Electron main in plain CommonJS to avoid TS interop issues
console.log('versions.electron:', process.versions.electron);
console.log('ELECTRON_RUN_AS_NODE:', process.env.ELECTRON_RUN_AS_NODE);
const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

/** @type {import('electron').BrowserWindow | null} */
let mainWindow = null;

function createMainWindow() {
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
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
  mainWindow.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (url !== mainWindow.webContents.getURL()) { e.preventDefault(); shell.openExternal(url); }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexHtml = path.join(__dirname, 'dist/renderer/index.html');
    mainWindow.loadFile(indexHtml);
  }
}

app.whenReady().then(() => {
  console.log('app.whenReady()');
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });


