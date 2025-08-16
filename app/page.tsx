import Link from "next/link";

interface HomeLink {
  href: string;
  title: string;
  description: string;
}

const links: HomeLink[] = [
  { href: "/mvp", title: "Guitar Daily", description: "Plan and track practice" },
  { href: "/fretboard", title: "Fretboard", description: "Explore notes across the neck" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 p-4 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-6xl">Guitar Grok</h1>
      <section className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur transition-colors hover:bg-white/20"
          >
            <h2 className="text-2xl font-semibold group-hover:underline">{link.title}</h2>
            <p className="mt-2 text-sm opacity-80">{link.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
