"use client";

import { useContainers } from "@/app/hooks/useContainers";

function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  const mb = bytes / 1024 ** 2;
  return mb.toFixed(0) + " MB";
}

function statusStyle(status: string) {
  if (status === "running") {
    return { background: "rgba(63,174,106,0.12)", color: "var(--success)" };
  }
  if (status === "exited") {
    return { background: "rgba(184,32,47,0.12)", color: "var(--crimson-glow)" };
  }
  return { background: "var(--panel-border)", color: "var(--text-muted)" };
}

export function ContainerTable() {
  const { containers, loading, performAction } = useContainers();

  if (loading) {
    return (
      <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
        Loading containers...
      </p>
    );
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: "var(--panel)", border: "1px solid var(--panel-border)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--panel-border)" }}>
            {["Name", "Image", "Status", "CPU", "Memory", "Actions"].map((h) => (
              <th
                key={h}
                className="p-3 text-left text-xs tracking-widest"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--text-muted)" }}
              >
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid var(--panel-border)" }}>
              <td className="p-3" style={{ color: "var(--text-primary)" }}>
                {c.name}
              </td>
              <td className="p-3 text-xs" style={{ color: "var(--text-muted)" }}>
                {c.image}
              </td>
              <td className="p-3">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={statusStyle(c.status)}
                >
                  {c.status.toUpperCase()}
                </span>
              </td>
              <td className="p-3 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                {c.cpu_percent}%
              </td>
              <td className="p-3 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                {formatBytes(c.memory_usage)}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => performAction(c.id, "start")}
                  disabled={c.status === "running"}
                  className="text-xs px-2 py-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: "rgba(63,174,106,0.15)", color: "var(--success)" }}
                >
                  Start
                </button>
                <button
                  onClick={() => performAction(c.id, "stop")}
                  disabled={c.status !== "running"}
                  className="text-xs px-2 py-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: "rgba(184,32,47,0.15)", color: "var(--crimson-glow)" }}
                >
                  Stop
                </button>
                <button
                  onClick={() => performAction(c.id, "restart")}
                  disabled={c.status !== "running"}
                  className="text-xs px-2 py-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: "rgba(106,53,168,0.2)", color: "var(--violet)" }}
                >
                  Restart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
