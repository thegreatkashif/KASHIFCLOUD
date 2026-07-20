export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--panel)", border: "1px solid var(--panel-border)" }}
    >
      <p
        className="text-xs tracking-widest"
        style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--text-muted)" }}
      >
        {label.toUpperCase()}
      </p>
      <p
        className="text-2xl mt-1"
        style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="text-xs mt-1"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--text-muted)" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
