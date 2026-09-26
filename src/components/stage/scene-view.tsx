import type { ReactNode } from "react";
import type { Scene } from "@/lib/scenes";
import { cn } from "@/lib/utils";

function Safe({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-8 pb-16 pt-24 md:px-16 md:pb-20",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Kicker({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="mb-4 font-sans text-xs font-medium tracking-[0.22em] text-copper uppercase">
      {children}
    </p>
  );
}

export function SceneView({ scene }: { scene: Scene }) {
  if (scene.html === "title") {
    return (
      <Safe className="justify-between">
        <div className="flex items-start justify-between gap-6">
          <img
            src="/talk/dsm-firmenich-black.svg"
            alt="dsm-firmenich"
            className="h-7 w-auto md:h-8"
          />
          <p className="max-w-xs text-right font-sans text-[11px] tracking-wide text-muted">
            {scene.kicker}
          </p>
        </div>
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl leading-[1.08] font-semibold text-ink md:text-6xl">
            {scene.line}
          </h1>
          <p className="mt-6 font-display text-2xl text-copper md:text-4xl">{scene.sub}</p>
          <p className="mt-4 max-w-xl font-sans text-sm text-muted md:text-base">{scene.quote}</p>
          <p className="mt-10 font-sans text-sm text-ink">
            Eduardo Sopalda
            <span className="mt-1 block text-muted">
              D&T Global Data Governance Lead
            </span>
          </p>
        </div>
      </Safe>
    );
  }

  if (scene.html === "split" && scene.left && scene.right) {
    return (
      <Safe>
        <Kicker>{scene.kicker}</Kicker>
        <h2 className="font-display text-4xl font-semibold text-ink md:text-6xl">{scene.line}</h2>
        <p className="mt-4 max-w-2xl font-sans text-base text-muted">{scene.sub}</p>
        <div className="mt-10 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-sans text-xs tracking-[0.18em] text-copper uppercase">
              {scene.left.title}
            </h3>
            <ul className="space-y-2 font-sans text-lg text-ink">
              {scene.left.items.map((item) => (
                <li key={item} className="border-t border-ink/10 pt-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-sans text-xs tracking-[0.18em] text-copper uppercase">
              {scene.right.title}
            </h3>
            <ul className="space-y-2 font-sans text-lg text-ink">
              {scene.right.items.map((item) => (
                <li key={item} className="border-t border-copper/30 pt-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Safe>
    );
  }

  if (scene.html === "carbon") {
    return (
      <Safe>
        <Kicker>{scene.kicker}</Kicker>
        <p className="font-sans text-sm tracking-[0.16em] text-muted uppercase">
          Looks like chemistry. It is not.
        </p>
        <p className="font-display text-[18vw] leading-none font-semibold text-copper md:text-[9rem]">
          CO₂e
        </p>
        <p className="mt-4 max-w-2xl font-sans text-base text-muted">{scene.sub}</p>
        <p className="mt-8 max-w-2xl font-display text-2xl text-ink md:text-3xl">{scene.quote}</p>
      </Safe>
    );
  }

  if (scene.html === "batch") {
    const meanings = ["lot", "campaign", "shift", "tank", "order", "recipe", "day", "?"];
    return (
      <Safe>
        <Kicker>{scene.kicker}</Kicker>
        <h2 className="font-display text-4xl font-semibold text-ink md:text-6xl">{scene.line}</h2>
        <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
          <span className="font-display text-5xl text-copper">batch</span>
          {meanings.map((m) => (
            <span key={m} className="font-sans text-2xl text-muted/70">
              {m}
            </span>
          ))}
        </div>
        <p className="mt-8 max-w-2xl font-sans text-base text-muted">{scene.sub}</p>
      </Safe>
    );
  }

  if (scene.html === "docs") {
    return (
      <Safe>
        <Kicker>{scene.kicker}</Kicker>
        <div className="flex flex-wrap items-end gap-16">
          <div>
            <p className="font-display text-7xl font-semibold text-ink md:text-8xl">10 000</p>
            <p className="mt-2 font-sans text-sm tracking-wide text-muted">documents went in</p>
          </div>
          <div>
            <p className="font-display text-7xl font-semibold text-sap md:text-8xl">2 000</p>
            <p className="mt-2 font-sans text-sm tracking-wide text-muted">actually relevant</p>
          </div>
        </div>
        <p className="mt-8 max-w-2xl font-sans text-base text-muted">{scene.sub}</p>
      </Safe>
    );
  }

  if (scene.html === "road") {
    const words = ["Definitions", "Ownership", "Lineage", "Quality", "Context"];
    return (
      <Safe>
        <Kicker>{scene.kicker}</Kicker>
        <h2 className="font-display text-4xl font-semibold text-ink md:text-6xl">{scene.line}</h2>
        <div className="mt-10 flex flex-wrap gap-3">
          {words.map((w) => (
            <span
              key={w}
              className="border border-copper/40 px-4 py-2 font-sans text-sm tracking-wide text-ink"
            >
              {w}
            </span>
          ))}
        </div>
        <p className="mt-6 max-w-xl font-sans text-base text-muted">{scene.sub}</p>
      </Safe>
    );
  }

  if (scene.html === "question") {
    return (
      <Safe className="justify-center">
        <Kicker>{scene.kicker}</Kicker>
        <h2 className="max-w-4xl font-display text-3xl font-semibold text-ink md:text-5xl">
          {scene.line}
        </h2>
        <p className="mt-8 max-w-2xl font-sans text-base text-muted">{scene.sub}</p>
      </Safe>
    );
  }

  if (scene.html === "thanks") {
    return (
      <Safe className="justify-between">
        <img
          src="/talk/dsm-firmenich-black.svg"
          alt="dsm-firmenich"
          className="h-7 w-auto"
        />
        <div>
          <p className="font-sans text-xs tracking-[0.22em] text-copper uppercase">{scene.kicker}</p>
          <h2 className="mt-3 font-display text-5xl font-semibold text-ink">{scene.line}</h2>
          <p className="mt-3 font-sans text-base text-muted">{scene.sub}</p>
          <p className="mt-8 font-sans text-sm text-ink">{scene.quote}</p>
        </div>
      </Safe>
    );
  }

  return (
    <Safe className={scene.html === "line" ? "" : ""}>
      <Kicker>{scene.kicker}</Kicker>
      <h2 className="max-w-4xl font-display text-4xl leading-[1.12] font-semibold text-ink md:text-6xl">
        {scene.line}
      </h2>
      {scene.sub ? (
        <p className="mt-6 max-w-2xl font-sans text-base text-muted md:text-lg">{scene.sub}</p>
      ) : null}
      {scene.quote ? (
        <p className="mt-8 max-w-2xl font-display text-2xl text-copper md:text-3xl">{scene.quote}</p>
      ) : null}
    </Safe>
  );
}
