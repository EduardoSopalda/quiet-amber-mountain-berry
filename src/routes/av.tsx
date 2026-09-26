import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/av")({ component: AvPage });

function AvPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-ink">
      <p className="font-sans text-xs tracking-[0.2em] text-copper uppercase">
        AUTOMA Chem 2026 · For technical production
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold">How to run this talk</h1>
      <p className="mt-4 font-sans text-muted">
        Eduardo Sopalda · D&T Global Data Governance Lead · dsm-firmenich
        <br />
        Opening panel · 10 minutes · 26 October 2026 · Estrel Berlin
      </p>

      <h2 className="mt-10 font-display text-2xl">Preferred: the live deck</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 font-sans text-sm leading-relaxed">
        <li>
          Open Chrome or Edge (not Safari if you can avoid it) and go to the hosted URL on
          eduardosopalda.com.
        </li>
        <li>
          Press <kbd className="border border-ink/20 px-1">F</kbd> for fullscreen.
        </li>
        <li>
          Leave the title card up while the chair introduces Eduardo. A copper line draws the
          Brasília plan for ten seconds, then the city fades in at 38% opacity.
        </li>
        <li>
          Advance with <kbd className="border border-ink/20 px-1">Space</kbd> or a USB clicker
          (usually Page Down / Right). Back with Left.
        </li>
        <li>
          Speaker notes: <kbd className="border border-ink/20 px-1">N</kbd>. Timer starts on first
          advance.
        </li>
      </ol>
      <p className="mt-4 font-sans text-sm">
        Offline: open the <code>index</code> of the unzipped package in Chrome. No internet required
        once the folder is local, except Google Fonts — a system serif will substitute.
      </p>

      <h2 className="mt-10 font-display text-2xl">Fallback: PowerPoint</h2>
      <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
        If the venue cannot run a browser fullscreen, use the 15-slide PPTX in the same package.
        Same words, no animation. Advance on Eduardo’s clicks. 16:9 widescreen.{" "}
        <a href="/talk/Sopalda_AUTOMA_Chem_2026_FALLBACK.pptx" className="text-copper underline">
          Download the PPTX
        </a>
      </p>

      <h2 className="mt-10 font-display text-2xl">Do not</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 font-sans text-sm text-muted">
        <li>Play it as a video. He needs to pause.</li>
        <li>Show speaker notes on the house screen.</li>
        <li>Switch to presenter view that crops the 16:9 stage.</li>
      </ul>

      <p className="mt-12 font-sans text-sm">
        <Link to="/" className="text-copper underline">
          Open the talk
        </Link>
      </p>
    </main>
  );
}
