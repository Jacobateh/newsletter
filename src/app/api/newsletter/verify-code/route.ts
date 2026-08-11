import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/http";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  isValidCode,
  isValidEmail,
  sanitizeCode,
  sanitizeEmail,
} from "@/lib/validation";
import {
  MAX_CODE_ATTEMPTS,
  verifyHashedCode,
} from "@/lib/verification";
import { verificationStore } from "@/lib/store";
import { isBrevoConfigured, addContactToList } from "@/lib/brevo";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const ipLimit = rateLimit(`verify-code:${ip}`, 20, 15 * 60 * 1000);
  if (!ipLimit.ok) {
    return apiResponse(
      { status: "too_many", retryAfter: ipLimit.retryAfterSeconds },
      429,
    );
  }

  let email: string;
  let code: string;
  try {
    const body = await request.json();
    email = sanitizeEmail(body?.email);
    code = sanitizeCode(body?.code);
  } catch {
    return apiResponse({ status: "server_error" }, 400);
  }

  if (!isValidEmail(email) || !isValidCode(code)) {
    return apiResponse({ status: "server_error" }, 400);
  }

  const record = verificationStore.get(email);
  if (!record) {
    return apiResponse({ status: "expired" });
  }

  if (record.expiresAt < Date.now()) {
    verificationStore.delete(email);
    return apiResponse({ status: "expired" });
  }

  if (record.attempts >= MAX_CODE_ATTEMPTS) {
    verificationStore.delete(email);
    return apiResponse({ status: "max_attempts" });
  }

  if (!verifyHashedCode(code, record.salt, record.codeHash)) {
    verificationStore.update(email, { attempts: record.attempts + 1 });
    return apiResponse({ status: "incorrect" });
  }

  if (!isBrevoConfigured()) {
    console.error(
      "[newsletter] Brevo is not configured. Set BREVO_API_KEY, BREVO_LIST_ID and BREVO_SENDER_EMAIL.",
    );
    return apiResponse({ status: "server_error" }, 503);
  }

  try {
    await addContactToList(email);
    verificationStore.delete(email);
    return apiResponse({ status: "success" });
  } catch (error) {
    // Keep the record so the user can retry verification once Brevo recovers.
    verificationStore.update(email, { verified: true });
    console.error(
      "[newsletter] Failed to add verified contact to Brevo list",
      error,
    );
    return apiResponse({ status: "server_error" }, 502);
  }
}
