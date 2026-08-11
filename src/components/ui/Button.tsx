import { cn } from "@/lib/cn";

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-5 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z"
      />
    </svg>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  loading?: boolean;
  href?: string;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  loading = false,
  href,
  className,
  children,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-70",
    variant === "primary" &&
      "bg-brand-deep text-white shadow-lg shadow-brand-deep/25 ring-1 ring-inset ring-brand-gold/40 hover:bg-brand-green hover:ring-brand-gold/80 active:scale-[0.98]",
    variant === "secondary" &&
      "border border-brand-deep/15 bg-white text-brand-deep hover:border-brand-gold hover:bg-brand-cream",
    variant === "ghost" && "text-brand-emerald underline-offset-4 hover:underline",
    fullWidth && "w-full",
    className,
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {loading && <Spinner className="h-5 w-5" />}
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {loading && <Spinner className="h-5 w-5" />}
      {children}
    </button>
  );
}
