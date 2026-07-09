"use client";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base"
      role="status"
      aria-label="Loading"
    >
      <div className="absolute" aria-hidden="true">
        <div className="h-48 w-48 animate-elanSpin rounded-full border border-[rgba(244,244,242,0.06)] sm:h-64 sm:w-64" />
        <div
          className="absolute inset-0 h-48 w-48 animate-elanSpin rounded-full border-l-2 border-t-2 border-accent/60 sm:h-64 sm:w-64"
          style={{ animationDirection: "reverse", animationDuration: "2s" }}
        />
        <div
          className="absolute inset-4 h-40 w-40 animate-elanSpin rounded-full border-r-2 border-b-2 border-accent/30 sm:h-56 sm:w-56"
          style={{ animationDuration: "3s" }}
        />
      </div>

      <div className="relative" aria-hidden="true">
        <div className="flex items-center gap-1.5">
          {["Ē", "L", "A", "N"].map((letter, i) => (
            <span
              key={letter}
              className="font-display text-5xl font-medium text-cloud sm:text-6xl"
              style={{
                animation: "elanFloatReveal 2.4s ease-out infinite",
                animationDelay: `${i * 0.18}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(61,107,255,0.15) 50%, transparent 100%)",
            animation: "elanSweep 2.4s ease-in-out infinite",
          }}
        />
      </div>

      <p
        className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-cloud/30"
        style={{ animation: "elanFadeInOut 2.4s ease-in-out infinite" }}
      >
        Discovering your style
      </p>

      <span className="sr-only">Loading…</span>

      <style jsx>{`
        @keyframes elanSpin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes elanFloatReveal {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.9);
            filter: blur(4px);
          }
          35% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          70% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0.1;
            transform: translateY(-4px);
          }
        }
        @keyframes elanSweep {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes elanFadeInOut {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
