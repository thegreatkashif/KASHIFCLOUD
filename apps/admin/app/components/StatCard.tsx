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
    <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-2xl font-semibold text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
    </div>
  );
}
