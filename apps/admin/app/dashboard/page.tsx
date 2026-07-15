"use client";

import { useSystemStats } from "@/app/hooks/useSystemStats";
import { StatCard } from "@/app/components/StatCard";

function formatBytes(bytes: number) {
  const gb = bytes / 1024 ** 3;
  return gb.toFixed(1) + " GB";
}

export default function DashboardPage() {
  const { stats, connected } = useSystemStats();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            connected ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
          }`}
        >
          {connected ? "Live" : "Disconnected"}
        </span>
      </div>

      {!stats && <p className="text-neutral-400">Waiting for data...</p>}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="CPU"
            value={`${stats.cpu.percent.toFixed(1)}%`}
            sub={stats.cpu.temp_celsius ? `${stats.cpu.temp_celsius.toFixed(0)} C` : undefined}
          />
          <StatCard
            label="Memory"
            value={`${stats.memory.percent.toFixed(1)}%`}
            sub={`${formatBytes(stats.memory.used)} / ${formatBytes(stats.memory.total)}`}
          />
          <StatCard
            label="Disk"
            value={`${stats.disk.percent.toFixed(1)}%`}
            sub={`${formatBytes(stats.disk.used)} / ${formatBytes(stats.disk.total)}`}
          />
          <StatCard
            label="Network"
            value={`Down: ${formatBytes(stats.network.bytes_recv)}`}
            sub={`Up: ${formatBytes(stats.network.bytes_sent)}`}
          />
        </div>
      )}
    </div>
  );
}
