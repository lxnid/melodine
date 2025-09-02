export default function LoadingDashboard() {
  return (
    <main className="px-6 pt-6 pb-24 max-w-7xl mx-auto">
      <div className="h-7 w-40 bg-white/10 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-white/5 p-3">
            <div className="aspect-square w-full rounded-md bg-white/10" />
            <div className="mt-3 h-3 w-3/4 bg-white/10 rounded" />
            <div className="mt-2 h-3 w-1/2 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}