import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  type: "expired" | "already-subscribed";
  onResendNewCode?: () => void;
}

export function ErrorState({
  type,
  onResendNewCode,
}: ErrorStateProps) {
  const isExpired = type === "expired";

  return (
    <div className="animate-fade-in flex flex-col items-center py-4 text-center">
      <div
        className={
          isExpired
            ? "flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/15 ring-2 ring-brand-gold/40"
            : "flex h-16 w-16 items-center justify-center rounded-full bg-brand-emerald/10 ring-2 ring-brand-emerald/40"
        }
      >
        {isExpired ? (
          <Clock className="h-8 w-8 text-brand-gold" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="h-8 w-8 text-brand-emerald" aria-hidden="true" />
        )}
      </div>

      {isExpired ? (
        <>
          <h1 className="mt-6 font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
            Code expired
          </h1>
          <p className="mt-3 max-w-sm text-brand-deep/70">
            Your verification code has expired. Please request a new code.
          </p>
          <Button fullWidth className="mt-8" onClick={onResendNewCode}>
            Resend New Code
          </Button>
        </>
      ) : (
        <>
          <h1 className="mt-6 font-display text-2xl font-semibold text-brand-deep sm:text-3xl">
            You&apos;re already subscribed!
          </h1>
          <p className="mt-3 max-w-sm text-brand-deep/70">
            You&apos;re already subscribed to the Hausa Arabia newsletter.
          </p>
          <Button
            href={
              process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://hausa-arabia.com"
            }
            className="mt-8"
          >
            Back to Hausa Arabia
          </Button>
        </>
      )}
    </div>
  );
}
