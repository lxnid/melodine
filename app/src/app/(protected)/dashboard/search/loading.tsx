export default function LoadingSearch() {
  return (
    <main className="px-6 pt-6 pb-24 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="h-6 w-24 bg-white/10 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
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