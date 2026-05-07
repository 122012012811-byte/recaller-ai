import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-2xl space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Recallr AI</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Weather dashboard ready at `/weather`</h1>
        <p className="text-base text-slate-300 sm:text-lg">
          Launch the new forecast experience with secure server-side API proxying, responsive cards, favorites, search history, and geolocation.
        </p>
        <Link
          href="/weather"
          className="inline-flex h-12 items-center justify-center rounded-full bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Open weather dashboard
        </Link>
      </div>
    </main>
  );
}
