const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startStream: (url) => ipcRenderer.invoke("start-stream", url),
});
