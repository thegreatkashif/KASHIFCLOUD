"use client";

import { useEffect, useRef, useState } from "react";

export interface SystemStats {
  cpu: { percent: number; per_core: number[]; temp_celsius: number | null };
  memory: { total: number; used: number; percent: number };
  disk: { total: number; used: number; percent: number };
  network: { bytes_sent: number; bytes_recv: number };
}

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      const tokenRes = await fetch("/api/token");
      if (!tokenRes.ok) return;
      const { token } = await tokenRes.json();

      if (cancelled) return;

      const host = 
        typeof window !== "undefined"
          ? window.location.hostname + ":8000"
          : process.env.NEXT_PUBLIC_API_HOST!;
      const ws = new WebSocket(`ws://${host}/monitoring/ws?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);
      ws.onmessage = (event) => {
        setStats(JSON.parse(event.data));
      };
    }

    connect();

    return () => {
      cancelled = true;
      wsRef.current?.close();
    };
  }, []);
return { stats, connected };
}
