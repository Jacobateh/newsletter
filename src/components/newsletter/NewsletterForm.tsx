"use client";

import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { isValidEmail } from "@/lib/validation";

interface NewsletterFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onValidEmail: (email: string) => void;
}

export function NewsletterForm({
  email,
  onEmailChange,
  onValidEmail,
}: NewsletterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;

    const value = email.trim();
    if (!value) {
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onValidEmail(value);
    }, 900);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-emerald/10 ring-1 ring-brand-gold/50">
          <Mail className="h-7 w-7 text-brand-emerald" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold leading-tight text-brand-deep sm:text-[28px]">
          Join the Hausa Arabia Newsletter
        </h1>
        <p className="mt-2 max-w-sm text-brand-deep/70">
          Get a new Hausa–Arabic learning experience delivered straight to your
          inbox.
        </p>
      </div>

      <Field
        id="newsletter-email"
        label="Email address"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => {
          onEmailChange(e.target.value);
          if (error) setError(null);
        }}
        error={error}
      />

      <Button type="submit" fullWidth loading={loading}>
        {loading ? "Sending verification code..." : "Subscribe to Newsletter"}
      </Button>

      <p className="flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-brand-deep/55">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-brand-emerald"
          aria-hidden="true"
        />
        <span>
          By subscribing, you agree to receive Hausa Arabia learning content
          and product updates. You can unsubscribe at any time.
        </span>
      </p>
    </form>
  );
}
