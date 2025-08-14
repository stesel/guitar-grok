// Utility types and functions for Guitar Daily app

export type Exercise = {
  id: string;
  title: string;
  bpmMin: number;
  bpmMax: number;
  key: string;
  estMinutes: number; // estimated duration per attempt
  difficulty: "easy" | "medium" | "hard";
  notes?: string;
  tags: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type AttemptStatus = "done" | "partial" | "fail";

export type Attempt = {
  id: string;
  exerciseId: string;
  bpmUsed: number;
  status: AttemptStatus;
  timestamp: string; // ISO
  notes?: string;
};

export type SessionExercise = {
  exerciseId: string;
  plannedMinutes: number;
};

export type Session = {
  id: string;
  date: string; // yyyy-mm-dd
  totalPlanned: number; // minutes
  items: SessionExercise[];
};

export const LS_KEYS = {
  exercises: "ga_exercises",
  attempts: "ga_attempts",
  sessions: "ga_sessions",
  prefs: "ga_prefs",
} as const;

export function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function generateSession(exercises: Exercise[], minutes: number): Session {
  const byNeed = [...exercises].sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1));
  const items: SessionExercise[] = [];
  let total = 0;
  let i = 0;
  if (byNeed.length === 0) return { id: uid("sess"), date: todayISO(), totalPlanned: 0, items: [] };
  while (total < minutes) {
    const ex = byNeed[i % byNeed.length];
    const block = Math.min(ex.estMinutes || 3, minutes - total);
    items.push({ exerciseId: ex.id, plannedMinutes: block });
    total += block;
    i++;
    if (i > minutes * 4) break; // safety
  }
  return { id: uid("sess"), date: todayISO(), totalPlanned: minutes, items };
}

export function computeStreak(attempts: Attempt[]): { current: number; best: number } {
  const days = new Set(attempts.map((a) => a.timestamp.slice(0, 10)));
  const sorted = Array.from(days).sort();
  if (sorted.length === 0) return { current: 0, best: 0 };
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      cur += 1;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  let current = 0;
  for (let d = new Date(); ; d.setDate(d.getDate() - 1)) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) current += 1;
    else break;
  }
  return { current, best };
}

export const seedExercises: Exercise[] = [
  {
    id: uid("ex"),
    title: "Chromatic warm-up (1-2-3-4)",
    bpmMin: 60,
    bpmMax: 120,
    key: "C",
    estMinutes: 3,
    difficulty: "easy",
    tags: ["warmup", "chromatic"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: "4 strings, alternate picking, 8th notes.",
  },
  {
    id: uid("ex"),
    title: "Major scale 3NPS (C major)",
    bpmMin: 70,
    bpmMax: 140,
    key: "C",
    estMinutes: 4,
    difficulty: "medium",
    tags: ["scale", "technique"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uid("ex"),
    title: "Arpeggio sweep (Am triad)",
    bpmMin: 50,
    bpmMax: 110,
    key: "Am",
    estMinutes: 4,
    difficulty: "hard",
    tags: ["arpeggio", "sweep"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

