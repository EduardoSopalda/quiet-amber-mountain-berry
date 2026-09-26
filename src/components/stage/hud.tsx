import { SCENES } from "@/lib/scenes";
import { cn } from "@/lib/utils";

type Props = {
  index: number;
  elapsed: number;
  notesOpen: boolean;
  cue: string;
};

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function Hud({ index, elapsed, notesOpen, cue }: Props) {
  const scene = SCENES[index];
  const pct = (index / (SCENES.length - 1)) * 100;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 bg-ink/10">
        <div className="h-full bg-copper transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
      <div className="pointer-events-none absolute right-4 bottom-3 z-30 hidden items-center gap-4 font-sans text-[10px] tracking-wider text-muted/50 uppercase md:flex">
        <span className="tabular-nums">{fmt(elapsed)}</span>
        <span>{scene.label}</span>
        <span className="text-ink/40">Space · ← → · F · N</span>
      </div>
      {notesOpen ? (
        <aside
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute top-4 right-4 z-40 max-w-sm border border-ink/10 bg-paper/95 p-4 font-sans text-sm text-ink shadow-sm",
          )}
        >
          <p className="mb-2 text-[10px] tracking-[0.18em] text-copper uppercase">Speaker</p>
          <p className="leading-relaxed">{cue}</p>
        </aside>
      ) : null}
    </>
  );
}
