export type ApiStatus =
  | "code_sent"
  | "already_subscribed"
  | "invalid_email"
  | "too_many"
  | "server_error"
  | "incorrect"
  | "expired"
  | "max_attempts"
  | "success";

export interface ApiResponse {
  status: ApiStatus;
  retryAfter?: number;
}

async function postJson(url: string, body: unknown): Promise<ApiResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as ApiResponse | null;
  if (!data || typeof data.status !== "string") {
    return { status: "server_error" };
  }
  return data;
}

export function requestVerificationCode(email: string): Promise<ApiResponse> {
  return postJson("/api/newsletter/request-code", { email });
}

export function resendVerificationCode(email: string): Promise<ApiResponse> {
  return postJson("/api/newsletter/resend-code", { email });
}

export function verifyEmailCode(
  email: string,
  code: string,
): Promise<ApiResponse> {
  return postJson("/api/newsletter/verify-code", { email, code });
}
