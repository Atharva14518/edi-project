// src/services/device_discovery_implementation.js
const dgram = require("dgram");
const os = require("os");

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let info of iface) {
      if (info.family === "IPv4" && !info.internal) {
        return info.address;
      }
    }
  }
  return "127.0.0.1";
}

function startDiscovery(mainWindow) {
  const socket = dgram.createSocket("udp4");

  // Listen for messages (devices broadcasting themselves)
  socket.on("message", (msg, rinfo) => {
    try {
      const device = JSON.parse(msg.toString());
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("device-found", device);
      }
    } catch (err) {
      console.error("Invalid message received:", err);
    }
  });

  // Bind socket to port
  socket.bind(41234, () => {
    socket.setBroadcast(true);

    // Broadcast this device every 3s
    setInterval(() => {
      const device = {
        id: getLocalIP(),
        name: os.hostname(),
        ip: getLocalIP(),
      };
      const message = Buffer.from(JSON.stringify(device));
      socket.send(message, 0, message.length, 41234, "255.255.255.255");
    }, 3000);
  });
}

module.exports = { startDiscovery };
