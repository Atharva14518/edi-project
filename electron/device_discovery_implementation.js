// electron/device_discovery_implementation.js
const dgram = require("dgram");
const os = require("os");
const net = require("net");
const fs = require("fs");
const path = require("path");

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
  const udpSocket = dgram.createSocket("udp4");
  const DEVICE_PORT = 41234;
  const FILE_PORT = 5000;

  // Broadcast discovery
  udpSocket.bind(DEVICE_PORT, () => {
    udpSocket.setBroadcast(true);

    setInterval(() => {
      const device = {
        id: getLocalIP(),
        name: os.hostname(),
        ip: getLocalIP(),
        filePort: FILE_PORT,
      };
      const msg = Buffer.from(JSON.stringify(device));
      udpSocket.send(msg, 0, msg.length, DEVICE_PORT, "255.255.255.255");
    }, 3000);
  });

  // Listen for discovery broadcasts
  udpSocket.on("message", (msg, rinfo) => {
    try {
      const device = JSON.parse(msg.toString());
      if (device.ip !== getLocalIP()) {
        mainWindow.webContents.send("device-found", device);
      }
    } catch (e) {
      console.error("Invalid broadcast", e);
    }
  });

  // Start TCP server for receiving files
  const server = net.createServer((socket) => {
    let fileStream;
    socket.on("data", (chunk) => {
      if (!fileStream) {
        // First chunk = filename
        const filename = chunk.toString().split("::")[0];
        const savePath = path.join(app.getPath("downloads"), "X-Transfer", filename);

        fs.mkdirSync(path.dirname(savePath), { recursive: true });
        fileStream = fs.createWriteStream(savePath);
        const fileData = chunk.toString().split("::").slice(1).join("::");
        if (fileData) fileStream.write(fileData);
      } else {
        fileStream.write(chunk);
      }
    });
    socket.on("end", () => {
      if (fileStream) fileStream.end();
      console.log("File received");
    });
  });

  server.listen(FILE_PORT, getLocalIP(), () => {
    console.log(`File server listening on ${getLocalIP()}:${FILE_PORT}`);
  });
}

function sendFile(filePath, device) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.connect(device.filePort, device.ip, () => {
      const filename = path.basename(filePath);
      const header = filename + "::";
      client.write(header);

      const stream = fs.createReadStream(filePath);
      stream.on("data", (chunk) => client.write(chunk));
      stream.on("end", () => {
        client.end();
        resolve();
      });
    });

    client.on("error", reject);
  });
}

module.exports = { startDiscovery, sendFile };
