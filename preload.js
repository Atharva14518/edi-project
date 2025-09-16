const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAvailableDevices: () => ipcRenderer.invoke("get-available-devices"),
  sendFile: (filePath, deviceId) => ipcRenderer.invoke("send-file", { filePath, deviceId }),
  selectFiles: () => ipcRenderer.invoke("select-files"),
  getReceivedFiles: () => ipcRenderer.invoke("get-received-files"),
  openFileLocation: (filePath) => ipcRenderer.invoke("open-file-location", filePath),
  getAppInfo: () => ipcRenderer.invoke("get-app-info"),

  // Listeners
  onDeviceFound: (cb) => ipcRenderer.on("device-found", (event, ...args) => cb(...args)),
  onTransferProgress: (cb) => ipcRenderer.on("transfer-progress", (event, ...args) => cb(...args)),
  onTransferCompleted: (cb) => ipcRenderer.on("transfer-completed", (event, ...args) => cb(...args)),
});
