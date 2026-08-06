<!-- BEGIN:nextjs-agent-rules -->

Create or update `AGENTS.md` for this repository.

The goal is a compact instruction file that helps future OpenCode sessions avoid mistakes and ramp up quickly. Every line should answer: "Would an agent likely miss this without help?" If not, leave it out.

User-provided focus or constraints (honor these):


## How to investigate

Read the highest-value sources first:
- `README*`, root manifests, workspace config, lockfiles
- build, test, lint, formatter, typecheck, and codegen config
- CI workflows and pre-commit / task runner config
- existing instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`)
- repo-local OpenCode config such as `opencode.json`

If architecture is still unclear after reading config and docs, inspect a small number of representative code files to find the real entrypoints, package boundaries, and execution flow. Prefer reading the files that explain how the system is wired together over random leaf files.

Prefer executable sources of truth over prose. If docs conflict with config or scripts, trust the executable source and only keep what you can verify.

## What to extract

Look for the highest-signal facts for an agent working in this repo:
- exact developer commands, especially non-obvious ones
- how to run a single test, a single package, or a focused verification step
- required command order when it matters, such as `lint -> typecheck -> test`
- monorepo or multi-package boundaries, ownership of major directories, and the real app/library entrypoints
- framework or toolchain quirks: generated code, migrations, codegen, build artifacts, special env loading, dev servers, infra deploy flow
- repo-specific style or workflow conventions that differ from defaults
- testing quirks: fixtures, integration test prerequisites, snapshot workflows, required services, flaky or expensive suites
- important constraints from existing instruction files worth preserving

Good `AGENTS.md` content is usually hard-earned context that took reading multiple files to infer.

## Questions

Only ask the user questions if the repo cannot answer something important. Use the `question` tool for one short batch at most.

Good questions:
- undocumented team conventions
- branch / PR / release expectations
- missing setup or test prerequisites that are known but not written down

Do not ask about anything the repo already makes clear.

## Writing rules

Include only high-signal, repo-specific guidance such as:
- exact commands and shortcuts the agent would otherwise guess wrong
- architecture notes that are not obvious from filenames
- conventions that differ from language or framework defaults
- setup requirements, environment quirks, and operational gotchas
- references to existing instruction sources that matter

Exclude:
- generic software advice
- long tutorials or exhaustive file trees
- obvious language conventions
- speculative claims or anything you could not verify
- content better stored in another file referenced via `opencode.json` `instructions`

When in doubt, omit.

Prefer short sections and bullets. If the repo is simple, keep the file simple. If the repo is large, summarize the few structural facts that actually change how an agent should work.

If `AGENTS.md` already exists at `/`, improve it in place rather than rewriting blindly. Preserve verified useful guidance, delete fluff or stale claims, and reconcile it with the current codebase.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Wordle Game - Agent Instructions

## Quick Commands

- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Start production:** `npm run start`
- **Lint:** `npm run lint`

## Project Structure

- **Framework:** Next.js 16.3.0 with App Router (`src/app/`)
- **Styling:** Tailwind CSS 4 (PostCSS plugin)
- **Language:** TypeScript 5
- **React:** 19.2.8

## Wordle Game Architecture

- **Game logic:** Create `src/lib/wordle.ts` for core game state and validation
- **Components:** Place in `src/components/` (create directory)
  - `Board.tsx` - Game grid display
  - `Keyboard.tsx` - On-screen keyboard
  - `Tile.tsx` - Individual letter tiles
- **Word list:** Add `public/words.txt` with valid 5-letter words
- **State management:** Use React `useState`/`useReducer` in `src/app/page.tsx`

## Development Workflow

1. Run `npm run dev` to start development server
2. Access at `http://localhost:3000`
3. Edit `src/app/page.tsx` for main game page
4. Add components in `src/components/`
5. Run `npm run lint` before committing

## Conventions

- Use TypeScript for all new files
- Follow existing code style in `src/app/layout.tsx`
- Tailwind classes for styling (no CSS modules)
- Client components: add `"use client"` directive at top


# AGENTS.md

# Wordle Clone - AI Development Guide

## Project Overview

This project is a modern Wordle-inspired game built with:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Authentication
- Persistent scoreboard
- Responsive UI
- Clean architecture
- Production-quality code

The goal is to build maintainable, scalable software rather than simply making something that works.

---

# Tech Stack

Framework:
- Next.js (latest App Router)

Language:
- TypeScript (strict mode)

Styling:
- TailwindCSS

Icons:
- lucide-react

State:
- React hooks
- Context only when necessary

Database:
- PostgreSQL (preferred)
- SQLite acceptable during development

ORM:
- Prisma

Authentication:
- Auth.js (NextAuth v5)

Validation:
- Zod

API:
- Route Handlers
- Server Actions when appropriate

Deployment Target:
- Vercel

---

# General Principles

Always:

- write clean code
- avoid duplication
- keep components small
- prefer composition over inheritance
- keep files focused on one responsibility
- write reusable functions
- use async/await
- avoid unnecessary libraries
- optimize for readability

Never:

- use `any`
- ignore TypeScript errors
- disable lint rules
- hardcode secrets
- hardcode API URLs
- leave dead code
- create giant components

---

# Folder Structure

Use this structure whenever possible.

```
app/
components/
features/
lib/
server/
hooks/
types/
utils/
prisma/
public/
```

Feature specific logic belongs inside:

```
features/game/
features/auth/
features/scoreboard/
```

---

# Component Rules

Prefer:

Server Components

Only use Client Components when needed.

Client Components should only exist for:

- forms
- animations
- timers
- keyboard input
- game interaction

---

# Styling Rules

Use Tailwind only.

Avoid inline styles.

Extract repeated UI into reusable components.

Examples:

