import React from "react";

export function DeviceCard({ device }) {
  return (
    <div className="device-card">
      <div className="device-info">
        <div className="device-name">{device.name}</div>
        <div className="device-ip">{device.ip}</div>
      </div>
    </div>
  );
}
