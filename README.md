# Hausa Arabia — Newsletter Subscription Page

A premium, responsive newsletter subscription landing page for **Hausa Arabia**
(an Arabic · Hausa · English language-learning platform), built with **Next.js
(App Router)**, **React**, **TypeScript**, and **Tailwind CSS**.

It implements a secure two-stage signup flow:

```
Email entered
  ↓
6-digit verification code generated (hashed, 10-min expiry)
  ↓
Code emailed via Brevo transactional email
  ↓
User enters code
  ↓
Code verified (attempts + resend limits)
  ↓
Verified email added to the Brevo list
  ↓
Success message
```

The page is fully independent of the main Hausa Arabia app and can be deployed
standalone. It lives at **`/newsletter`** and works on any host
(e.g. `https://hausa-arabia.vercel.app/newsletter` today,
`https://hausa-arabia.com/newsletter` once you connect your domain).

---

## 1. Install dependencies

```bash
cd hausa-arabia-newsletter
npm install
```

Requires **Node.js 20+**.

## 2. Configure environment variables

Create a local env file from the template:

```bash
cp .env.example .env.local
```

Then fill in:

| Variable               | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `BREVO_API_KEY`        | Brevo API v3 key (server-side only).                                 |
| `BREVO_LIST_ID`        | Numeric ID of the newsletter list.                                   |
| `BREVO_SENDER_EMAIL`   | Verified sender address used for verification emails.                |
| `BREVO_SENDER_NAME`    | Sender display name (defaults to `Hausa Arabia`).                    |
| `NEXT_PUBLIC_MAIN_SITE_URL` | Public link used by the "Back to Hausa Arabia" button (not a secret). |

> **Security note:** Brevo credentials are only ever read in server-side code
> (`src/lib/brevo.ts` and the API routes under `src/app/api/newsletter/*`).
> They are never prefixed with `NEXT_PUBLIC_`, never appear in client
> components, and never get logged.

## 3. Create the Brevo list

1. Log in to [Brevo](https://app.brevo.com).
2. Go to **Contacts → Lists**.
3. Click **Create a list**, name it e.g. `Newsletter — Hausa Arabia`, and save.
4. Open the list — the **list ID** is the number in the URL
   (`/contacts/lists/<ID>`). Put it in `BREVO_LIST_ID`.

## 4. Obtain the Brevo API key

1. In Brevo go to **Settings → API keys** (or
   [app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)).
2. Click **Generate a new API key**.
3. Copy the **v3 API key** into `BREVO_API_KEY`.
4. Confirm the key has **Contacts** and **Transactional Email** permissions
   (the key you generate has full API access).

## 5. Configure the sender

1. Go to **Settings → Senders / IPs**.
2. Add and verify a sender address (e.g. `newsletter@hausa-arabia.com`).
3. Put it in `BREVO_SENDER_EMAIL`. This must be verified in Brevo or the
   verification emails will not be delivered.

## 6. Run the project locally

```bash
npm run dev
```

Open **http://localhost:3000/newsletter** (the root `/` redirects there).

**Logo:** the page loads `public/hausa-arabia-logo.png`. A clearly-marked
placeholder is included so the layout previews correctly — **replace it with
the official Hausa Arabia logo, keeping the exact filename** so the layout and
favicon keep working. Do not rename, crop, or recolour the official logo.

## 7. Test email verification

With the env variables set:

1. Open `/newsletter`, enter a real inbox address, and press
   **Subscribe to Newsletter**.
2. You should receive **“Verify your Hausa Arabia newsletter subscription”**
   with a 6-digit code.
3. Enter the code and press **Verify & Subscribe**.
4. Confirm the subscriber appears in the Brevo list.

Test the edge cases too: invalid/empty email, wrong code, expired code
(wait 10 minutes or use a dev breakpoint), the **Resend code in 60s** cooldown,
and re-subscribing an already-subscribed address.

> **Note for development:** verification codes are stored **in memory**
> (`src/lib/store.ts`). Local dev is fine, but on Vercel each serverless
> instance has its own memory, so an in-flight verification may hit a
> different instance than the one that issued it. For reliable production use,
> connect the store to a shared database (see “Connect Supabase later” below).
> In practice the store is best-effort: the cooldown/attempt limits live there
> too, so sharing a store also tightens those safeguards.

## 8. Deploy to Vercel

1. Push the project to a GitHub (or GitLab/Bitbucket) repository.
2. In Vercel choose **New Project** and import the repo.
3. Vercel auto-detects Next.js — no framework settings are required.
4. Under **Settings → Environment Variables**, add the same variables as in
   `.env.example`:
   `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_SENDER_EMAIL`,
   `BREVO_SENDER_NAME`, `NEXT_PUBLIC_MAIN_SITE_URL`.
5. Deploy. Your page will be live at
   `https://<your-project>.vercel.app/newsletter`.

## 9. Connect your own domain later

1. In Vercel, open your project → **Settings → Domains**.
2. Add `hausa-arabia.com` (and `www.hausa-arabia.com`).
3. Follow Vercel's DNS instructions at your domain registrar (add the
   `A`/`CNAME` records Vercel gives you, or point the domain to Vercel's
   nameservers).
4. Once DNS propagates, `/newsletter` works at
   `https://hausa-arabia.com/newsletter` with **no code changes** — the app
   never hard-codes a Vercel or custom domain.

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                              # Redirects / → /newsletter
│   ├── newsletter/page.tsx                   # Landing page (server component)
│   ├── layout.tsx                            # Fonts + global metadata
│   └── api/newsletter/
│       ├── request-code/route.ts             # Validate + email + issue code
│       ├── resend-code/route.ts              # Resend with 60s cooldown
│       └── verify-code/route.ts              # Verify + add to Brevo list
├── components/
│   ├── brand/                                # Logo, decorative ornaments
│   ├── ui/                                   # Button, Field (accessible)
│   └── newsletter/                           # Stage components + footer
└── lib/
    ├── validation.ts                         # Email/code sanitization + validation
    ├── verification.ts                       # Crypto-secure code gen + hashing
    ├── store.ts                              # Verification store (in-memory)
    ├── rate-limit.ts                         # Per-IP abuse protection
    ├── brevo.ts                              # SERVER-ONLY Brevo API calls
    ├── email.ts                              # Verification email HTML/text
    ├── api.ts                                # Client fetch helpers (browser)
    ├── http.ts                               # JSON response helper
    └── cn.ts                                 # Class name join helper
```

### Security highlights

- Codes are generated with `crypto.randomInt` and stored as **scrypt hashes**
  with a per-code salt — never in plain text and never logged.
- Codes **expire after 10 minutes**; wrong-code **attempts are capped**;
  **resends are limited** to one per 60 seconds plus a per-IP rate limit on
  every endpoint.
- All input is sanitized/validated on the server.
- Emails are only added to the Brevo list **after successful verification**.
- The Brevo API key is only read server-side.
- Friendly error messages are returned to the user; technical details are
  logged server-side only.

### Connect Supabase later

To switch the verification store to a persistent database:

1. Create a Supabase table, e.g. `newsletter_verifications` with columns:
   `email`, `code_hash`, `salt`, `expires_at`, `attempts`,
   `last_code_sent_at`, `verified`.
2. Implement the `VerificationStore` interface in `src/lib/store.ts` using the
   Supabase client (same shape as the current in-memory store).
3. Swap the exported instance in `src/lib/store.ts`. No other code changes
   needed — the API routes already talk to the store through that interface.

Brevo remains the primary subscriber database; Supabase is optional and only
needed for reliable persistent code storage across serverless instances.
