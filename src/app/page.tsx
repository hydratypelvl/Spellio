"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Board from "@/components/Board";
import Keyboard from "@/components/Keyboard";
import Confetti from "@/components/Confetti";
import TutorialModal, { useTutorial } from "@/components/TutorialModal";
import GameOverModal from "@/components/GameOverModal";
import StatsModal from "@/components/StatsModal";
import UsernameModal from "@/components/UsernameModal";
import ProfileDropdown from "@/components/ProfileDropdown";
import LeaderboardModal from "@/components/LeaderboardModal";
import {
  createGameState,
  addLetter,
  removeLetter,
  submitGuess,
  getKeyboardState,
  type GameState,
} from "@/lib/wordle";

const WORDS = [
  "apple", "beach", "brain", "bread", "brush", "cabin", "candy", "chair",
  "chalk", "charm", "chase", "cheap", "check", "chess", "chief", "child",
  "chili", "chill", "chord", "civic", "claim", "clash", "class", "clean",
  "clear", "climb", "cling", "clock", "clone", "close", "cloud", "coach",
  "coast", "coral", "couch", "could", "count", "court", "cover", "crack",
  "craft", "crane", "crash", "crazy", "cream", "creek", "crest", "crime",
  "crisp", "cross", "crowd", "crown", "crush", "curve", "cycle", "dance",
  "death", "debut", "delay", "depth", "devil", "diary", "dirty", "disco",
  "dodge", "doing", "doubt", "dough", "draft", "drain", "drake", "drama",
  "drank", "drape", "drawn", "dream", "dress", "drift", "drill", "drink",
  "drive", "drone", "drown", "dying", "eager", "eagle", "early", "earth",
  "eight", "elder", "elect", "elite", "email", "ember", "empty", "enemy",
  "enjoy", "enter", "entry", "equal", "error", "essay", "event", "every",
  "exact", "exile", "extra", "fable", "faith", "false", "fancy", "fatal",
  "fault", "feast", "fence", "fetch", "fever", "fiber", "field", "fiery",
  "fight", "final", "first", "fixed", "flame", "flash", "fleet", "flesh",
  "float", "flood", "floor", "flour", "fluid", "flush", "flute", "focus",
  "force", "forge", "forth", "found", "frame", "frank", "fraud", "fresh",
  "front", "frost", "fruit", "giant", "given", "glass", "gleam", "glide",
  "globe", "gloom", "glory", "gloss", "glove", "going", "grace", "grade",
  "grain", "grand", "grant", "grape", "graph", "grasp", "grass", "grate",
  "grave", "great", "greed", "green", "greet", "grief", "grill", "grind",
  "gripe", "gross", "group", "grove", "growl", "grown", "guard", "guess",
  "guest", "guide", "guild", "guilt", "guise", "habit", "happy", "harsh",
  "haven", "heart", "heavy", "hedge", "hence", "hobby", "honor", "horse",
  "hotel", "house", "human", "humor", "hyper", "ideal", "image", "imply",
  "inbox", "index", "indie", "inner", "input", "irony", "issue", "ivory",
  "jewel", "joint", "joker", "jolly", "judge", "juice", "juicy", "jumbo",
  "karma", "kayak", "khaki", "kneel", "knife", "knock", "known", "label",
  "lance", "large", "laser", "latch", "later", "laugh", "layer", "learn",
  "lease", "least", "leave", "legal", "lemon", "level", "light", "limit",
  "linen", "liver", "local", "logic", "login", "loose", "lover", "lower",
  "loyal", "lucky", "lunch", "lyric", "magic", "major", "maker", "manor",
  "maple", "march", "marry", "marsh", "mason", "match", "mayor", "media",
  "mercy", "merge", "merit", "metal", "might", "miner", "minor", "minus",
  "model", "money", "month", "moral", "motor", "mound", "mount", "mouse",
  "mouth", "movie", "muddy", "multi", "music", "naive", "nerve", "never",
  "night", "noble", "noise", "north", "noted", "novel", "nurse", "nylon",
  "ocean", "offer", "often", "onset", "opera", "orbit", "order", "organ",
  "other", "ought", "outer", "outdo", "overt", "oxide", "ozone", "paint",
  "panel", "panic", "paper", "patch", "pause", "peace", "peach", "pearl",
  "penny", "phase", "phone", "photo", "piano", "piece", "pilot", "pitch",
  "pixel", "pizza", "place", "plain", "plane", "plant", "plate", "plaza",
  "plead", "pluck", "plumb", "plume", "plump", "plush", "point", "poker",
  "polar", "porch", "posed", "pouch", "pound", "power", "press", "price",
  "pride", "prime", "print", "prior", "prize", "probe", "prone", "proof",
  "proud", "prove", "proxy", "psalm", "pulse", "punch", "pupil", "purse",
  "quail", "qualm", "queen", "query", "quest", "queue", "quick", "quiet",
  "quilt", "quirk", "quota", "quote", "radar", "radio", "raise", "rally",
  "ranch", "range", "rapid", "ratio", "reach", "react", "ready", "realm",
  "rebel", "refer", "reign", "relax", "relay", "renal", "renew", "reply",
  "rider", "ridge", "rifle", "right", "rigid", "rinse", "risky", "rival",
  "river", "roast", "robin", "robot", "rocky", "rogue", "roman", "rough",
  "round", "route", "royal", "rugby", "ruler", "rural", "saint", "salad",
  "salon", "sandy", "sauce", "scale", "scare", "scene", "scent", "scope",
  "score", "scout", "scrap", "seize", "sense", "serve", "seven", "shade",
  "shady", "shaft", "shake", "shall", "shame", "shape", "share", "shark",
  "sharp", "shave", "sheep", "sheer", "sheet", "shelf", "shell", "shift",
  "shine", "shiny", "shirt", "shock", "shoot", "shore", "short", "shout",
  "sieve", "sight", "sigma", "since", "sixth", "sixty", "skill", "skull",
  "slate", "sleep", "slice", "slide", "slope", "small", "smart", "smell",
  "smile", "smoke", "snake", "solar", "solid", "solve", "sorry", "sound",
  "south", "space", "spare", "spark", "speak", "spear", "speed", "spell",
  "spend", "spice", "spill", "spine", "spoke", "spoon", "sport", "spray",
  "squad", "stack", "staff", "stage", "stain", "stair", "stake", "stale",
  "stalk", "stall", "stamp", "stand", "stare", "stark", "start", "state",
  "stave", "steak", "steal", "steam", "steel", "steep", "steer", "stern",
  "stick", "stiff", "still", "sting", "stink", "stock", "stole", "stone",
  "stood", "stool", "store", "storm", "story", "stout", "stove", "strap",
  "straw", "stray", "strip", "strum", "strut", "stuck", "study", "stuff",
  "stump", "style", "sugar", "suite", "sunny", "super", "surge", "swamp",
  "swarm", "swear", "sweep", "sweet", "swept", "swift", "swing", "swirl",
  "sword", "swore", "sworn", "swung", "table", "taste", "teach", "teeth",
  "tempo", "tense", "tenth", "theme", "thick", "thief", "thing", "think",
  "third", "thorn", "those", "three", "threw", "throw", "thumb", "tiger",
  "tight", "timer", "tired", "title", "today", "token", "total", "touch",
  "tough", "towel", "tower", "toxic", "trace", "track", "trade", "trail",
  "train", "trait", "trash", "treat", "trend", "trial", "tribe", "trick",
  "tried", "truly", "trump", "trunk", "trust", "truth", "tumor", "tuner",
  "twice", "twist", "ultra", "uncle", "under", "unify", "union", "unite",
  "unity", "until", "upper", "upset", "urban", "usage", "usual", "utter",
  "valid", "value", "vapor", "vault", "video", "vigor", "viral", "virus",
  "visit", "vista", "vital", "vivid", "vocal", "vodka", "voice", "voter",
  "waist", "waste", "watch", "water", "weary", "weave", "wedge", "weigh",
  "weird", "whale", "wheat", "wheel", "where", "which", "while", "whirl",
  "white", "whole", "whose", "widow", "width", "witch", "woman", "world",
  "worry", "worse", "worst", "worth", "would", "wound", "wrath", "wrist",
  "write", "wrong", "wrote", "yacht", "yield", "young", "youth", "zebra",
];

