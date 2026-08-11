import { Button } from "@/components/ui/Button";

const CONFETTI = [
  { dx: 0, dy: -64, size: 8, color: "#059669", delay: 80 },
  { dx: 46, dy: -46, size: 6, color: "#c9a227", delay: 140 },
  { dx: 64, dy: 0, size: 9, color: "#0b3d2e", delay: 40 },
  { dx: 46, dy: 46, size: 6, color: "#e7cf8c", delay: 200 },
  { dx: 0, dy: 64, size: 8, color: "#059669", delay: 120 },
  { dx: -46, dy: 46, size: 6, color: "#c9a227", delay: 60 },
  { dx: -64, dy: 0, size: 9, color: "#0b3d2e", delay: 180 },
  { dx: -46, dy: -46, size: 6, color: "#e7cf8c", delay: 100 },
  { dx: 34, dy: -58, size: 5, color: "#c9a227", delay: 240 },
  { dx: -34, dy: -58, size: 5, color: "#059669", delay: 160 },
  { dx: 58, dy: 34, size: 5, color: "#e7cf8c", delay: 220 },
  { dx: -58, dy: 34, size: 5, color: "#c9a227", delay: 280 },
];

export function SuccessState() {
  return (
    <div className="animate-fade-in flex flex-col items-center py-2 text-center">
      <div className="relative h-24 w-24">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="confetti-dot"
            style={
              {
                "--dx": `${c.dx}px`,
                "--dy": `${c.dy}px`,
                width: `${c.size}px`,
                height: `${c.size}px`,
                background: c.color,
                animationDelay: `${c.delay}ms`,
              } as React.CSSProperties
            }
            aria-hidden="true"
          />
        ))}
        <div className="animate-pop-in absolute inset-0 flex items-center justify-center rounded-full bg-brand-emerald/10 ring-2 ring-brand-emerald/40">
          <svg viewBox="0 0 52 52" className="h-11 w-11" aria-hidden="true">
            <circle
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="#059669"
              strokeWidth="3"
            />
            <path
              fill="none"
              stroke="#0b3d2e"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27l8 8 16-17"
              className="check-draw"
            />
          </svg>
        </div>
      </div>

      <h1 className="mt-8 font-display text-3xl font-semibold text-brand-deep">
        🎉 You&apos;re subscribed!
      </h1>
      <p className="mt-3 text-brand-deep/70">
        Watch your inbox for the next Hausa Arabia lesson.
      </p>
      <p className="mt-2 text-sm font-medium text-brand-emerald">
        Thank you for joining the Hausa Arabia community.
      </p>

      <Button
        href={
          process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://hausa-arabia.com"
        }
        className="mt-8"
      >
        Back to Hausa Arabia
      </Button>
    </div>
  );
}
