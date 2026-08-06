"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

interface ProfileDropdownProps {
  username: string;
  image: string | null | undefined;
  name: string | null | undefined;
}

export default function ProfileDropdown({ username, image, name }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditing(false);
        setNewUsername(username);
        setError("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [username]);

  useEffect(() => {
    if (!editing || newUsername === username) return;
    if (newUsername.length < 3) return;
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username?username=${encodeURIComponent(newUsername)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setAvailable(data.available);
        setError(data.available ? "" : (data.error || "Username already taken"));
        setChecking(false);
      } catch {
        /* ignored */
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [newUsername, editing, username]);

  const handleStartEditing = () => {
    setNewUsername(username);
    setAvailable(true);
    setError("");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!available || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update");
        setSaving(false);
      }
    } catch {
      setError("Something went wrong");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setNewUsername(username);
    setError("");
  };

  const isSame = editing && newUsername === username;
  const isTooShort = editing && newUsername.length > 0 && newUsername.length < 3;
  const isInvalidChars = editing && newUsername.length >= 3 && !/^[a-zA-Z0-9_]+$/.test(newUsername);

  const effectiveAvailable = isSame ? true : available;
  const effectiveError = isInvalidChars ? "Only letters, numbers, and underscores" : error;
  const effectiveChecking = !isSame && !isTooShort && !isInvalidChars && checking;

  const borderColor =
    effectiveAvailable === true ? "border-green-500"
      : effectiveAvailable === false ? "border-red-500"
        : "border-zinc-300 dark:border-zinc-600";

  const statusColor =
    effectiveAvailable === true ? "text-green-600 dark:text-green-400"
      : effectiveAvailable === false ? "text-red-600 dark:text-red-400"
        : "text-zinc-500 dark:text-zinc-400";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none"
        aria-label="Profile menu"
      >
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hidden sm:inline">
          {username || name}
        </span>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name || "User"}
            className="w-8 h-8 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
            {(username || name || "?")[0].toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 z-50 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Username</p>
            {editing ? (
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                  maxLength={20}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border-2 ${borderColor} bg-zinc-50 dark:bg-zinc-700 text-black dark:text-white outline-none`}
                />
                <div className="flex justify-between items-center mt-1.5">
                  <span className={`text-xs ${statusColor}`}>
                    {effectiveChecking && "Checking..."}
                    {effectiveAvailable === true && (isSame ? "Current" : "Available!")}
                    {effectiveAvailable === false && effectiveError}
                  </span>
                  <span className="text-xs text-zinc-400">{newUsername.length}/20</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    disabled={!effectiveAvailable || saving || isSame}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      effectiveAvailable && !isSame && !saving
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    }`}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartEditing}
                className="w-full text-left px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-black dark:text-white"
              >
                {username || "Set username"}
              </button>
            )}
          </div>

          <button
            onClick={() => signOut()}
            className="w-full px-4 py-3 text-sm font-medium text-left text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
