/**
 * Brevo (Sendinblue) integration.
 *
 * IMPORTANT: This module is SERVER-SIDE ONLY. It is never imported by any
 * React client component, so the Brevo API key is never exposed to the
 * browser.
 *
 * Required environment variables (see `.env.example`):
 *   BREVO_API_KEY=        -> Brevo API v3 key (app.brevo.com > Settings > API keys)
 *   BREVO_LIST_ID=        -> Numeric ID of the newsletter list
 *   BREVO_SENDER_EMAIL=   -> Verified sender address in Brevo
 *   BREVO_SENDER_NAME=    -> "Hausa Arabia" (optional, has a default)
 */
import {
  buildVerificationEmailText,
  buildVerificationEmailHtml,
  emailSubject,
} from "./email";

const BREVO_API_BASE = "https://api.brevo.com/v3";

export interface BrevoConfig {
  apiKey: string;
  listId: number;
  senderEmail: string;
  senderName: string;
}

export function getBrevoConfig(): BrevoConfig | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const listIdRaw = process.env.BREVO_LIST_ID?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const senderName =
    process.env.BREVO_SENDER_NAME?.trim() || "Hausa Arabia";

  if (!apiKey || !listIdRaw || !senderEmail) return null;

  const listId = Number(listIdRaw);
  if (!Number.isInteger(listId) || listId <= 0) return null;

  return { apiKey, listId, senderEmail, senderName };
}

export function isBrevoConfigured(): boolean {
  return getBrevoConfig() !== null;
}

async function brevoRequest(
  config: BrevoConfig,
  method: string,
  path: string,
  body?: unknown,
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const response = await fetch(`${BREVO_API_BASE}${path}`, {
    method,
    headers: {
      "api-key": config.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let data: unknown = null;
  try {
    data = response.status === 204 ? null : await response.json();
  } catch {
    data = null;
  }

  return { ok: response.ok, status: response.status, data };
}

export interface ContactLookup {
  exists: boolean;
  inTargetList: boolean;
}

export async function lookupContact(
  email: string,
): Promise<ContactLookup | null> {
  const config = getBrevoConfig();
  if (!config) return null;

  const result = await brevoRequest(
    config,
    "GET",
    `/contacts/${encodeURIComponent(email)}`,
  );

  if (!result.ok) {
    if (result.status === 404) {
      return { exists: false, inTargetList: false };
    }
    throw new Error(`Brevo contact lookup failed (${result.status})`);
  }

  const data = result.data as { listIds?: number[] };
  return {
    exists: true,
    inTargetList:
      Array.isArray(data.listIds) && data.listIds.includes(config.listId),
  };
}

export async function addContactToList(email: string): Promise<void> {
  const config = getBrevoConfig();
  if (!config) throw new Error("Brevo is not configured");

  const lookup = await lookupContact(email).catch(() => null);

  if (lookup?.exists) {
    const result = await brevoRequest(
      config,
      "PUT",
      `/contacts/${encodeURIComponent(email)}`,
      { email, listIds: [config.listId] },
    );
    if (!result.ok) {
      throw new Error(`Brevo update contact failed (${result.status})`);
    }
    return;
  }

  const result = await brevoRequest(config, "POST", "/contacts", {
    email,
    listIds: [config.listId],
    updateEnabled: true,
  });
  if (!result.ok) {
    throw new Error(`Brevo create contact failed (${result.status})`);
  }
}

export async function sendVerificationEmail(
  toEmail: string,
  code: string,
): Promise<void> {
  const config = getBrevoConfig();
  if (!config) throw new Error("Brevo is not configured");

  const result = await brevoRequest(config, "POST", "/smtp/email", {
    sender: { email: config.senderEmail, name: config.senderName },
    to: [{ email: toEmail }],
    subject: emailSubject,
    htmlContent: buildVerificationEmailHtml(code),
    textContent: buildVerificationEmailText(code),
  });

  if (!result.ok) {
    throw new Error(`Brevo email send failed (${result.status})`);
  }
}
