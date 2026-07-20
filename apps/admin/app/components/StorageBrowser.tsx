"use client";

import { useRef, useState } from "react";
import { useStorageRoots, useStorageBrowser } from "@/app/hooks/useStorage";

function formatBytes(bytes: number | null) {
  if (bytes === null || bytes === undefined) return "-";
  const mb = bytes / 1024 ** 2;
  if (mb > 1024) return (mb / 1024).toFixed(1) + " GB";
  return mb.toFixed(1) + " MB";
}

export function StorageBrowser() {
  const roots = useStorageRoots();
  const [activeRoot, setActiveRoot] = useState("local");
  const [path, setPath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    entries,
    loading,
    deleteItem,
    makeDir,
    uploadFile,
    downloadUrl,
  } = useStorageBrowser(activeRoot, path);

  function switchRoot(name: string) {
    setActiveRoot(name);
    setPath("");
  }

  function enterDir(name: string) {
    setPath(path ? `${path}/${name}` : name);
  }

  function goUp() {
    const parts = path.split("/").filter(Boolean);
    parts.pop();
    setPath(parts.join("/"));
  }

  async function handleNewFolder() {
    const name = window.prompt("Folder name");
    if (name) {
      await makeDir(name);
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (file) {
      await uploadFile(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleDelete(name: string) {
    if (window.confirm(`Delete ${name}?`)) {
      await deleteItem(name);
    }
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: "var(--panel)",
        border: "1px solid var(--panel-border)",
      }}
    >
      <div
        className="flex items-center justify-between p-3"
        style={{
          borderBottom: "1px solid var(--panel-border)",
        }}
      >
        <div className="flex gap-2 flex-wrap">
          {roots.map((r) => {
            const active = activeRoot === r.name;

            return (
              <button
                key={r.name}
                onClick={() => switchRoot(r.name)}
                className="text-xs px-3 py-1 rounded-full tracking-wide"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  background: active
                    ? "rgba(184,32,47,0.15)"
                    : "var(--panel-border)",
                  color: active
                    ? "var(--crimson-glow)"
                    : "var(--text-muted)",
                }}
              >
                {r.name.toUpperCase()} ({formatBytes(r.used)} /{" "}
                {formatBytes(r.total)})
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleNewFolder}
            className="text-xs px-2 py-1 rounded"
            style={{
              background: "var(--panel-border)",
              color: "var(--text-muted)",
            }}
          >
            New Folder
          </button>

          <button
            onClick={handleUploadClick}
            className="text-xs px-2 py-1 rounded"
            style={{
              background: "rgba(106,53,168,0.2)",
              color: "var(--violet)",
            }}
          >
            Upload
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div
        className="px-3 py-2 text-xs"
        style={{
          borderBottom: "1px solid var(--panel-border)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        /{activeRoot}/{path}
      </div>

      {loading && (
        <p
          className="p-4 text-sm"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Loading...
        </p>
      )}

      {!loading && (
        <table className="w-full text-sm">
          <tbody>
            {path && (
              <tr
                style={{
                  borderBottom: "1px solid var(--panel-border)",
                  cursor: "pointer",
                }}
                onClick={goUp}
              >
                <td
                  className="p-2"
                  style={{ color: "var(--text-muted)" }}
                  colSpan={3}
                >
                  ..
                </td>
              </tr>
            )}

            {entries.map((entry) => (
              <tr
                key={entry.name}
                style={{
                  borderBottom: "1px solid var(--panel-border)",
                }}
              >
                <td
                  className="p-2"
                  style={{
                    color: entry.is_dir
                      ? "var(--violet)"
                      : "var(--text-primary)",
                    cursor: entry.is_dir
                      ? "pointer"
                      : "default",
                  }}
                  onClick={() => {
                    if (entry.is_dir) {
                      enterDir(entry.name);
                    }
                  }}
                >
                  {entry.is_dir ? "[dir] " : ""}
                  {entry.name}
                </td>

                <td
                  className="p-2 w-24 text-xs"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily:
                      "var(--font-jetbrains-mono)",
                  }}
                >
                  {entry.is_dir
                    ? "-"
                    : formatBytes(entry.size)}
                </td>

                <td className="p-2 w-40">
                  {!entry.is_dir && (
                    <a
                      href={downloadUrl(entry.name)}
                      className="text-xs px-2 py-1 rounded mr-2"
                      style={{
                        background: "var(--panel-border)",
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Download
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(entry.name)}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background:
                        "rgba(184,32,47,0.15)",
                      color: "var(--crimson-glow)",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {entries.length === 0 && (
              <tr>
                <td
                  className="p-4 text-sm"
                  style={{
                    color: "var(--text-muted)",
                  }}
                  colSpan={3}
                >
                  Empty folder
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
