# Decode This — Security Audit

Date: 2026-07-01 · Pre-launch, before first Vercel production deploy · Auditor: site-security agent

No previous report exists for this project. This is the first audit.

## Verdict

**Safe with named fixes.** No secret has ever reached git or the client bundle, the CSP is accurate and tight, and source maps are correctly off. Two should-fix items need attention before this goes properly public: the endpoint has no cost/abuse control on a paid AI call, and the working `.env` value has already been exposed to a chat session transcript on disk (not git — a different surface). Neither blocks setting the Vercel env var and deploying, but both should be actioned this week.

---

## Findings, severity order

### Should fix — no cost or abuse control on a paid, unauthenticated AI endpoint

**Location:** `api/decode.ts:80-105`, `src/App.tsx:32-36`

The endpoint takes a POST with no auth, no rate limiting, and no maximum length on `message`. `.gitignore` and CSP are sound, but CORS is not the control that matters here: CORS only restricts what a *browser* can read cross-origin, it does nothing to stop a direct script or curl call hitting the endpoint. There is no `Access-Control-Allow-Origin` header configured anywhere (confirmed absent from `vercel.json` and `api/decode.ts`), which is the correct default for a same-origin-only app, but it means direct non-browser calls are the real exposure, not browser-based ones.

Each call is a real, billed Anthropic API request. On a failed JSON-shape parse the code also retries once automatically (`api/decode.ts:92-103`), doubling the cost of any request that reliably fails to parse. There is no cap on `message` length beyond Vercel's default request body ceiling, so a long paste is a bigger call than intended, and a scripted flood of requests has no throttle at all.

**Fix:** add a maximum `message` length check server-side (a decode tool has no legitimate reason to accept more than a few thousand characters) before this goes out to any audience wider than a private demo. Add basic rate limiting — Vercel's Attack Challenge Mode/Firewall on the project, or a lightweight IP-based limiter (Upstash Ratelimit is the common pairing with Vercel functions) — before sharing the URL publicly (Product Hunt, Hacker News, a viral share). This is not a blocker for the first production deploy to a small/private audience, but it is a blocker before wide public promotion.

**Residual risk if left as is:** cost exposure is bounded only by the Anthropic account spend cap (see manual checklist), which will stop the bleeding but not before real spend accrues, and not before a flood of requests degrades the demo for genuine users.

### Should fix — the live API key has already been exposed outside git, in a local chat transcript

**Location:** local Claude Code session transcripts under `~/.claude/projects/-Users-jasminaziz-Developer/` (JSONL session files) — not reproduced here

You confirmed the key was pasted directly into a chat session and then written to the local `.env`. Git history is clean (confirmed below) but that is not the only place a pasted secret can persist. The literal key value is present in at least one local Claude Code session transcript file on this machine. This is not a public exposure — it is local disk only, not committed, not pushed — but it means the key has already left the narrow "lives only in `.env` and Vercel" boundary the checklist asks for, on day one.

**Fix:** this is a judgement call for you, not an automatic rotation — but given the key has already touched a second location before its first production deploy, treat it as having a shorter trusted lifespan than a key that has only ever lived in `.env` and Vercel. Consider rotating in `console.anthropic.com` once the production deploy is confirmed working, and paste any future keys into Vercel's environment variable UI directly rather than into a chat session.

### Accepted trade-off — none required

No `VITE_` variables exist anywhere in `src/`, `index.html`, or `vite.config.ts` (confirmed by grep). The Anthropic key is read once, server-side, in `api/decode.ts:54`, via `process.env.ANTHROPIC_API_KEY`, and is never returned in any response body, logged to the client, or referenced in any file under `src/`. There is nothing here that needs a trade-off statement — the architecture (key server-side only, called via a serverless function) is exactly what avoids the trade-off The Edit AI has to accept for its Sheets key. No `VITE_` exposure to weigh at all.

### Confirmed clean — secrets and git history

- Git history for this repo is a single commit (`4560731`, "Scaffold: Vite + React + TypeScript + Tailwind v4, project files"). `git ls-tree -r` on that commit and `git log --all --diff-filter=A --name-only` both confirm no `.env` file has ever been added to the tree. A mention of "`.env` gitignored before first commit" exists only in the commit message text, not as a committed file.
- Searched every revision in the repo (`git rev-list --all` combined with `git grep`) for `AIzaSy`, `sk-ant`, `eyJhbGci`, `supabase.co`, and any `ANTHROPIC_API_KEY=<value>` pattern. Zero matches in any commit.
- The working tree `.env` (present now, containing the real key) is correctly matched by `.gitignore` (`git check-ignore -v` confirms line 2, `.env`) and shows as untracked, never staged. `.env.local` is also covered, by the `*.local` rule at line 21.
- `.env.example` (untracked, will be added on next commit) contains only `ANTHROPIC_API_KEY=` with no value. Clean.
- `git status --short` currently shows the whole feature build (`api/`, `vercel.json`, `src/components/`, `DESIGN.md`, `PRODUCT.md`, `.env.example`) as untracked/uncommitted, meaning none of it has been through a commit yet. Before that next commit: re-run `git status --short` and confirm `.env` does not appear in the list. It correctly does not appear now.

### Confirmed clean — api/decode.ts key handling

