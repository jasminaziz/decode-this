# Decode This

## What this is

Decode This takes a message that says one thing and means another
(passive-aggressive, over-polite, vague, loaded) and strips the
politeness to show the subtext, then hands the user replies.

A hackathon build and a portfolio piece. The joke and the utility are
the same thing. Audience: anyone who has stared at "sure, whatever
works for you" and known it meant the opposite.

## Stack

- Vite, React, TypeScript, Tailwind (v4, via the `@tailwindcss/vite`
  plugin; no tailwind.config file, theme lives in CSS).
- Anthropic API called through a Vercel serverless function in `/api`.
  The key never reaches the client.
- API key in the `ANTHROPIC_API_KEY` environment variable. Never
  hardcoded, never committed. Local value in `.env` (gitignored),
  production value in Vercel project settings.
- Deploy target: Vercel.
- No database in v1. No server-side storage of messages: decode and
  discard, and the interface says so.
- Fonts from Fontshare or Google Fonts, chosen by the impeccable
  design direction. If Fontshare: `cdn.fontshare.com` must be in the
  CSP `font-src` (known trap from a previous build).

## Runtime model

Claude Sonnet 4.6 (`claude-sonnet-4-6`), pending Jasmin's
confirmation. Any change to the model is a flagged decision, not a
silent swap.

## Coding rules

- Never commit secrets. The key lives in an env var and `.env` is
  gitignored. Check staged files before every commit.
- Never modify files outside the current task scope.
- One feature at a time, verified before the next.
- Flag any decision point before making a silent choice, especially
  the runtime model and JSON parsing behaviour.
- UK English in all copy and comments. No em dashes.
- Explain what is about to be done before doing it. No silent building.
- Keep it maintainable solo: no abstractions or extra files beyond
  what the task needs.

## What not to build

- No login, no auth, no accounts. Instant use.
- No server-side storage of messages in v1.
- No gendered imagery. No emoji in the interface.

## Design

- Design direction is owned by the impeccable skill, set from scratch
  at Step 2 of the build. Once locked it lives in `.impeccable.md` at
  the project root and is the single source of design truth.
- Decode This has its own identity. None of Jasmin's existing brand
  colours, fonts, or house style.
- Mobile-first. This gets demoed on a phone in a room.
- The studio bar: it must look like a design studio built it, not
  like an AI assembled it. If it drifts generic, stop and fix it.

## Git

- This is its own repository, nested inside `~/Developer` (which is
  also a repo). From `~/Developer`, never `git add -A`. Inside this
  repo, stage specific files by path.

## Session hygiene

- Read `tasks/lessons.md` at session start if it has content.
- `SCRATCHPAD.md` holds working notes for the current session only.
- Run `/wrap` at the end of every session.
