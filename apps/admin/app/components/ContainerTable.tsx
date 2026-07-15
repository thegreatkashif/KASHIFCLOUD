"use client";

import { useContainers } from "@/app/hooks/useContainers";

function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  const mb = bytes / 1024 ** 2;
  return mb.toFixed(0) + " MB";
}

function statusColor(status: string) {
  if (status === "running") return "bg-green-900 text-green-400";
  if (status === "exited") return "bg-red-900 text-red-400";
  return "bg-neutral-800 text-neutral-400";
}

export function ContainerTable() {
  const { containers, loading, performAction } = useContainers();

  if (loading) {
    return <p className="text-neutral-400">Loading containers...</p>;
  }

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-left text-neutral-400">
            <th className="p-3">Name</th>
            <th className="p-3">Image</th>
            <th className="p-3">Status</th>
            <th className="p-3">CPU</th>
            <th className="p-3">Memory</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.id} className="border-b border-neutral-800 last:border-0">
              <td className="p-3 text-white">{c.name}</td>
              <td className="p-3 text-neutral-400">{c.image}</td>
              <td className="p-3">
                <span className={"text-xs px-2 py-1 rounded-full " + statusColor(c.status)}>
                  {c.status}
                </span>
              </td>
              <td className="p-3 text-neutral-300">{c.cpu_percent}%</td>
              <td className="p-3 text-neutral-300">{formatBytes(c.memory_usage)}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => performAction(c.id, "start")}
                  disabled={c.status === "running"}
                  className="text-xs px-2 py-1 rounded bg-green-800 text-green-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-700"
                >
                  Start
                </button>
                <button
                  onClick={() => performAction(c.id, "stop")}
                  disabled={c.status !== "running"}
                  className="text-xs px-2 py-1 rounded bg-red-800 text-red-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-700"
                >
                  Stop
                </button>
                <button
                  onClick={() => performAction(c.id, "restart")}
                  disabled={c.status !== "running"}
                  className="text-xs px-2 py-1 rounded bg-blue-800 text-blue-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700"
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
