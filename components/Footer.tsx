const footerLinks = ["About", "Shipping", "Returns", "Contact"];

export default function Footer() {
  return (
    <footer className="glass mt-16 rounded-[20px] px-6 py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-xl text-panel dark:text-cloud">
          Adúnní
        </p>

        <ul className="flex flex-wrap items-center gap-5">
          {footerLinks.map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-sm text-panel/70 transition hover:text-panel focus-visible:text-accent dark:text-cloud/70 dark:hover:text-cloud"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
