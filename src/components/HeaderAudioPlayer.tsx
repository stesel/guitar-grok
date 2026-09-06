"use client";

import { useEffect, useRef, useState } from "react";

interface AudioTrack {
  name: string;
  url: string;
}

const SKIP_SECONDS = 10;
const VOLUME_STORAGE_KEY = "guitar-grok-audio-volume";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  return `${minutes}:${String(wholeSeconds % 60).padStart(2, "0")}`;
}

function readDuration(audio: HTMLAudioElement) {
  if (Number.isFinite(audio.duration) && audio.duration > 0) return audio.duration;
  if (audio.seekable.length > 0) return audio.seekable.end(audio.seekable.length - 1);
  return 0;
}

export default function HeaderAudioPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    const savedVolume = window.localStorage.getItem(VOLUME_STORAGE_KEY);
    if (savedVolume !== null) {
      const parsedVolume = Number(savedVolume);
      if (Number.isFinite(parsedVolume) && parsedVolume >= 0 && parsedVolume <= 1) {
        setVolume(parsedVolume);
      }
    }

    const controller = new AbortController();
    fetch("/api/audio", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Audio list unavailable");
        return response.json() as Promise<{ tracks: AudioTrack[] }>;
      })
      .then((data) => setTracks(data.tracks))
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setError("Could not load the audio playlist.");
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
    window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
  }, [volume]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [isOpen]);

  const play = async () => {
    if (!currentTrack || !audioRef.current) return;
    try {
      await audioRef.current.play();
      setError(null);
    } catch {
      setError("This audio file could not be played.");
    }
  };

  const pause = () => audioRef.current?.pause();

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), duration || 0);
  };

  const selectTrack = (index: number, autoplay = false) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    if (autoplay) window.setTimeout(() => void audioRef.current?.play(), 0);
  };

  const changeTrack = (direction: -1 | 1) => {
    if (tracks.length === 0) return;
    const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
    selectTrack(nextIndex, isPlaying);
  };

  const playNext = () => {
    if (tracks.length < 2 || currentIndex === tracks.length - 1) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }
    selectTrack(currentIndex + 1, true);
  };

  const syncDuration = (audio: HTMLAudioElement) => {
    const nextDuration = readDuration(audio);
    if (nextDuration > 0) setDuration(nextDuration);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
          isPlaying ? "border-cyan-300/70 bg-cyan-300 text-slate-950" : "border-white/20 bg-white/10 hover:bg-white/20"
        }`}
        aria-expanded={isOpen}
        aria-controls="global-audio-player-panel"
        aria-label={isPlaying ? `Playing ${currentTrack?.name ?? "audio"}` : "Open audio player"}
      >
        <span aria-hidden="true">{isPlaying ? "●" : "♫"}</span>
        <span className="hidden md:inline">Audio</span>
      </button>

      <section
        id="global-audio-player-panel"
        aria-label="Audio player"
        aria-hidden={!isOpen}
        className={`fixed left-1/2 top-[4.75rem] w-[min(23rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/20 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.75rem)] sm:translate-x-0 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <audio
          ref={audioRef}
          src={currentTrack?.url}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime);
            syncDuration(event.currentTarget);
          }}
          onLoadedMetadata={(event) => syncDuration(event.currentTarget)}
          onLoadedData={(event) => syncDuration(event.currentTarget)}
          onDurationChange={(event) => syncDuration(event.currentTarget)}
          onProgress={(event) => syncDuration(event.currentTarget)}
          onEnded={playNext}
          onError={() => currentTrack && setError("This audio file could not be played.")}
        />

        <div className="mb-4 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Audio player</h2>
            <span className="shrink-0 text-sm text-white/60" aria-live="polite">
              {isPlaying ? "Playing" : "Ready"}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-cyan-200" title={currentTrack?.name}>
            {currentTrack?.name ?? "No track selected"}
          </p>
        </div>

        {isLoading ? (
          <div className="mb-4 h-28 animate-pulse rounded-xl bg-white/10" aria-label="Loading playlist" />
        ) : tracks.length === 0 ? (
          <p className="mb-4 rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/70">
            Add MP3 or WAV files to the public/audio folder.
          </p>
        ) : (
          <>
            <label htmlFor="audio-progress" className="sr-only">Track position</label>
            <input
              id="audio-progress"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => {
                const nextTime = Number(event.target.value);
                if (audioRef.current) audioRef.current.currentTime = nextTime;
                setCurrentTime(nextTime);
              }}
              className="h-2 w-full cursor-pointer accent-cyan-300"
            />
            <div className="mt-1 flex justify-between text-xs tabular-nums text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>

            <div className="my-4 grid grid-cols-7 gap-1" aria-label="Playback controls">
              <TransportButton label="Previous track" onClick={() => changeTrack(-1)}>◀|</TransportButton>
              <TransportButton label={`Rewind ${SKIP_SECONDS} seconds`} onClick={() => skip(-SKIP_SECONDS)}>−10</TransportButton>
              <TransportButton label="Play" onClick={() => void play()} active={isPlaying}>▶</TransportButton>
              <TransportButton label="Pause" onClick={pause}>Ⅱ</TransportButton>
              <TransportButton label="Stop" onClick={stop}>■</TransportButton>
              <TransportButton label={`Forward ${SKIP_SECONDS} seconds`} onClick={() => skip(SKIP_SECONDS)}>+10</TransportButton>
              <TransportButton label="Next track" onClick={() => changeTrack(1)}>|▶</TransportButton>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <label htmlFor="audio-volume" className="text-sm text-white/75">Volume</label>
              <input
                id="audio-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="h-2 flex-1 cursor-pointer accent-cyan-300"
              />
              <span className="w-9 text-right text-xs tabular-nums text-white/60">{Math.round(volume * 100)}%</span>
            </div>

            <div className="max-h-44 overflow-y-auto rounded-xl border border-white/15" role="list" aria-label="Audio playlist">
              {tracks.map((track, index) => (
                <button
                  key={track.url}
                  type="button"
                  onClick={() => selectTrack(index, isPlaying)}
                  className={`block w-full cursor-pointer truncate border-b border-white/10 px-3 py-2.5 text-left text-sm last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-cyan-300 ${
                    index === currentIndex ? "bg-cyan-300/20 text-cyan-100" : "hover:bg-white/10"
                  }`}
                  title={track.name}
                  role="listitem"
                  aria-current={index === currentIndex ? "true" : undefined}
                >
                  {index === currentIndex ? "▶ " : ""}{track.name}
                </button>
              ))}
            </div>
          </>
        )}

        {error && <p className="mt-3 text-sm text-rose-300" role="alert">{error}</p>}
      </section>
    </div>
  );
}

interface TransportButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

function TransportButton({ label, onClick, active = false, children }: TransportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 cursor-pointer rounded-lg px-1 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-300 ${
        active ? "bg-cyan-300 text-slate-950" : "bg-white/10 hover:bg-white/20"
      }`}
      aria-label={label}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
