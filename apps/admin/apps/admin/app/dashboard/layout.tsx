export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <nav className="border-b border-neutral-800 p-4 flex justify-between items-center">
        <span className="font-semibold">Kashif Cloud — Admin</span>
        <form action="/api/logout" method="post">
          <button
            formAction="/api/logout"
            className="text-sm text-neutral-400 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
