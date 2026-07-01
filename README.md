# Decode This

Paste a message that says one thing and means another (passive-aggressive,
over-polite, vague, loaded). Decode This strips the politeness, shows the
subtext, and hands back three replies: diplomatic, straight, unhinged.

A hackathon build and a portfolio piece. The joke and the utility are the
same thing.

## Stack

Vite, React, TypeScript, Tailwind v4. The Anthropic API is called through a
Vercel serverless function in `/api`, so the key never reaches the client.
No database, no auth, no server-side storage of messages: decode and
discard.

## Running locally

```bash
npm install
vercel dev
```

`vercel dev` is required, not `npm run dev`: the Vite dev server alone
doesn't run the `/api` serverless function. Add your key to a `.env` file
at the project root first (see `.env.example`):

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Project docs

- [`PRODUCT.md`](PRODUCT.md) — who this is for, the brand personality, the
  design principles.
- [`DESIGN.md`](DESIGN.md) — the locked visual system: colours, type,
  motion, elevation, do's and don'ts.
- `.claude/CLAUDE.md` — coding rules and project context for AI-assisted
  building.

## Status

Built in stages: scaffold, working loop, design direction, full styled
interface. Not yet deployed.
