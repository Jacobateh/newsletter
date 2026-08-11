"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

const LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export function OtpInput({
  value,
  onChange,
  error,
  disabled,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function handleChange(index: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) {
      onChange(value.slice(0, index) + value.slice(index + 1));
      return;
    }
    if (digits.length > 1) {
      const next = value.slice(0, index) + digits + value.slice(index + digits.length);
      onChange(next.slice(0, LENGTH));
      const focusIndex = Math.min(index + digits.length, LENGTH) - 1;
      refs.current[focusIndex]?.focus();
      return;
    }
    const next = value.slice(0, index) + digits + value.slice(index + 1);
    onChange(next.slice(0, LENGTH));
    if (index < LENGTH - 1) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handlePaste(
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) {
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/\D/g, "").slice(0, LENGTH);
    if (!digits.length) return;
    e.preventDefault();
    const next = value.slice(0, index) + digits + value.slice(index + digits.length);
    onChange(next.slice(0, LENGTH));
    refs.current[Math.min(index + digits.length, LENGTH) - 1]?.focus();
  }

  return (
    <div
      className="flex justify-center gap-1.5 sm:gap-2"
      role="group"
      aria-label="Six digit verification code"
    >
      {Array.from({ length: LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={LENGTH}
          value={value[i] ?? ""}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${LENGTH}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          className={cn(
            "h-12 w-10 rounded-xl border-2 bg-white text-center font-display text-lg font-semibold text-brand-deep shadow-sm transition-all focus:outline-none sm:h-14 sm:w-12 sm:text-2xl",
            error
              ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-300/50"
              : "border-brand-deep/15 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30",
          )}
        />
      ))}
    </div>
  );
}
