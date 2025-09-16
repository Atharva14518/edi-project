// High-level wrapper for device discovery + file transfer
import { discoverDevices } from "../../electron/device_discovery_implementation";
import { sendFile } from "./electron_integration";

export default class XTransferService {
  static async discover() {
    return discoverDevices();
  }

  static async transfer(filePath, deviceId) {
    return sendFile(filePath, deviceId);
  }
}