function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function initGameState() {
  return createGameState(getRandomWord());
}

export default function Home() {
  const { data: session, status } = useSession();
  const { showTutorial, closeTutorial } = useTutorial();
  const [gameState, setGameState] = useState<GameState>(initGameState);
  const [showManualTutorial, setShowManualTutorial] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [showGameOver, setShowGameOver] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [usernameDismissed, setUsernameDismissed] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(() => Date.now());

  const needsUsername = status === "authenticated" && session?.user && !(session.user as { username?: string }).username && !usernameDismissed;

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState.gameOver) return;
      setGameState(addLetter(gameState, key));
    },
    [gameState]
  );

  const handleEnter = useCallback(() => {
    if (gameState.gameOver) return;
    const rowToReveal = gameState.currentRow;
    setRevealedRows(new Set([...revealedRows, rowToReveal]));
    setGameState(submitGuess(gameState));
  }, [gameState, revealedRows]);

  const handleBackspace = useCallback(() => {
    if (gameState.gameOver) return;
    setGameState(removeLetter(gameState));
  }, [gameState]);

  const handleNewGame = useCallback(() => {
    setGameState(createGameState(getRandomWord()));
    setRevealedRows(new Set());
    setShowGameOver(false);
    setGameStartTime(Date.now());
  }, []);

  const gameOverRef = useRef(gameState.gameOver);
  const showTutorialRef = useRef(showTutorial);
  const showManualTutorialRef = useRef(showManualTutorial);
  const showGameOverRef = useRef(showGameOver);
  const handleEnterRef = useRef(handleEnter);
  const handleBackspaceRef = useRef(handleBackspace);
  const handleKeyPressRef = useRef(handleKeyPress);

  useEffect(() => { gameOverRef.current = gameState.gameOver; }, [gameState.gameOver]);
  useEffect(() => { showTutorialRef.current = showTutorial; }, [showTutorial]);
  useEffect(() => { showManualTutorialRef.current = showManualTutorial; }, [showManualTutorial]);
  useEffect(() => { showGameOverRef.current = showGameOver; }, [showGameOver]);
  useEffect(() => { handleEnterRef.current = handleEnter; }, [handleEnter]);
  useEffect(() => { handleBackspaceRef.current = handleBackspace; }, [handleBackspace]);
  useEffect(() => { handleKeyPressRef.current = handleKeyPress; }, [handleKeyPress]);

  useEffect(() => {
    if (gameState.gameOver && session?.user) {
      const time = Math.floor((Date.now() - gameStartTime) / 1000);
      const lastRow = gameState.currentRow > 0 ? gameState.currentRow - 1 : 0;
      const word = gameState.board[lastRow]
        ? gameState.board[lastRow].map((t) => t.letter).join("")
        : "";

      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word,
          attempts: gameState.currentRow,
          won: gameState.won,
          time,
        }),
      });
    }
  }, [gameState.gameOver, gameState.currentRow, gameState.won, gameState.board, session?.user, gameStartTime]);

  useEffect(() => {
    if (gameState.gameOver) {
      const timer = setTimeout(() => {
        setShowGameOver(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.gameOver]);

  useEffect(() => {
    if (gameState.message) {
      const timer = setTimeout(() => {
        setGameState((prev) => ({ ...prev, message: "" }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.message]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOverRef.current || showTutorialRef.current || showManualTutorialRef.current || showGameOverRef.current) return;

      if (e.key === "Enter") {
        handleEnterRef.current();
      } else if (e.key === "Backspace") {
        handleBackspaceRef.current();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPressRef.current(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (status === "loading") return null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-zinc-900 p-4">
      {(showTutorial || showManualTutorial) && (
        <TutorialModal onClose={() => {
          closeTutorial();
          setShowManualTutorial(false);
        }} />
      )}

      {showGameOver && gameState.gameOver && (
        <GameOverModal
          won={gameState.won}
          attempts={gameState.currentRow}
          targetWord={gameState.targetWord}
          onClose={handleNewGame}
        />
      )}

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}

      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}

      {needsUsername && (
        <UsernameModal onComplete={() => {
          setUsernameDismissed(true);
          window.location.reload();
        }} />
      )}

      <Confetti active={gameState.won} />

      <header className="w-full max-w-[500px] border-b border-zinc-300 dark:border-zinc-700 pb-4 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-black dark:text-white">
            Spellio
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualTutorial(true)}
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="How to play"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {session?.user && (
              <button
                onClick={() => setShowStats(true)}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Statistics"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Leaderboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </button>
            {session?.user ? (
              <ProfileDropdown
                username={(session.user as { username?: string }).username || session.user.name || session.user.email || ""}
                image={session.user.image}
                name={session.user.name}
              />
            ) : (
              <Link
                href="/signin"
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center gap-8">
        <div className="relative">
          {gameState.message && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              role="alert"
            >
              <span className="px-5 py-2.5 text-base sm:text-lg font-bold text-center bg-zinc-800 text-white rounded-md shadow-lg">
                {gameState.message}
              </span>
            </div>
          )}

          <Board board={gameState.board} revealedRows={revealedRows} />
        </div>
      </main>
      <Keyboard
          onKeyPress={handleKeyPress}
          onEnter={handleEnter}
          onBackspace={handleBackspace}
          keyStates={getKeyboardState(gameState.board)}
          disabled={gameState.gameOver}
      />
    </div>
  );
}
