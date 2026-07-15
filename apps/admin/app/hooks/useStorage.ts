"use client";

import { useCallback, useEffect, useState } from "react";

export interface StorageRoot {
  name: string;
  available: boolean;
  total: number | null;
  used: number | null;
}

export interface StorageEntry {
  name: string;
  is_dir: boolean;
  size: number | null;
  modified: number;
}

export function useStorageRoots() {
  const [roots, setRoots] = useState<StorageRoot[]>([]);

  useEffect(() => {
    fetch("/api/storage/roots")
      .then((r) => r.json())
      .then(setRoots);
  }, []);

  return roots;
}

export function useStorageBrowser(root: string, path: string) {
  const [entries, setEntries] = useState<StorageEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      "/api/storage/browse?root=" + root + "&path=" + encodeURIComponent(path)
    );
    if (res.ok) {
      setEntries(await res.json());
    }
    setLoading(false);
  }, [root, path]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function deleteItem(name: string) {
    const itemPath = path ? path + "/" + name : name;
    await fetch(
      "/api/storage/item?root=" + root + "&path=" + encodeURIComponent(itemPath),
      { method: "DELETE" }
    );
    await refresh();
  }

  async function makeDir(name: string) {
    await fetch(
      "/api/storage/mkdir?root=" +
        root +
        "&path=" +
        encodeURIComponent(path) +
        "&name=" +
        encodeURIComponent(name),
      { method: "POST" }
    );
    await refresh();
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    await fetch(
      "/api/storage/upload?root=" + root + "&path=" + encodeURIComponent(path),
      { method: "POST", body: formData }
    );
    await refresh();
  }

  function downloadUrl(name: string) {
    const itemPath = path ? path + "/" + name : name;
    return "/api/storage/download?root=" + root + "&path=" + encodeURIComponent(itemPath);
  }

  return { entries, loading, refresh, deleteItem, makeDir, uploadFile, downloadUrl };
}