- Button
- Card
- Modal
- Input
- Dialog
- Badge
- Tile
- KeyboardKey

---

# Naming

Components:

```
GameBoard.tsx
Keyboard.tsx
LetterTile.tsx
ScoreCard.tsx
```

Hooks:

```
useGame.ts
useKeyboard.ts
useCountdown.ts
```

Utilities:

```
game.ts
words.ts
score.ts
auth.ts
```

---

# Game Logic

Game logic must remain independent from UI.

Game engine should expose functions like:

```
startGame()

submitGuess()

validateGuess()

getTileState()

isGameWon()

isGameLost()

resetGame()
```

UI should only consume these functions.

---

# Word Validation

Support:

- dictionary validation
- duplicate letters
- correct Wordle coloring

Tile states:

```
correct
present
absent
empty
```

Game engine must be easily testable.

---

# Keyboard

Support:

- physical keyboard
- mobile
- on-screen keyboard

Keys:

```
Enter
Backspace
A-Z
```

---

# Authentication

Users can:

- sign up
- sign in
- sign out

Only authenticated users can:

- submit scores
- appear on leaderboard
- access profile

Guests can still play.

---

# User Model

Suggested fields:

```
id
username
email
image
createdAt
```

---

# Score Model

Suggested fields:

```
id
userId
word
attempts
won
time
createdAt
```

---

# Leaderboard

Leaderboard should support:

- best scores
- latest games
- win streak
- win percentage
- total wins
- total games
- average attempts

---

# Game Rules

Default:

- 5 letter words
- 6 attempts

Future settings should allow:

- different word lengths
- hard mode
- daily mode
- unlimited mode

Do not hardcode these values.

---

# Daily Puzzle

Daily mode should use deterministic seed.

Every player gets the same word for the same date.

---

# Random Game

Random mode should choose a random word.

Avoid repeating recent words.

---

# API Design

Prefer REST-style route handlers.

Examples:

```
/api/game

/api/score

/api/leaderboard

/api/profile
```

Validate every request using Zod.

---

# Database

Never write raw SQL unless necessary.

Use Prisma.

Always:

- indexes where appropriate
- foreign keys
- cascading deletes when appropriate

---

# Error Handling

Never silently ignore errors.

Return meaningful messages.

Log unexpected server errors.

---

# Performance

Prefer:

- Server Components
- streaming
- caching
- lazy loading
- dynamic imports when useful

Avoid unnecessary re-renders.

---

# Accessibility

Always include:

- keyboard navigation
- ARIA labels
- focus indicators
- sufficient color contrast

Game should be playable without a mouse.

---

# Responsive Design

Support:

- desktop
- tablet
- mobile

Mobile experience is first-class.

---

# Code Style

Prefer:

Early returns

Example:

```ts
if (!user) return null
```

Avoid:

```
if (...) {
} else {
}
```

when unnecessary.

Keep functions under ~50 lines when practical.

---

# Environment Variables

Store secrets only in:

```
.env.local
```

Never expose:

- database URLs
- auth secrets
- API keys

---

# Git

Write meaningful commits.

Examples:

```
feat(game): implement tile evaluation

feat(auth): add GitHub login

fix(scoreboard): resolve duplicate scores

refactor(game): simplify validation logic
```

---

# Testing

Prefer:

- Vitest
- React Testing Library

Critical tests:

- word validation
- duplicate letters
- scoring
- streak calculation
- leaderboard ranking

---

# Future Features

Design code so these can be added easily:

- multiplayer
- achievements
- statistics
- themes
- animations
- custom dictionaries
- tournaments
- friends
- profile pages
- replay sharing
- PWA support

---

# AI Coding Instructions

When implementing features:

1. Understand existing architecture before modifying code.

2. Reuse existing utilities whenever possible.

3. Avoid duplicate logic.

4. If a file exceeds ~300 lines, consider refactoring.

5. Keep business logic out of UI components.

6. Prefer server-side data fetching where appropriate.

7. Write strongly typed code.

8. Explain significant architectural decisions in comments only when they are not obvious.

9. Keep imports organized and remove unused code.

10. Before finishing any task, verify:
  - TypeScript passes
  - ESLint passes
  - Build succeeds
  - No obvious performance regressions

---

# Definition of Done

A task is complete only if:

- feature works
- TypeScript has no errors
- lint passes
- responsive layout works
- accessibility considered
- no duplicated code
- no console logs
- no dead code
- reusable where appropriate
- consistent with project architecture

---

Build software that is simple, maintainable, scalable, and enjoyable to extend.

# Testing

Every completed task must include appropriate tests.

When modifying existing functionality:

- Update existing tests.
- Do not remove failing tests.
- Keep coverage at least as good as before.

When adding new functionality:

- Write unit tests.
- Test edge cases.
- Test error cases.
- Test success cases.

Preferred stack:

- Vitest
- React Testing Library

Critical code (game engine, scoring, validation) should always be covered by unit tests.

# Testing

Every completed task must include appropriate tests.

When modifying existing functionality:

- Update existing tests.
- Do not remove failing tests.
- Keep coverage at least as good as before.

When adding new functionality:

- Write unit tests.
- Test edge cases.
- Test error cases.
- Test success cases.

Preferred stack:

- Vitest
- React Testing Library

Critical code (game engine, scoring, validation) should always be covered by unit tests.

# Development Workflow

For every task:

1. Understand the existing code.
2. Create a plan.
3. Implement the solution.
4. Run type checking.
5. Run linting.
6. Run unit tests.
7. Fix all failures.
8. Ensure the project builds successfully.
9. Only then consider the task complete.

Never mark a task as complete unless:

- pnpm lint passes
- pnpm typecheck passes
- pnpm test passes
- pnpm build passes

