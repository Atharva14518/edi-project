export function sendFile(filePath, deviceId) {
    if (!window.electronAPI) return;
    return window.electronAPI.sendFile(filePath, deviceId);
  }
  
  export function selectFiles() {
    if (!window.electronAPI) return;
    return window.electronAPI.selectFiles();
  }
  