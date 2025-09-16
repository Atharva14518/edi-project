const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const { startDiscovery, sendFile } = require("./electron/device_discovery_implementation");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  }
}

app.on("ready", () => {
  createWindow();
  startDiscovery(mainWindow); // ✅ device discovery
});

ipcMain.handle("send-file", async (event, { filePath, device }) => {
  return sendFile(filePath, device);
});
