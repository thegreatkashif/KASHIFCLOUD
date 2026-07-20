export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(184,32,47,0.06), transparent 50%), var(--void)",
        color: "var(--text-primary)",
      }}
    >
      <nav
        className="p-4 flex justify-between items-center"
        style={{ borderBottom: "1px solid var(--panel-border)" }}
      >
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 40 40" className="w-6 h-6">
            <polygon
              points="20,2 36,11 36,29 20,38 4,29 4,11"
              fill="none"
              stroke="var(--crimson)"
              strokeWidth="2"
            />
            <circle cx="20" cy="20" r="3" fill="var(--crimson)" />
          </svg>
          <span
            className="tracking-widest text-sm"
            style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}
          >
            KASHIF CLOUD
          </span>
          <span
            className="text-xs tracking-wide hidden sm:inline"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--text-muted)" }}
          >
            // ADMIN CONSOLE
          </span>
        </div>
        <form action="/api/logout" method="post">
          <button
            formAction="/api/logout"
            className="text-xs px-3 py-1.5 rounded tracking-wide transition-colors"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--text-muted)",
              border: "1px solid var(--panel-border)",
            }}
          >
            SIGN OUT
          </button>
        </form>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
