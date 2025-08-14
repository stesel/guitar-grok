# AGENTS Instructions

## No SSR with WebAudio
Ensure all Tone.js logic runs client-side and the component is dynamically imported with `ssr: false` (already done), and guard any `window`/`localStorage` usage.

## Type hygiene
Add strict TypeScript settings and fix any implicit anys. Ensure all React state setters have correct types.

## UI polish
Add a small loading shimmer for the dashboard cards; keep Tailwind styles minimal.

## Export/Import UX
Replace “copy to clipboard” export with a downloadable JSON file, and accept drag-and-drop for import with schema validation.

## Session generator
Improve `generateSession` to (1) cap repeats of the same exercise, (2) weight by difficulty and neglected tags, and (3) fill exact minutes.

## Basic tests
Add Vitest + React Testing Library. Write tests for `computeStreak` and `generateSession`.

## Practice Player
Factor out a `<Metronome>` child component that takes `bpm`, `countIn`, and emits `onStart`/`onStop` using `Tone.Transport`. Keep `Tone.start()` behind a click.

## Backing loop
Add a simple drum pattern (kick on 1 & 3, snare on 2 & 4, hats 8ths) with a mute toggle. Keep it tempo‑synced to the metronome.

## Accessibility pass
Add labels, roles, keyboard focus rings, and `aria-live` updates for status changes.

## Responsive tweaks
Ensure comfortable controls on mobile: larger buttons, sticky bottom transport bar.
