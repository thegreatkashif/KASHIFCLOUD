"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, remember }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setLoading(false);
      setError("ACCESS DENIED — credentials not recognized");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, rgba(184,32,47,0.10), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(106,53,168,0.12), transparent 55%), var(--void)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm animate-flicker-in">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 120 120" className="w-20 h-20">
            <polygon
              points="60,6 108,33 108,87 60,114 12,87 12,33"
              fill="none"
              stroke="var(--crimson)"
              strokeWidth="2"
              opacity="0.9"
            />
            <circle
              cx="60"
              cy="60"
              r="34"
              fill="none"
              stroke="var(--violet)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              style={{
                transformOrigin: "60px 60px",
                animation: "seal-rotate 14s linear infinite",
              }}
            />
            <polygon
              points="60,42 78,60 60,78 42,60"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              style={{
                transformOrigin: "60px 60px",
                animation: "seal-rotate-reverse 10s linear infinite",
              }}
            />
            <circle
              cx="60"
              cy="60"
              r="6"
              fill="var(--crimson)"
              style={{
                filter: "drop-shadow(0 0 8px var(--crimson-glow))",
                animation: loading ? "seal-charge 0.9s ease-in-out infinite" : undefined,
              }}
            />
          </svg>
        </div>

        <div className="text-center mb-8">
          <p
            className="text-xs tracking-[0.3em] mb-2"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            RESTRICTED ACCESS &mdash; AUTHORIZED PERSONNEL ONLY
          </p>
          <h1
            className="text-3xl tracking-widest"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)", fontWeight: 700 }}
          >
            KASHIF CLOUD
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className={"rounded-lg p-6 space-y-4 " + (shake ? "animate-shake" : "")}
          style={{
            background: "var(--panel)",
            border: "1px solid var(--panel-border)",
            boxShadow: "0 0 40px rgba(184,32,47,0.06)",
          }}
        >
          <div>
            <label
              className="block text-xs tracking-widest mb-1"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              OPERATOR ID
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded text-sm outline-none transition-shadow"
              style={{
                background: "#0a0a10",
                border: "1px solid var(--panel-border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--crimson)")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              autoComplete="username"
            />
          </div>

          <div>
            <label
              className="block text-xs tracking-widest mb-1"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              ACCESS KEY
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded text-sm outline-none transition-shadow"
              style={{
                background: "#0a0a10",
                border: "1px solid var(--panel-border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--crimson)")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: "var(--text-muted)" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[var(--crimson)]"
              />
              Remember this terminal
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="hover:underline"
              style={{ color: "var(--text-muted)" }}
            >
              Forgot access key?
            </button>
          </div>

          {error && (
            <p
              className="text-xs tracking-wide"
              style={{ color: "var(--crimson-glow)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded text-sm tracking-widest transition-opacity disabled:opacity-60"
            style={{
              background: "linear-gradient(180deg, var(--crimson), #7a1520)",
              color: "#fff",
              fontFamily: "var(--font-orbitron)",
              fontWeight: 600,
            }}
          >
            {loading ? "AUTHENTICATING..." : "INITIATE ACCESS"}
          </button>
        </form>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          SYS.STATUS: ONLINE // NODE: debian-01
        </p>
      </div>

      {showForgot && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setShowForgot(false)}
        >
          <div
            className="w-full max-w-md rounded-lg p-6"
            style={{ background: "var(--panel)", border: "1px solid var(--panel-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-lg mb-3 tracking-wide"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)" }}
            >
              CREDENTIAL RECOVERY
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              This system has no external recovery channel &mdash; no email, no SMS. Access keys
              are recovered only from the machine itself, by whoever holds the terminal.
            </p>
            <p
              className="text-xs mb-2 tracking-wide"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              RUN ON THE SERVER:
            </p>
            <pre
              className="text-xs p-3 rounded overflow-x-auto mb-4"
              style={{
                background: "#0a0a10",
                border: "1px solid var(--panel-border)",
                color: "var(--gold)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              docker-compose exec api python -m app.cli --username admin
            </pre>
            <button
              onClick={() => setShowForgot(false)}
              className="w-full p-2 rounded text-sm"
              style={{
                background: "var(--panel-border)",
                color: "var(--text-primary)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
