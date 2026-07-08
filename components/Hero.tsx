export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1/2 top-10 hidden h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(61,107,255,0.08)_0%,rgba(11,11,13,0)_70%)] dark:block"
      />

      <div className="glass relative z-10 grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:items-center md:p-10 lg:p-12">
        <div className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Curated for you
          </p>
          <h1
            id="hero-heading"
            className="font-display text-4xl font-medium leading-tight text-cloud md:text-5xl"
          >
            Where Ankara heritage meets modern street rhythm.
          </h1>
          <p className="max-w-xl text-sm text-cloud/70 md:text-base">
            Shop statement pieces from rising Nigerian designers and global
            streetwear labels in one premium marketplace.
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cloud transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
          >
            Explore collection
          </button>
        </div>

        <div
          role="img"
          aria-label="Editorial fashion visual placeholder"
          className="min-h-65 rounded-[20px] border border-black/12 bg-panel dark:border-[rgba(244,244,242,0.12)]"
        />
      </div>
    </section>
  );
}
