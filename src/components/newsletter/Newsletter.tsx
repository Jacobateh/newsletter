"use client";

import { useState } from "react";
import { BookOpen, HeartHandshake, Sprout } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { StarOrnament } from "@/components/brand/Ornament";
import { NewsletterForm } from "./NewsletterForm";
import { VerificationForm } from "./VerificationForm";
import { SuccessState } from "./SuccessState";
import { ErrorState } from "./ErrorState";
import { WhyJoinSection } from "./WhyJoinSection";
import { NewsletterFooter } from "./NewsletterFooter";

type Stage = "email" | "verify" | "expired" | "already" | "success";

export function Newsletter() {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function handleResendNewCode() {
    setNotice("A new code has been sent to your email. Demo code: 123456");
    setStage("verify");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 sm:px-8">
        <StarOrnament className="pointer-events-none absolute -left-12 top-24 hidden text-brand-gold/20 lg:block" />
        <StarOrnament className="pointer-events-none absolute -right-10 top-52 hidden h-20 w-20 text-brand-emerald/15 lg:block" />
        <StarOrnament className="pointer-events-none absolute left-8 top-[58%] hidden h-16 w-16 text-brand-gold/15 xl:block" />
        <StarOrnament className="pointer-events-none absolute bottom-56 right-12 hidden h-24 w-24 text-brand-emerald/10 xl:block" />

        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center py-12 sm:py-16">
          <header className="animate-fade-up flex flex-col items-center text-center">
            <Logo />
            <p className="mt-7 font-display text-2xl font-semibold tracking-tight text-brand-deep sm:text-3xl">
              Learn. Connect. Communicate.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-brand-deep/70 sm:text-base">
              Join the Hausa Arabia community and receive useful Hausa and
              Arabic lessons, vocabulary, pronunciation tips, learning
              challenges, and important updates directly in your inbox.
            </p>
            <span
              aria-hidden="true"
              className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-brand-gold to-transparent"
            />
          </header>

          <main className="mt-10 w-full">
            <section
              aria-label="Newsletter subscription"
              className="relative overflow-hidden rounded-3xl border border-brand-gold/30 bg-white/95 p-6 shadow-2xl shadow-brand-deep/10 backdrop-blur sm:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-gold via-brand-emerald to-brand-gold"
              />
              <div key={stage} className="animate-fade-up pt-1">
                {stage === "email" && (
                  <NewsletterForm
                    email={email}
                    onEmailChange={setEmail}
                    onValidEmail={(value) => {
                      setEmail(value);
                      setStage("verify");
                    }}
                  />
                )}
                {stage === "verify" && (
                  <VerificationForm
                    email={email}
                    initialNotice={notice}
                    onVerified={() => setStage("success")}
                    onExpired={() => setStage("expired")}
                    onAlreadySubscribed={() => setStage("already")}
                  />
                )}
                {stage === "expired" && (
                  <ErrorState
                    type="expired"
                    onResendNewCode={handleResendNewCode}
                  />
                )}
                {stage === "already" && (
                  <ErrorState type="already-subscribed" />
                )}
                {stage === "success" && <SuccessState />}
              </div>
            </section>
          </main>
        </div>

        <WhyJoinSection />

        <div className="relative z-10 mx-auto mt-14 w-full max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-r from-brand-deep via-brand-green to-brand-deep px-6 py-10 text-center sm:mt-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold-light">
            Hausa Arabia community
          </p>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-brand-gold" aria-hidden="true" />
              Learn
            </span>
            <span className="text-brand-gold" aria-hidden="true">
              •
            </span>
            <span className="inline-flex items-center gap-2">
              <HeartHandshake
                className="h-6 w-6 text-brand-gold"
                aria-hidden="true"
              />
              Connect
            </span>
            <span className="text-brand-gold" aria-hidden="true">
              •
            </span>
            <span className="inline-flex items-center gap-2">
              <Sprout className="h-6 w-6 text-brand-gold" aria-hidden="true" />
              Grow
            </span>
          </p>
        </div>
      </div>

      <NewsletterFooter />
    </div>
  );
}
