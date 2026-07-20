"use client";

import { useSystemStats } from "@/app/hooks/useSystemStats";
import { StatCard } from "@/app/components/StatCard";
import { ContainerTable } from "@/app/components/ContainerTable";
import { StorageBrowser } from "@/app/components/StorageBrowser";
import { NetworkDevices } from "@/app/components/NetworkDevices";
import { JobsPanel } from "@/app/components/JobsPanel";
import { SectionHeader } from "@/app/components/SectionHeader";

function formatBytes(bytes: number) {
  const gb = bytes / 1024 ** 3;
  return gb.toFixed(1) + " GB";
}

export default function DashboardPage() {
  const { stats, connected } = useSystemStats();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-xl tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}
        >
          OVERVIEW
        </h1>
        <span
          className="text-xs px-3 py-1 rounded-full flex items-center gap-2 tracking-wide"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            background: connected ? "rgba(63,174,106,0.12)" : "rgba(184,32,47,0.12)",
            color: connected ? "var(--success)" : "var(--crimson-glow)",
          }}
        >
          <span
            className="pulse-dot"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: connected ? "var(--success)" : "var(--crimson-glow)",
              display: "inline-block",
            }}
          />
          {connected ? "LIVE" : "DISCONNECTED"}
        </span>
      </div>

      {!stats && (
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
          Waiting for data...
        </p>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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

      <div className="mb-10">
        <SectionHeader title="Containers" />
        <ContainerTable />
      </div>

      <div className="mb-10">
        <SectionHeader title="Storage" />
        <StorageBrowser />
      </div>

      <div className="mb-10">
        <SectionHeader title="Network Devices" />
        <NetworkDevices />
      </div>

      <div>
        <SectionHeader title="Automation Jobs" />
        <JobsPanel />
      </div>
    </div>
  );
}
