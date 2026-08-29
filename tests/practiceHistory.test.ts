import { describe, expect, it } from "vitest";
import {
  formatDuration,
  groupPracticeHistory,
  parsePracticeHistory,
  type PracticeRecord,
} from "../src/lib/practiceHistory";

const records: PracticeRecord[] = [
  {
    id: "older",
    exerciseId: "lesson:bursts:1",
    exerciseTitle: "Bursts",
    lessonSlug: "picking",
    lessonTitle: "Picking",
    startedAt: "2026-08-28T10:00:00.000Z",
    durationSeconds: 30,
    bpm: 100,
  },
  {
    id: "newer",
    exerciseId: "lesson:bursts:1",
    exerciseTitle: "Bursts",
    lessonSlug: "picking",
    lessonTitle: "Picking",
    startedAt: "2026-08-29T10:00:00.000Z",
    durationSeconds: 45,
    bpm: 95,
  },
];

describe("practice history", () => {
  it("validates the versioned storage schema and removes invalid records", () => {
    const raw = JSON.stringify({
      version: 1,
      records: [...records, { id: "invalid", bpm: 0 }],
    });

    expect(parsePracticeHistory(raw)).toEqual(records);
    expect(parsePracticeHistory("not json")).toEqual([]);
    expect(parsePracticeHistory(JSON.stringify({ version: 2, records }))).toEqual([]);
  });

  it("groups sessions by lesson and exercise and calculates summaries", () => {
    const [lesson] = groupPracticeHistory(records);
    const [exercise] = lesson.exercises;

    expect(lesson.lessonTitle).toBe("Picking");
    expect(lesson.sessionCount).toBe(2);
    expect(lesson.totalDurationSeconds).toBe(75);
    expect(exercise.sessions.map((session) => session.id)).toEqual(["newer", "older"]);
    expect(exercise.latestBpm).toBe(95);
    expect(exercise.highestBpm).toBe(100);
  });

  it("formats durations for session and summary display", () => {
    expect(formatDuration(8)).toBe("8s");
    expect(formatDuration(75)).toBe("1m 15s");
    expect(formatDuration(3_661)).toBe("1h 1m");
  });
});
