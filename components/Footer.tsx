export default function Footer() {
  return (
    <footer className="border-t border-black/8 bg-[rgba(11,11,13,0.02)] dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50">
      <div className="mx-auto max-w-7xl px-3 py-12 sm:px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="font-display text-xl text-cloud">Ēlan</p>
            <p className="text-sm leading-relaxed text-cloud/50">
              Style reimagined. Curated fashion that blends heritage with the
              contemporary edge of streetwear culture.
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              Shop
            </p>
            <ul className="space-y-2">
              {["New Arrivals", "Categories", "Sale", "Collections"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-cloud/60 transition hover:text-cloud"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              Support
            </p>
            <ul className="space-y-2">
              {["Shipping", "Returns", "Size Guide", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-cloud/60 transition hover:text-cloud"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              Connect
            </p>
            <ul className="space-y-2">
              {["Instagram", "Twitter / X", "YouTube", "TikTok"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-cloud/60 transition hover:text-cloud"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[rgba(244,244,242,0.06)] pt-6 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/30">
            &copy; {new Date().getFullYear()} Ēlan. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/20">
            Crafted with care
          </p>
        </div>
      </div>
    </footer>
  );
}
