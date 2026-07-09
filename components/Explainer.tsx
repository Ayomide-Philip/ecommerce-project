import { Eye, Sparkles, Star } from "lucide-react";

const steps = [
  {
    icon: Eye,
    title: "Browse",
    description:
      "Explore our curated collection — every item you view, save, or add to cart signals your unique taste.",
  },
  {
    icon: Sparkles,
    title: "We Learn",
    description:
      "Our AI analyzes patterns across categories, colours, and styles to build a style profile tailored to you.",
  },
  {
    icon: Star,
    title: "We Recommend",
    description:
      "Personalised picks surface the pieces you'll love — so you spend less time searching and more time styling.",
  },
];

export default function Explainer() {
  return (
    <section aria-labelledby="explainer-heading" className="space-y-12">
      <div className="mx-auto max-w-xl text-center">
        <h2
          id="explainer-heading"
          className="font-display text-2xl font-medium text-cloud sm:text-3xl"
        >
          How Ēlan Learns Your Style
        </h2>
        <p className="mt-2 text-sm text-cloud/50">
          Three steps from discovery to your next favourite fit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="glass rounded-2xl p-6 transition duration-300 hover:bg-[rgba(244,244,242,0.1)] sm:p-8"
            >
              <Icon aria-hidden="true" className="mb-4 h-6 w-6 text-cloud/40" />
              <h3 className="font-display font-medium text-cloud">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cloud/50">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
