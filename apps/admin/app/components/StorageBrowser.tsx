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

  const { entries, loading, deleteItem, makeDir, uploadFile, downloadUrl } =
    useStorageBrowser(activeRoot, path);

  function switchRoot(name: string) {
    setActiveRoot(name);
    setPath("");
  }

  function enterDir(name: string) {
    setPath(path ? path + "/" + name : name);
  }

  function goUp() {
    const parts = path.split("/").filter(Boolean);
    parts.pop();
    setPath(parts.join("/"));
  }

  async function handleNewFolder() {
    const name = window.prompt("Folder name");
    if (name) await makeDir(name);
  }

  async function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(name: string) {
    if (window.confirm("Delete " + name + "?")) {
      await deleteItem(name);
    }
  }

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between border-b border-neutral-800 p-3">
        <div className="flex gap-2">
          {roots.map(function (r) {
            return (
              <button
                key={r.name}
                onClick={function () { switchRoot(r.name); }}
                className={
                  activeRoot === r.name
                    ? "text-xs px-3 py-1 rounded-full bg-blue-800 text-blue-200"
                    : "text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
                }
              >
                {r.name} ({formatBytes(r.used)} / {formatBytes(r.total)})
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleNewFolder}
            className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          >
            New Folder
          </button>
          <button
            onClick={handleUploadClick}
            className="text-xs px-2 py-1 rounded bg-blue-800 text-blue-200 hover:bg-blue-700"
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

      <div className="px-3 py-2 text-xs text-neutral-500 border-b border-neutral-800">
        /{activeRoot}/{path}
      </div>

      {loading && <p className="p-4 text-neutral-400 text-sm">Loading...</p>}

      {!loading && (
        <table className="w-full text-sm">
          <tbody>
            {path && (
              <tr
                className="border-b border-neutral-800 hover:bg-neutral-800 cursor-pointer"
                onClick={goUp}
              >
                <td className="p-2 text-neutral-400" colSpan={4}>
                  ..
                </td>
              </tr>
            )}
            {entries.map(function (entry) {
              return (
                <tr key={entry.name} className="border-b border-neutral-800 last:border-0">
                  <td
                    className={
                      entry.is_dir
                        ? "p-2 text-blue-400 cursor-pointer hover:underline"
                        : "p-2 text-white"
                    }
                    onClick={function () { if (entry.is_dir) enterDir(entry.name); }}
                  >
                    {entry.is_dir ? "[dir] " : ""}
                    {entry.name}
                  </td>
                  <td className="p-2 text-neutral-400 w-24">
                    {entry.is_dir ? "-" : formatBytes(entry.size)}
                  </td>
                  <td className="p-2 w-40">
                    {entry.is_dir ? null : (
                      <a
                      
                        href={downloadUrl(entry.name)}
                        className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 mr-2"
                      >
                        Download
                      </a>
                    )}
                    <button
                      onClick={function () { handleDelete(entry.name); }}
                      className="text-xs px-2 py-1 rounded bg-red-900 text-red-300 hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {entries.length === 0 && (
              <tr>
                <td className="p-4 text-neutral-500 text-sm" colSpan={4}>
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
