"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Info,
  MailCheck,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "./OtpInput";

const RESEND_SECONDS = 60;
const DEMO_CODE = "123456";

interface VerificationFormProps {
  email: string;
  onVerified: () => void;
  onExpired: () => void;
  onAlreadySubscribed: () => void;
  initialNotice?: string | null;
}

export function VerificationForm({
  email,
  onVerified,
  onExpired,
  onAlreadySubscribed,
  initialNotice = null,
}: VerificationFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(initialNotice);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (verifying || resending) return;

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setError(null);
    setNotice(null);
    setVerifying(true);
    window.setTimeout(() => {
      if (code === DEMO_CODE) {
        onVerified();
        return;
      }
      setVerifying(false);
      setError(
        "Incorrect verification code. Please check your email and try again.",
      );
      setCode("");
    }, 900);
  }

  function handleResend() {
    if (resending || verifying || cooldown > 0) return;

    setResending(true);
    setError(null);
    window.setTimeout(() => {
      setResending(false);
      setNotice("A new code has been sent to your email. Demo code: 123456");
      setCode("");
      setCooldown(RESEND_SECONDS);
    }, 800);
  }

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-emerald/10 ring-1 ring-brand-gold/50">
          <ShieldCheck className="h-7 w-7 text-brand-emerald" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold leading-tight text-brand-deep sm:text-[28px]">
          Verify Your Email
        </h1>
        <p className="mt-2 text-brand-deep/70">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="mt-1 font-semibold text-brand-deep">{email}</p>
      </div>

      <form onSubmit={handleVerify} noValidate className="mt-6 flex flex-col gap-4">
        <OtpInput value={code} onChange={setCode} error={Boolean(error)} />

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 text-left"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
            <div>
              <p className="font-semibold text-red-700">
                Incorrect verification code.
              </p>
              <p className="mt-0.5 text-sm text-red-600">
                Please check your email and try again.
              </p>
            </div>
          </div>
        )}

        {!error && notice && (
          <div
            role="status"
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-center text-sm font-medium text-brand-emerald"
          >
            <MailCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{notice}</span>
          </div>
        )}

        <Button type="submit" fullWidth loading={verifying}>
          {verifying ? "Verifying..." : "Verify & Subscribe"}
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-1 border-t border-brand-deep/10 pt-5 text-center text-sm">
        <span className="text-brand-deep/60">Didn&apos;t receive the code?</span>
        {cooldown > 0 ? (
          <p className="mt-1 flex items-center gap-1.5 font-medium text-brand-deep/70">
            <Timer className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            Resend code in {cooldown}s
          </p>
        ) : (
          <Button
            variant="ghost"
            type="button"
            onClick={handleResend}
            loading={resending}
            className="mt-1"
          >
            {resending ? "Sending new code..." : "Resend Code"}
          </Button>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-brand-gold/50 bg-brand-gold-soft/25 p-4 text-center">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
          <Info className="h-3.5 w-3.5" aria-hidden="true" />
          Demo mode
        </p>
        <p className="mt-2 text-sm text-brand-deep/70">
          Use this code to complete verification:
        </p>
        <p className="mt-1 font-display text-2xl font-bold tracking-[0.35em] text-brand-deep">
          {DEMO_CODE}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 border-t border-brand-gold/30 pt-3 text-xs font-medium text-brand-deep/60">
          <button
            type="button"
            onClick={onExpired}
            className="rounded-full border border-brand-deep/15 px-3 py-1.5 transition-colors hover:border-brand-gold hover:text-brand-deep"
          >
            Simulate expired code
          </button>
          <button
            type="button"
            onClick={onAlreadySubscribed}
            className="rounded-full border border-brand-deep/15 px-3 py-1.5 transition-colors hover:border-brand-gold hover:text-brand-deep"
          >
            Simulate already subscribed
          </button>
        </div>
      </div>
    </div>
  );
}
