export const PREPARE_EXERCISE_EVENT = "guitar-grok:prepare-exercise";

export interface StartExerciseDetail {
  exerciseId: string;
  exerciseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
}
