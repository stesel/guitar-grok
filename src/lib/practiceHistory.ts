export const PRACTICE_HISTORY_STORAGE_KEY = "guitar-grok-practice-history-v1";
export const PRACTICE_HISTORY_UPDATED_EVENT = "guitar-grok:practice-history-updated";

const HISTORY_VERSION = 1;

export interface PracticeRecord {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  startedAt: string;
  durationSeconds: number;
  bpm: number;
}

interface StoredPracticeHistory {
  version: typeof HISTORY_VERSION;
  records: PracticeRecord[];
}

export interface ExerciseHistory {
  exerciseId: string;
  exerciseTitle: string;
  sessions: PracticeRecord[];
  sessionCount: number;
  totalDurationSeconds: number;
  latestBpm: number;
  highestBpm: number;
}

export interface LessonHistory {
  lessonSlug: string;
  lessonTitle: string;
  exercises: ExerciseHistory[];
  sessionCount: number;
  totalDurationSeconds: number;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isPracticeRecord(value: unknown): value is PracticeRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<PracticeRecord>;

  return (
    isNonEmptyString(record.id) &&
    isNonEmptyString(record.exerciseId) &&
    isNonEmptyString(record.exerciseTitle) &&
    isNonEmptyString(record.lessonSlug) &&
    isNonEmptyString(record.lessonTitle) &&
    isNonEmptyString(record.startedAt) &&
    Number.isFinite(Date.parse(record.startedAt)) &&
    typeof record.durationSeconds === "number" &&
    Number.isFinite(record.durationSeconds) &&
    record.durationSeconds >= 2 &&
    typeof record.bpm === "number" &&
    Number.isFinite(record.bpm) &&
    record.bpm >= 1
  );
}

export function parsePracticeHistory(raw: string | null): PracticeRecord[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Partial<StoredPracticeHistory>;
    if (parsed.version !== HISTORY_VERSION || !Array.isArray(parsed.records)) return [];
    return parsed.records.filter(isPracticeRecord);
  } catch {
    return [];
  }
}

function getStorage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function readPracticeHistory(storage: Storage | null = getStorage()): PracticeRecord[] {
  if (!storage) return [];
  return parsePracticeHistory(storage.getItem(PRACTICE_HISTORY_STORAGE_KEY));
}

export function writePracticeHistory(
  records: PracticeRecord[],
  storage: Storage | null = getStorage(),
): boolean {
  if (!storage) return false;

  try {
    const value: StoredPracticeHistory = { version: HISTORY_VERSION, records };
    storage.setItem(PRACTICE_HISTORY_STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function appendPracticeRecord(record: PracticeRecord): boolean {
  const saved = writePracticeHistory([...readPracticeHistory(), record]);
  if (saved) window.dispatchEvent(new Event(PRACTICE_HISTORY_UPDATED_EVENT));
  return saved;
}

export function deletePracticeRecord(id: string): PracticeRecord[] {
  const records = readPracticeHistory().filter((record) => record.id !== id);
  if (writePracticeHistory(records)) window.dispatchEvent(new Event(PRACTICE_HISTORY_UPDATED_EVENT));
  return records;
}

export function clearPracticeHistory(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(PRACTICE_HISTORY_STORAGE_KEY);
  window.dispatchEvent(new Event(PRACTICE_HISTORY_UPDATED_EVENT));
}

export function groupPracticeHistory(records: PracticeRecord[]): LessonHistory[] {
  const lessons = new Map<string, { title: string; exercises: Map<string, PracticeRecord[]> }>();

  for (const record of records) {
    const lesson = lessons.get(record.lessonSlug) ?? {
      title: record.lessonTitle,
      exercises: new Map<string, PracticeRecord[]>(),
    };
    const sessions = lesson.exercises.get(record.exerciseId) ?? [];
    sessions.push(record);
    lesson.exercises.set(record.exerciseId, sessions);
    lessons.set(record.lessonSlug, lesson);
  }

  return Array.from(lessons, ([lessonSlug, lesson]) => {
    const exercises = Array.from(lesson.exercises, ([exerciseId, unsortedSessions]) => {
      const sessions = [...unsortedSessions].sort(
        (left, right) => Date.parse(right.startedAt) - Date.parse(left.startedAt),
      );
      return {
        exerciseId,
        exerciseTitle: sessions[0].exerciseTitle,
        sessions,
        sessionCount: sessions.length,
        totalDurationSeconds: sessions.reduce((sum, session) => sum + session.durationSeconds, 0),
        latestBpm: sessions[0].bpm,
        highestBpm: Math.max(...sessions.map((session) => session.bpm)),
      };
    }).sort((left, right) => left.exerciseTitle.localeCompare(right.exerciseTitle));

    return {
      lessonSlug,
      lessonTitle: lesson.title,
      exercises,
      sessionCount: exercises.reduce((sum, exercise) => sum + exercise.sessionCount, 0),
      totalDurationSeconds: exercises.reduce((sum, exercise) => sum + exercise.totalDurationSeconds, 0),
    };
  }).sort((left, right) => left.lessonTitle.localeCompare(right.lessonTitle));
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainder}s`;
  return `${remainder}s`;
}
