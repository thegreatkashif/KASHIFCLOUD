export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div style={{ width: "3px", height: "18px", background: "var(--crimson)" }} />
      <h2
        className="text-sm tracking-[0.2em]"
        style={{ fontFamily: "var(--font-orbitron)", color: "var(--text-primary)" }}
      >
        {title.toUpperCase()}
      </h2>
    </div>
  );
}
