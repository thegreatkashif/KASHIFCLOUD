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
    return <p className="text-neutral-400">Scanning...</p>;
  }

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-800 p-3">
        <span className="text-sm text-neutral-300">
          {devices.length} device{devices.length === 1 ? "" : "s"} connected
        </span>
        <span className="text-xs text-neutral-500">
          Last scan: {timeAgo(lastScan)}
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-left text-neutral-400">
            <th className="p-3">Device</th>
            <th className="p-3">IP Address</th>
            <th className="p-3">MAC Address</th>
            <th className="p-3">Vendor</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.mac} className="border-b border-neutral-800 last:border-0">
              <td className="p-3 text-white">
                {d.hostname ? d.hostname : "Unknown Device"}
              </td>
              <td className="p-3 text-neutral-300">{d.ip}</td>
              <td className="p-3 text-neutral-400 font-mono text-xs">{d.mac}</td>
              <td className="p-3 text-neutral-400">{d.vendor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
