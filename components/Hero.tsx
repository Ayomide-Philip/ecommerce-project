const productColors = [
  "bg-blue-400/30",
  "bg-rose-400/30",
  "bg-teal-600/30",
  "bg-amber-400/30",
  "bg-rose-300/30",
  "bg-orange-300/30",
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mt-24 sm:mt-26 lg:mt-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1/2 top-10 hidden h-72 w-72 -translate-x-1/2 bg-[radial-gradient(circle,rgba(61,107,255,0.08)_0%,rgba(11,11,13,0)_70%)] dark:block"
      />

      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        <div className="text-center space-y-4 sm:space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            New Arrivals, 2024
          </p>
          <h1
            id="hero-heading"
            className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-medium leading-tight text-cloud"
          >
            Your Source for Trendsetting Fashion.
          </h1>
          <p className="mx-auto max-w-2xl text-black/70 dark:text-cloud/70">
            Whether you&apos;re looking for bold statements or timeless
            classics, our selection offers something for every fashion-forward
            individual. Stay stylish, stay ahead, and find your next favorite
            outfit here.
          </p>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cloud transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
            >
              New Collection
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 sm:gap-5 px-4 sm:px-6 lg:px-8 pb-4 justify-center sm:justify-start">
            {productColors.map((color, index) => (
              <div
                key={index}
                className="shrink-0 w-40 sm:w-48 md:w-56 aspect-3/4 rounded-3xl overflow-hidden glass border border-black/12 dark:border-[rgba(244,244,242,0.12)] shadow-lg transition hover:scale-105 hover:shadow-xl duration-300"
              >
                <div
                  className={`w-full h-full ${color} relative flex items-center justify-center`}
                >
                  <div className="absolute inset-1 rounded-3xl border border-white/10 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
