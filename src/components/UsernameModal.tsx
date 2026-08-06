"use client";

import { useState, useEffect, useCallback } from "react";

interface UsernameModalProps {
  onComplete: () => void;
}

export default function UsernameModal({ onComplete }: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const checkUsername = useCallback(async (value: string) => {
    if (value.length < 3) {
      setStatus("idle");
      setError("");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setStatus("invalid");
      setError("Only letters, numbers, and underscores");
      return;
    }

    setStatus("checking");

    try {
      const res = await fetch(`/api/username?username=${encodeURIComponent(value)}`);
      const data = await res.json();

      if (data.available) {
        setStatus("available");
        setError("");
      } else {
        setStatus("taken");
        setError(data.error || "Username already taken");
      }
    } catch {
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) checkUsername(username);
    }, 400);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const handleSubmit = async () => {
    if (status !== "available" || saving) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        onComplete();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to set username");
        setSaving(false);
      }
    } catch {
      setError("Something went wrong");
      setSaving(false);
    }
  };

  const borderColor =
    status === "available"
      ? "border-green-500"
      : status === "taken" || status === "invalid"
        ? "border-red-500"
        : "border-zinc-300 dark:border-zinc-600";

  const statusColor =
    status === "available"
      ? "text-green-600 dark:text-green-400"
      : status === "taken" || status === "invalid"
        ? "text-red-600 dark:text-red-400"
        : "text-zinc-500 dark:text-zinc-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-2">
          Pick a Username
        </h2>
        <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm mb-6">
          This will be your public display name on the leaderboard.
        </p>

        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder="e.g. wordle_champ"
            maxLength={20}
            autoFocus
            className={`w-full px-4 py-3 text-lg rounded-xl border-2 ${borderColor} bg-zinc-50 dark:bg-zinc-700 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors`}
          />
          <div className="flex justify-between items-center mt-2 px-1">
            <span className={`text-xs ${statusColor}`}>
              {status === "checking" && "Checking..."}
              {status === "available" && "Available!"}
              {status === "taken" && "Already taken"}
              {status === "invalid" && error}
              {status === "idle" && username.length > 0 && "3-20 characters, letters, numbers, _"}
            </span>
            <span className="text-xs text-zinc-400">{username.length}/20</span>
          </div>
        </div>

        {error && status !== "invalid" && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={status !== "available" || saving}
          className={`w-full py-3 px-6 font-bold rounded-xl transition-colors ${
            status === "available" && !saving
              ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
