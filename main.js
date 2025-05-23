const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    fullscreenable: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setIgnoreMouseEvents(true);
  win.loadFile('index.html');
  win.center();
}

app.whenReady().then(() => {
  createWindow();

  // Register global shortcut to trigger Jaco cut-in
  globalShortcut.register('Control+Shift+J', () => {
    if (win) {
      win.webContents.send('trigger-cutin');
    }
  });

  // Optional: Escape closes window
  globalShortcut.register('Escape', () => {
    if (win) {
      win.close();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
