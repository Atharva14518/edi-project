import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress"; // shadcn/ui
import { Button } from "@/components/ui/button";
import { Upload, Monitor, Smartphone } from "lucide-react";

export default function App() {
  const [devices] = useState([
    { id: 1, name: "MacBook Pro", type: "laptop" },
    { id: 2, name: "Windows PC", type: "desktop" },
    { id: 3, name: "iPhone 15", type: "phone" },
  ]);

  const [transfers, setTransfers] = useState([]);

  // Fake file sending progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTransfers((prev) =>
        prev.map((t) =>
          t.progress < 100
            ? { ...t, progress: t.progress + Math.random() * 10 }
            : { ...t, progress: 100 }
        )
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSendFile = () => {
    const newFile = {
      id: Date.now(),
      name: "example.pdf",
      device: devices[Math.floor(Math.random() * devices.length)],
      progress: 0,
    };
    setTransfers((prev) => [...prev, newFile]);
  };

  const iconForDevice = (type) => {
    if (type === "phone") return <Smartphone className="w-6 h-6" />;
    if (type === "desktop") return <Monitor className="w-6 h-6" />;
    return <Monitor className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          X-Transfer
        </h1>

        {/* Device List */}
        <h2 className="text-xl font-semibold text-white mb-4">Available Devices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {devices.map((d) => (
            <motion.div
              key={d.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white/30 rounded-xl p-4 flex items-center gap-3 text-white shadow-lg"
            >
              {iconForDevice(d.type)}
              <span className="font-medium">{d.name}</span>
            </motion.div>
          ))}
        </div>

        {/* File Drop Zone / Send Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleSendFile}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Upload className="w-5 h-5" /> Send Random File
          </Button>
        </div>

        {/* Transfers */}
        <h2 className="text-xl font-semibold text-white mb-4">Transfers</h2>
        <div className="space-y-4">
          {transfers.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/30 rounded-xl p-4 shadow-md"
            >
              <div className="flex justify-between mb-2 text-white">
                <span>{t.name}</span>
                <span className="text-sm">
                  {t.progress >= 100 ? "Completed" : `${Math.floor(t.progress)}%`}
                </span>
              </div>
              <Progress value={t.progress} className="h-3" />
              <p className="text-xs text-gray-200 mt-1">
                Sending to {t.device.name}
              </p>
            </motion.div>
          ))}
          {transfers.length === 0 && (
            <p className="text-gray-200 text-center">No transfers yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
