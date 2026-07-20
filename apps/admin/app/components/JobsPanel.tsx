"use client";

import { useState } from "react";
import { useJobs } from "@/app/hooks/useJobs";

function statusColor(status: string | null) {
  if (status === "success") return "var(--success)";
  if (status === "failed") return "var(--crimson-glow)";
  return "var(--text-muted)";
}

function timeAgo(iso: string | null) {
  if (!iso) return "never";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  const hours = Math.floor(mins / 60);
  return hours + "h ago";
}

const inputStyle = {
  background: "#0a0a10",
  border: "1px solid var(--panel-border)",
  color: "var(--text-primary)",
};

export function JobsPanel() {
  const { jobs, loading, createJob, toggleJob, deleteJob, runJob } = useJobs();
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [jobType, setJobType] = useState("backup");
  const [cron, setCron] = useState("0 3 * * *");

  const [sourceRoot, setSourceRoot] = useState("nas");
  const [sourcePath, setSourcePath] = useState("");
  const [destRoot, setDestRoot] = useState("local");
  const [destPath, setDestPath] = useState("backups");

  const [containerName, setContainerName] = useState("");
  const [action, setAction] = useState("restart");

  async function handleCreate() {
    let config: Record<string, string> = {};

    if (jobType === "backup") {
      config = {
        source_root: sourceRoot,
        source_path: sourcePath,
        dest_root: destRoot,
        dest_path: destPath,
      };
    } else if (jobType === "restart_on_failure") {
      config = { container_name: containerName };
    } else if (jobType === "container_action") {
      config = { container_name: containerName, action: action };
    }

    await createJob({ name, job_type: jobType, cron_expression: cron, config });
    setShowForm(false);
    setName("");
  }

  if (loading) {
    return (
      <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
        Loading jobs...
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
          {jobs.length} job{jobs.length === 1 ? "" : "s"}
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs px-3 py-1 rounded"
          style={{ background: "rgba(184,32,47,0.15)", color: "var(--crimson-glow)" }}
        >
          {showForm ? "Cancel" : "New Job"}
        </button>
      </div>

      {showForm && (
        <div
          className="p-4 space-y-3"
          style={{ borderBottom: "1px solid var(--panel-border)", background: "var(--void)" }}
        >
          <input
            placeholder="Job name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded text-sm"
            style={inputStyle}
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full p-2 rounded text-sm"
            style={inputStyle}
          >
            <option value="backup">Backup (copy folder between storage roots)</option>
            <option value="restart_on_failure">Restart container if not running</option>
            <option value="container_action">Scheduled container action</option>
          </select>

          <div>
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>
              Cron expression (e.g. 0 3 * * * = daily at 3am)
            </label>
            <input
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              className="w-full p-2 rounded text-sm mt-1"
              style={inputStyle}
            />
          </div>

          {jobType === "backup" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs" style={{ color: "var(--text-muted)" }}>Source root</label>
                <select
                  value={sourceRoot}
                  onChange={(e) => setSourceRoot(e.target.value)}
                  className="w-full p-2 rounded text-sm mt-1"
                  style={inputStyle}
                >
                  <option value="nas">nas</option>
                  <option value="local">local</option>
                </select>
              </div>
              <div>
                <label className="text-xs" style={{ color: "var(--text-muted)" }}>Source path (blank = root)</label>
                <input
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  className="w-full p-2 rounded text-sm mt-1"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs" style={{ color: "var(--text-muted)" }}>Destination root</label>
                <select
                  value={destRoot}
                  onChange={(e) => setDestRoot(e.target.value)}
                  className="w-full p-2 rounded text-sm mt-1"
                  style={inputStyle}
                >
                  <option value="local">local</option>
                  <option value="nas">nas</option>
                </select>
              </div>
              <div>
                <label className="text-xs" style={{ color: "var(--text-muted)" }}>Destination path</label>
                <input
                  value={destPath}
                  onChange={(e) => setDestPath(e.target.value)}
                  className="w-full p-2 rounded text-sm mt-1"
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {(jobType === "restart_on_failure" || jobType === "container_action") && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs" style={{ color: "var(--text-muted)" }}>Container name</label>
                <input
                  value={containerName}
                  onChange={(e) => setContainerName(e.target.value)}
                  placeholder="e.g. homepage"
                  className="w-full p-2 rounded text-sm mt-1"
                  style={inputStyle}
                />
              </div>
              {jobType === "container_action" && (
                <div>
                  <label className="text-xs" style={{ color: "var(--text-muted)" }}>Action</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full p-2 rounded text-sm mt-1"
                    style={inputStyle}
                  >
                    <option value="restart">restart</option>
                    <option value="start">start</option>
                    <option value="stop">stop</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleCreate}
            className="w-full p-2 rounded text-sm"
            style={{ background: "rgba(63,174,106,0.15)", color: "var(--success)" }}
          >
            Create Job
          </button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--panel-border)" }}>
            {["Name", "Type", "Schedule", "Last Run", "Actions"].map((h) => (
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
          {jobs.map((job) => (
            <tr key={job.id} style={{ borderBottom: "1px solid var(--panel-border)" }}>
              <td className="p-3" style={{ color: "var(--text-primary)" }}>{job.name}</td>
              <td className="p-3 text-xs" style={{ color: "var(--text-muted)" }}>{job.job_type}</td>
              <td className="p-3 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                {job.cron_expression}
              </td>
              <td className="p-3 text-xs" style={{ color: statusColor(job.last_status) }}>
                {job.last_status ? job.last_status : "never run"} ({timeAgo(job.last_run_at)})
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => runJob(job.id)}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: "rgba(106,53,168,0.2)", color: "var(--violet)" }}
                >
                  Run Now
                </button>
                <button
                  onClick={() => toggleJob(job.id, !job.enabled)}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: "var(--panel-border)", color: "var(--text-muted)" }}
                >
                  {job.enabled ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: "rgba(184,32,47,0.15)", color: "var(--crimson-glow)" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr>
              <td className="p-4 text-sm" style={{ color: "var(--text-muted)" }} colSpan={5}>
                No jobs yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
