import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cache for persisting spoofed stats
const statsCache = new Map<string, { likes: number; plays: number; saves: number }>();

export function getSpoofedStats(gameId: string) {
  // If we already have stats for this game, return them
  if (statsCache.has(gameId)) {
    return statsCache.get(gameId)!;
  }

  // Generate new stats
  const likes = Math.floor(Math.random() * 259) + 1;
  const saves = Math.floor(Math.random() * 259) + 1;
  
  // Make plays higher than both likes and saves
  const maxOfOthers = Math.max(likes, saves);
  const plays = maxOfOthers + Math.floor(Math.random() * (259 - maxOfOthers)) + 1;
  
  // Cache the stats
  const stats = { likes, plays, saves };
  statsCache.set(gameId, stats);
  
  return stats;
}
