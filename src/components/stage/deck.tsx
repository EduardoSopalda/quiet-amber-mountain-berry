import { useCallback, useEffect, useRef, useState } from "react";
import { Hud } from "@/components/stage/hud";
import { SceneView } from "@/components/stage/scene-view";
import { World } from "@/components/stage/world";
import { SCENES } from "@/lib/scenes";

export function Deck() {
  const [index, setIndex] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [cityOn, setCityOn] = useState(false);
  const [notes, setNotes] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef<number | null>(null);

  const scene = SCENES[index];

  const go = useCallback((n: number) => {
    setIndex(Math.max(0, Math.min(SCENES.length - 1, n)));
  }, []);

  useEffect(() => {
    const t1 = window.setTimeout(() => setDrawn(true), 120);
    const t2 = window.setTimeout(() => setCityOn(true), 10000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " " || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        if (!running) {
          setRunning(true);
          startRef.current = Date.now();
        }
        go(index + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Home") {
        go(0);
      } else if (e.key === "End") {
        go(SCENES.length - 1);
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) void document.documentElement.requestFullscreen();
        else void document.exitFullscreen();
      } else if (e.key === "n" || e.key === "N") {
        setNotes((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, running]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (startRef.current) setElapsed((Date.now() - startRef.current) / 1000);
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    window.location.hash = scene.id;
  }, [scene.id]);

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden bg-paper text-ink"
      onClick={() => {
        if (!running) {
          setRunning(true);
          startRef.current = Date.now();
        }
        go(index + 1);
      }}
    >
      <World age={scene.age} cityOn={cityOn} drawn={drawn} />
      <div className="relative z-10 min-h-dvh">
        <SceneView scene={scene} />
      </div>
      <Hud index={index} elapsed={elapsed} notesOpen={notes} cue={scene.cue} />
    </div>
  );
}
