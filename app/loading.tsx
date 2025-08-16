export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 p-4">
      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-white/10 animate-pulse" />
        ))}
      </div>
    </main>
  );
}
