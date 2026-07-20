"use client";

import { useNetworkDevices } from "@/app/hooks/useNetwork";

function timeAgo(iso: string | null) {
  if (!iso) return "never";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 minute ago";
  return mins + " minutes ago";
}

export function NetworkDevices() {
  const { devices, lastScan, loading } = useNetworkDevices();

  if (loading) {
    return (
      <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
        Scanning...
      </p>
    );
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: "var(--panel)", border: "1px solid var(--panel-border)" }}
    >
      <div
        className="flex items-center justify-between p-3"
        style={{ borderBottom: "1px solid var(--panel-border)" }}
      >
        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
          {devices.length} device{devices.length === 1 ? "" : "s"} connected
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          Last scan: {timeAgo(lastScan)}
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--panel-border)" }}>
            {["Device", "IP Address", "MAC Address", "Vendor"].map((h) => (
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
          {devices.map((d) => (
            <tr key={d.mac} style={{ borderBottom: "1px solid var(--panel-border)" }}>
              <td className="p-3" style={{ color: "var(--text-primary)" }}>
                {d.hostname ? d.hostname : "Unknown Device"}
              </td>
              <td className="p-3 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                {d.ip}
              </td>
              <td className="p-3 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                {d.mac}
              </td>
              <td className="p-3 text-xs" style={{ color: "var(--text-muted)" }}>
                {d.vendor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
