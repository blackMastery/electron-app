// Use CommonJS require without destructuring to avoid potential proxy issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const electron = require('electron');
const app = electron.app;
const { ipcMain } = electron;
const BrowserWindow = electron.BrowserWindow as unknown as typeof import('electron').BrowserWindow;
const shell = electron.shell;
import type { BrowserWindow as ElectronBrowserWindow, Event as ElectronEvent } from 'electron';
import path from 'node:path';

let mainWindow: ElectronBrowserWindow | null = null;

function createMainWindow() {
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 700,
    minWidth: 360,
    minHeight: 560,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const win = mainWindow as ElectronBrowserWindow;

  win.once('ready-to-show', () => {
    win.show();
  });

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }: { url: string }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e: ElectronEvent, url: string) => {
    if (url !== win.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });

  const indexHtml = path.join(__dirname, 'renderer/index.html');
  win.loadFile(indexHtml);

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong');
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


