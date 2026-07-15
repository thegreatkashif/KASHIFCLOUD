"use client";

import { useCallback, useEffect, useState } from "react";

export interface Job {
  id: number;
  name: string;
  job_type: string;
  cron_expression: string;
  config: string;
  enabled: boolean;
  last_run_at: string | null;
  last_status: string | null;
  last_message: string | null;
  created_at: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    const res = await fetch("/api/jobs");
    if (res.ok) {
      setJobs(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  async function createJob(payload: {
    name: string;
    job_type: string;
    cron_expression: string;
    config: Record<string, string>;
  }) {
    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchJobs();
  }

  async function toggleJob(id: number, enabled: boolean) {
    await fetch("/api/jobs/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    await fetchJobs();
  }

  async function deleteJob(id: number) {
    await fetch("/api/jobs/" + id, { method: "DELETE" });
    await fetchJobs();
  }

  async function runJob(id: number) {
    await fetch("/api/jobs/" + id + "/run", { method: "POST" });
    await fetchJobs();
  }

  return { jobs, loading, createJob, toggleJob, deleteJob, runJob };
}