- `api/decode.ts:54` — key read from `process.env.ANTHROPIC_API_KEY` only, never a literal, never logged.
- No route returns the key, an error containing the key, or any Anthropic SDK internals to the client. Both the success path (`res.status(200).json(result)`) and the failure path (`res.status(502).json({ error: "Couldn't decode that one..." })`) return only the shaped `DecodeResult` or a fixed friendly string. The `firstError`/`secondError` detail goes to `console.error` (server-side log only, `api/decode.ts:101`), never to the response body.
- Method is restricted to `POST` (`api/decode.ts:81-84`); `req.method !== 'POST'` returns 405 before touching the key or the Anthropic client.
- `message` is validated as a non-empty string before use (`api/decode.ts:86-90`). `context` is not type- or length-validated server-side — the UI only ever sends one of four fixed enum values or `null` (`src/components/ContextChips.tsx`), so in normal use this is a closed set, but a direct API call could pass an arbitrary or non-string `context`. This is a minor defensive gap, not an injection risk: `context` and `message` are interpolated into a single plain-text string sent as the `content` of a chat message to the Anthropic API (`api/decode.ts:56-59`), not into HTML, SQL, or a shell command, and the client-side request body is built with `JSON.stringify` (`src/App.tsx:35`), not manual string concatenation, so there is no JSON-injection path. Worth tightening (`typeof context === 'string'` check, reasonable max length) as a hygiene fix, not urgent.

### Confirmed clean — vercel.json headers

All five headers from your instruction are present at `vercel.json:9-13`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and a `Content-Security-Policy`.

Checked the CSP against every third-party origin the app actually loads (from `index.html:10-18`):

- `style-src` includes `fonts.googleapis.com` and `api.fontshare.com` — matches the two font stylesheet `<link>` tags.
- `font-src` includes `fonts.gstatic.com`, `api.fontshare.com`, and `cdn.fontshare.com` — the last one is the specific trap flagged in a previous project's lessons (Fontshare serves font files from `cdn.fontshare.com`, not just `api.fontshare.com`); it is already present here, so that lesson has been applied correctly ahead of time.
- `connect-src 'self'` — correct, the only client-side API call is the same-origin `fetch('/api/decode')` in `src/App.tsx:32`. No external `connect-src` entries are needed and none are present.
- `script-src 'self'` with no `'unsafe-inline'` — correct, `index.html` has no inline `<script>` blocks, only the module entry point.
- `style-src` carries `'unsafe-inline'` — justified: `src/components/ReplyCard.tsx` and `SubtextMeter.tsx`/`App.tsx` use inline `style={{ animationDelay: ... }}` attributes, which need it.
- `img-src 'self' data:` — correct, no external images.
- `frame-ancestors 'none'` — belt-and-braces alongside `X-Frame-Options: DENY`.

No origin appears in the CSP that isn't actually used, and no origin used in the code is missing from the CSP. This is a clean, minimal allow-list.

### Confirmed clean — production bundle

`vite.config.ts` has no `build.sourcemap` entry. Vite's default for this key is `false` in a production build, so no source maps ship. Nothing further needed.

---

## Manual checklist — cannot verify from the filesystem

- **Anthropic spend cap.** Confirm a monthly spend limit is set on the account this key belongs to, and auto-reload is off, in `console.anthropic.com` → Billing. Given the endpoint currently has no rate limiting (see should-fix above), this cap is the only real backstop against a cost spike between now and adding a rate limiter.
- **Vercel environment variable.** When you add `ANTHROPIC_API_KEY` in Vercel: Project → Settings → Environment Variables, confirm it is scoped to Production (and Preview if you want preview deploys to work) and is a plain "Environment Variable" not accidentally marked for client exposure. After adding it, trigger a fresh deploy with the build cache unticked so the value actually takes effect.
- **Kill-switch.** If this key is compromised: `console.anthropic.com` → API Keys → Revoke. Between revocation and setting a new key in Vercel and redeploying, the whole app breaks (every decode request 502s) — there is no fallback path, by design, since there's no other data source. Document this one-line kill-switch note somewhere findable (this report, or the project `.claude/CLAUDE.md`) so it isn't reconstructed under pressure.
- **Vercel account/token.** If the Vercel project itself is compromised: Account Settings → Tokens → revoke.
- **Local session transcript containing the key.** The transcript file identified above under `~/.claude/projects/` is local-only and not something this audit can or should delete — name it for your own awareness, and factor it into the rotation judgement call above.
- **Rate limiting / abuse protection.** Not yet implemented (see should-fix above). No exact console path applies until you pick an approach; likely candidates are Vercel's built-in Firewall/Attack Challenge Mode (Project → Settings → Firewall) or adding Upstash Ratelimit as a dependency.
- **Domain and sharing.** Not applicable here — no Google Sheets, no Supabase, no Make.com in this build (confirmed against `.claude/CLAUDE.md`: "No database in v1... No server-side storage of messages"). Nothing to check on that front.

---

## Not applicable to this build

Per `.claude/CLAUDE.md`, this project has no auth, no database, no Google Sheets, no Supabase, and no Make.com automation. The checklist sections on RLS, subscriber table policies, Sheet sharing settings, and Make.com error handlers do not apply here — there is no data layer to audit beyond the stateless call to Anthropic. This absence is itself confirmed clean: grep across `src/` found no Supabase client, no Sheets fetch, no Make.com webhook URL.
