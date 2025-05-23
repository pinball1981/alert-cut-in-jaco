const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onCutInTrigger: (callback) => ipcRenderer.on('trigger-cutin', callback),
});
