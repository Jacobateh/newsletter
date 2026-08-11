import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/http";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isValidEmail, sanitizeEmail } from "@/lib/validation";
import {
  CODE_TTL_MS,
  generateVerificationCode,
  hashVerificationCode,
} from "@/lib/verification";
import { verificationStore } from "@/lib/store";
import {
  isBrevoConfigured,
  lookupContact,
  sendVerificationEmail,
} from "@/lib/brevo";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const ipLimit = rateLimit(`request-code:${ip}`, 5, 15 * 60 * 1000);
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

  if (!email) {
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

  try {
    const contact = await lookupContact(email);
    if (contact?.inTargetList) {
      return apiResponse({ status: "already_subscribed" });
    }
  } catch (error) {
    // Lookup is best-effort; sending the email below will still surface real failures.
    console.error("[newsletter] Contact lookup failed", error);
  }

  const code = generateVerificationCode();
  const { hash, salt } = hashVerificationCode(code);
  const now = Date.now();

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
    // Never log the code itself.
    console.error("[newsletter] Failed to send verification email", error);
    return apiResponse({ status: "server_error" }, 502);
  }
}
