"use client";

import { useCallback, useEffect, useState } from "react";

export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
}

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch("/api/docker/containers");
      if (res.ok) {
        const data = await res.json();
        setContainers(Array.isArray(data) ? data : []);
      } else {
        setContainers([]);
      }
    } catch {
      setContainers([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 5000);
    return () => clearInterval(interval);
  }, [fetchContainers]);

  async function performAction(id: string, action: "start" | "stop" | "restart") {
    await fetch("/api/docker/containers/" + id + "/" + action, { method: "POST" });
    await fetchContainers();
  }

  return { containers, loading, performAction };
}
