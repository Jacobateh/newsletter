import { Bell, BookOpen, Mic } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Learn Every Week",
    description:
      "Discover useful Hausa and Arabic vocabulary, phrases and expressions.",
  },
  {
    icon: Mic,
    title: "Improve Your Skills",
    description:
      "Get pronunciation tips, learning challenges and practical language lessons.",
  },
  {
    icon: Bell,
    title: "Stay Connected",
    description:
      "Be the first to know about new Hausa Arabia lessons, features and updates.",
  },
];

export function WhyJoinSection() {
  return (
    <section
      aria-label="Reasons to join"
      className="relative z-10 mx-auto mt-16 w-full max-w-4xl sm:mt-20"
    >
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
          Why join
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
          More Than a Newsletter
        </h2>
        <p className="mx-auto mt-3 max-w-md text-brand-deep/70">
          Stay connected to your Hausa and Arabic learning journey.
        </p>
      </div>

      <div className="mt-9 grid gap-5 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-brand-gold/25 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg hover:shadow-brand-deep/5"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-emerald/10 ring-1 ring-brand-gold/40">
              <feature.icon
                className="h-6 w-6 text-brand-emerald"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-brand-deep">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-deep/70">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
