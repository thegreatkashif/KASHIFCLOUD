"use client";

import { useState } from "react";
import { useJobs } from "@/app/hooks/useJobs";

function statusColor(status: string | null) {
  if (status === "success") return "text-green-400";
  if (status === "failed") return "text-red-400";
  return "text-neutral-500";
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
    return <p className="text-neutral-400">Loading jobs...</p>;
  }

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-800 p-3">
        <span className="text-sm text-neutral-300">
          {jobs.length} job{jobs.length === 1 ? "" : "s"}
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs px-3 py-1 rounded bg-blue-800 text-blue-200 hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "New Job"}
        </button>
      </div>

      {showForm && (
        <div className="p-4 border-b border-neutral-800 space-y-3 bg-neutral-950">
          <input
            placeholder="Job name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 text-white text-sm"
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 text-white text-sm"
          >
            <option value="backup">Backup (copy folder between storage roots)</option>
            <option value="restart_on_failure">Restart container if not running</option>
            <option value="container_action">Scheduled container action</option>
          </select>

          <div>
            <label className="text-xs text-neutral-400">Cron expression (e.g. 0 3 * * * = daily at 3am)</label>
            <input
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              className="w-full p-2 rounded bg-neutral-800 text-white text-sm mt-1"
            />
          </div>

          {jobType === "backup" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-neutral-400">Source root</label>
                <select
                  value={sourceRoot}
                  onChange={(e) => setSourceRoot(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-800 text-white text-sm mt-1"
                >
                  <option value="nas">nas</option>
                  <option value="local">local</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400">Source path (blank = root)</label>
                <input
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-800 text-white text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Destination root</label>
                <select
                  value={destRoot}
                  onChange={(e) => setDestRoot(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-800 text-white text-sm mt-1"
                >
                  <option value="local">local</option>
                  <option value="nas">nas</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-400">Destination path</label>
                <input
                  value={destPath}
                  onChange={(e) => setDestPath(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-800 text-white text-sm mt-1"
                />
              </div>
            </div>
          )}

          {(jobType === "restart_on_failure" || jobType === "container_action") && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-neutral-400">Container name</label>
                <input
                  value={containerName}
                  onChange={(e) => setContainerName(e.target.value)}
                  placeholder="e.g. homepage"
                  className="w-full p-2 rounded bg-neutral-800 text-white text-sm mt-1"
                />
              </div>
              {jobType === "container_action" && (
                <div>
                  <label className="text-xs text-neutral-400">Action</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full p-2 rounded bg-neutral-800 text-white text-sm mt-1"
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
            className="w-full p-2 rounded bg-green-800 text-green-200 hover:bg-green-700 text-sm"
          >
            Create Job
          </button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-left text-neutral-400">
            <th className="p-3">Name</th>
            <th className="p-3">Type</th>
            <th className="p-3">Schedule</th>
            <th className="p-3">Last Run</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b border-neutral-800 last:border-0">
              <td className="p-3 text-white">{job.name}</td>
              <td className="p-3 text-neutral-400">{job.job_type}</td>
              <td className="p-3 text-neutral-400 font-mono text-xs">{job.cron_expression}</td>
              <td className={"p-3 text-xs " + statusColor(job.last_status)}>
                {job.last_status ? job.last_status : "never run"} ({timeAgo(job.last_run_at)})
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => runJob(job.id)}
                  className="text-xs px-2 py-1 rounded bg-blue-800 text-blue-200 hover:bg-blue-700"
                >
                  Run Now
                </button>
                <button
                  onClick={() => toggleJob(job.id, !job.enabled)}
                  className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  {job.enabled ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="text-xs px-2 py-1 rounded bg-red-900 text-red-300 hover:bg-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr>
              <td className="p-4 text-neutral-500 text-sm" colSpan={5}>
                No jobs yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
