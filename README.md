# Spellio

A modern Wordle-inspired word guessing game built with Next.js. Guess the 5-letter word in 6 tries. Features authentication, persistent stats, and a global leaderboard.

**Play now:** [spellio-omega.vercel.app](https://spellio-omega.vercel.app)

## Features

- **Word Guessing** — Classic Wordle gameplay with color-coded feedback (green, yellow, gray)
- **Authentication** — Sign in with Google or GitHub
- **Username System** — Set a custom display name for the leaderboard
- **Personal Stats** — Track your games, win rate, streaks, and guess distribution
- **Global Leaderboard** — Compete with other players, sortable by wins, win rate, or streak
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Mode** — Automatic dark/light theme based on system preference
- **Keyboard Support** — Play with physical keyboard or on-screen keys

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Prisma Postgres
- **ORM:** Prisma
- **Auth:** Auth.js v5 (NextAuth)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Prisma Postgres database (or any PostgreSQL database)
- Google/GitHub OAuth credentials (optional, for sign-in)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/hydratypelvl/Spellio.git
cd Spellio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating `.env.local`:

```bash
DATABASE_URL="your-database-url"
AUTH_SECRET="your-auth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
AUTH_URL="http://localhost:3000"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `node scripts/generate-og.js` | Regenerate OpenGraph image from SVG |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/        # Auth.js route handler
│   │   ├── leaderboard/ # Global leaderboard endpoint
│   │   ├── stats/       # Personal stats endpoint
│   │   └── username/    # Username check & set endpoint
│   ├── signin/          # Custom sign-in page
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main game page
│   └── globals.css      # Tailwind + animations
├── components/
│   ├── Board.tsx        # Game board grid
│   ├── Confetti.tsx     # Win confetti animation
│   ├── GameOverModal.tsx    # Game over overlay with stats
│   ├── Keyboard.tsx     # On-screen keyboard
│   ├── LeaderboardModal.tsx # Global leaderboard
│   ├── ProfileDropdown.tsx  # User menu with username edit
│   ├── StatsModal.tsx   # Personal statistics
│   ├── Tile.tsx         # Individual letter tile
│   ├── TutorialModal.tsx    # How to play guide
│   └── UsernameModal.tsx    # Username picker
├── lib/
│   ├── auth.ts          # Auth.js configuration
│   ├── prisma.ts        # Prisma client
│   └── wordle.ts        # Game logic engine
prisma/
├── schema.prisma        # Database schema
└── migrations/          # Database migrations
```

## How to Play

1. Guess any 5-letter word
2. Tiles will change color after each guess:
   - **Green** — Correct letter in the correct position
   - **Yellow** — Correct letter in the wrong position
   - **Gray** — Letter is not in the word
3. You have 6 attempts to find the word
4. Sign in to track your stats and appear on the leaderboard

## License

MIT
