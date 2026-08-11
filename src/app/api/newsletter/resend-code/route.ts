import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/http";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isValidEmail, sanitizeEmail } from "@/lib/validation";
import {
  CODE_TTL_MS,
  RESEND_COOLDOWN_MS,
  generateVerificationCode,
  hashVerificationCode,
} from "@/lib/verification";
import { verificationStore } from "@/lib/store";
import { isBrevoConfigured, sendVerificationEmail } from "@/lib/brevo";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const ipLimit = rateLimit(`resend-code:${ip}`, 5, 15 * 60 * 1000);
  if (!ipLimit.ok) {
    return apiResponse(
      { status: "too_many", retryAfter: ipLimit.retryAfterSeconds },
      429,
    );
  }

  let email: string;
  try {
    const body = await request.json();
    email = sanitizeEmail(body?.email);
  } catch {
    return apiResponse({ status: "invalid_email" }, 400);
  }

  if (!isValidEmail(email)) {
    return apiResponse({ status: "invalid_email" }, 400);
  }

  if (!isBrevoConfigured()) {
    console.error(
      "[newsletter] Brevo is not configured. Set BREVO_API_KEY, BREVO_LIST_ID and BREVO_SENDER_EMAIL.",
    );
    return apiResponse({ status: "server_error" }, 503);
  }

  const record = verificationStore.get(email);
  const now = Date.now();

  const cooldownMs = record
    ? RESEND_COOLDOWN_MS - (now - record.lastCodeSentAt)
    : 0;

  if (cooldownMs > 0) {
    return apiResponse(
      { status: "too_many", retryAfter: Math.ceil(cooldownMs / 1000) },
      429,
    );
  }

  const code = generateVerificationCode();
  const { hash, salt } = hashVerificationCode(code);

  verificationStore.set({
    email,
    codeHash: hash,
    salt,
    createdAt: now,
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    lastCodeSentAt: now,
    verified: false,
  });

  try {
    await sendVerificationEmail(email, code);
    return apiResponse({ status: "code_sent" });
  } catch (error) {
    verificationStore.delete(email);
    console.error("[newsletter] Failed to resend verification email", error);
    return apiResponse({ status: "server_error" }, 502);
  }
}
