import { Camera, Globe, MessageCircle, Play } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const SOCIALS = [
  { icon: Globe, label: "Hausa Arabia website" },
  { icon: Camera, label: "Hausa Arabia on Instagram" },
  { icon: MessageCircle, label: "Hausa Arabia on Facebook" },
  { icon: Play, label: "Hausa Arabia on YouTube" },
];

export function NewsletterFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-brand-deep text-center text-brand-cream sm:mt-20">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent"
      />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-6 py-14">
        <Logo className="max-w-[170px]" />

        <p className="font-display text-xl font-semibold tracking-wide text-white">
          HAUSA ARABIA
        </p>
        <p className="text-sm font-medium tracking-wide text-brand-gold-light">
          Arabic • Hausa • English
        </p>
        <p className="text-sm text-brand-cream/75">
          Learn. Connect. Communicate.
        </p>

        <div className="mt-2 flex items-center gap-3">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href="#"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-cream/20 text-brand-cream/80 transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              <social.icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className="mt-2 text-xs text-brand-cream/55">
          © 2026 Hausa Arabia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
