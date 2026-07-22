"use client";

import { useEffect, useState } from "react";

export interface NetworkDevice {
  ip: string;
  mac: string;
  vendor: string;
  hostname: string | null;
}

export function useNetworkDevices() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await fetch("/api/network/devices");
        if (res.ok) {
          const data = await res.json();
          setDevices(Array.isArray(data.devices) ? data.devices : []);
          setLastScan(data.last_scan ?? null);
        } else {
          setDevices([]);
        }
      } catch {
        setDevices([]);
      }
      setLoading(false);
    }

    fetchDevices();
    const interval = setInterval(fetchDevices, 15000);
    return () => clearInterval(interval);
  }, []);

  return { devices, lastScan, loading };
}
