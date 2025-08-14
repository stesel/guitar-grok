import { createClient } from "@supabase/supabase-js";
import type { Exercise, Session, Attempt } from "@/src/utils/guitar";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(url, anonKey);

type ExerciseRow = {
  id: string;
  user_id: string;
  title: string;
  bpm_min: number;
  bpm_max: number;
  key: string;
  est_minutes: number;
  difficulty: string;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

function mapExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    title: row.title,
    bpmMin: row.bpm_min,
    bpmMax: row.bpm_max,
    key: row.key,
    estMinutes: row.est_minutes,
    difficulty: row.difficulty as Exercise["difficulty"],
    notes: row.notes ?? undefined,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getExercises(): Promise<Exercise[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as ExerciseRow[]).map(mapExercise);
}

export async function upsertExercise(ex: Exercise): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");
  const row: ExerciseRow = {
    id: ex.id,
    user_id: user.id,
    title: ex.title,
    bpm_min: ex.bpmMin,
    bpm_max: ex.bpmMax,
    key: ex.key,
    est_minutes: ex.estMinutes,
    difficulty: ex.difficulty,
    notes: ex.notes ?? null,
    tags: ex.tags,
    created_at: ex.createdAt,
    updated_at: ex.updatedAt,
  };
  const { error } = await supabase.from("exercises").upsert(row);
  if (error) throw error;
}

type SessionRow = {
  id: string;
  user_id: string;
  date: string;
  total_planned: number;
  items: Session["items"];
  created_at: string;
};

function mapSession(row: SessionRow): Session {
  return {
    id: row.id,
    date: row.date,
    totalPlanned: row.total_planned,
    items: row.items,
  };
}

export async function getSessions(): Promise<Session[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return (data as SessionRow[]).map(mapSession);
}

export async function insertSession(sess: Session): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");
  const row: SessionRow = {
    id: sess.id,
    user_id: user.id,
    date: sess.date,
    total_planned: sess.totalPlanned,
    items: sess.items,
    created_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("sessions").insert(row);
  if (error) throw error;
}

type AttemptRow = {
  id: string;
  user_id: string;
  exercise_id: string;
  bpm_used: number;
  status: string;
  timestamp: string;
  notes: string | null;
};

function mapAttempt(row: AttemptRow): Attempt {
  return {
    id: row.id,
    exerciseId: row.exercise_id,
    bpmUsed: row.bpm_used,
    status: row.status as Attempt["status"],
    timestamp: row.timestamp,
    notes: row.notes ?? undefined,
  };
}

export async function getAttempts(): Promise<Attempt[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false });
  if (error || !data) return [];
  return (data as AttemptRow[]).map(mapAttempt);
}

export async function insertAttempt(a: Attempt): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");
  const row: AttemptRow = {
    id: a.id,
    user_id: user.id,
    exercise_id: a.exerciseId,
    bpm_used: a.bpmUsed,
    status: a.status,
    timestamp: a.timestamp,
    notes: a.notes ?? null,
  };
  const { error } = await supabase.from("attempts").insert(row);
  if (error) throw error;
}
