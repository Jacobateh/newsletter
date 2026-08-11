export interface VerificationRecord {
  email: string;
  codeHash: string;
  salt: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  lastCodeSentAt: number;
  verified: boolean;
}

export interface VerificationStore {
  set(record: VerificationRecord): void;
  get(email: string): VerificationRecord | undefined;
  update(email: string, patch: Partial<VerificationRecord>): void;
  delete(email: string): void;
}

/**
 * In-memory verification-code store.
 *
 * This is used for development and as the default. It is NOT shared across
 * serverless instances, so for production with multiple Vercel functions you
 * should swap this out for a shared store.
 *
 * To switch to Supabase later, implement the same `VerificationStore`
 * interface backed by a Supabase table (e.g. `newsletter_verifications`) with
 * columns: email, code_hash, salt, expires_at, attempts, last_code_sent_at,
 * verified. Only the hashed code should ever be persisted.
 */
class MemoryVerificationStore implements VerificationStore {
  private records = new Map<string, VerificationRecord>();

  set(record: VerificationRecord): void {
    this.prune();
    this.records.set(record.email, record);
  }

  get(email: string): VerificationRecord | undefined {
    const record = this.records.get(email);
    if (record && record.expiresAt < Date.now()) {
      this.records.delete(email);
      return undefined;
    }
    return record;
  }

  update(email: string, patch: Partial<VerificationRecord>): void {
    const record = this.records.get(email);
    if (record) this.records.set(email, { ...record, ...patch });
  }

  delete(email: string): void {
    this.records.delete(email);
  }

  private prune(): void {
    const now = Date.now();
    for (const [email, record] of this.records) {
      if (record.expiresAt < now) this.records.delete(email);
    }
  }
}

export const verificationStore: VerificationStore = new MemoryVerificationStore();
