import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/weight")({ component: Study });

function Study() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-ink md:px-10">
      <p className="font-sans text-xs tracking-[0.2em] text-copper uppercase">
        Line weight · measured on this drawing
      </p>
      <h1 className="mt-4 max-w-3xl font-sans text-3xl font-medium tracking-tight md:text-4xl">
        Two hands. Two kinds of weight.
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
        The film sweeps left to right, so every line at the same place appears together. An
        architect does not draw that way. Weight decides what is the decision, and what is the
        accommodation.
      </p>

      <section className="mt-16">
        <h2 className="font-sans text-xl font-medium">Act I — pressure, not pen size</h2>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
          The sketch is about 34,000 marks. Seven in ten are one or two pixels wide. What changes
          is how hard the hand pressed. Same amount of ink in both frames.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <figure>
            <img src="/talk/weight/left-search.jpg" alt="Light pressure lines only" />
            <figcaption className="mt-2 font-sans text-sm">
              <span className="text-copper">Search.</span> Light lines first. The hand is still
              looking.
            </figcaption>
          </figure>
          <figure>
            <img src="/talk/weight/left-commit.jpg" alt="Dark committed strokes only" />
            <figcaption className="mt-2 font-sans text-sm">
              <span className="text-copper">Commit.</span> The dark stroke first. The idea is
              already decided.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-sans text-xl font-medium">Act II — the five weights</h2>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
          The plan is about 200,000 marks, six times the sketch. A quarter of them are fills —
          water, the wing — not lines. On a drafted sheet the order is fixed.
        </p>
        <ol className="mt-4 max-w-2xl list-decimal space-y-1 pl-5 font-sans text-sm text-ink">
          <li>Construction. The lightest. The grid. Drawn first, meant to recede.</li>
          <li>Profile. The outline you can read from the back of the room.</li>
          <li>Primary. Roads, water, the wing.</li>
          <li>Secondary. The blocks.</li>
          <li>Entourage. Trees, the small repeated circles. Last. This is the accommodation.</li>
        </ol>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <figure>
            <img src="/talk/weight/right-heavy.jpg" alt="Thick structure of the plan only" />
            <figcaption className="mt-2 font-sans text-sm">
              <span className="text-copper">Heavy first.</span> The city as a decision. Trees and
              the grid are still absent.
            </figcaption>
          </figure>
          <figure>
            <img src="/talk/weight/right-fine.jpg" alt="Thin marks of the plan only" />
            <figcaption className="mt-2 font-sans text-sm">
              <span className="text-copper">Fine first.</span> The noise before the decision. Wrong
              for the sentence.
            </figcaption>
          </figure>
        </div>
      </section>

      <p className="mt-16 max-w-2xl font-sans text-base leading-relaxed text-ink">
        If the line is “an idea taking shape,” Act I should search, then commit. If the next line
        is “reality has more to accommodate,” Act II should go heavy, then fine. The film does
        neither yet.
      </p>
      <p className="mt-6 font-sans text-sm">
        <Link to="/" className="text-copper underline">
          Back to the film
        </Link>
      </p>
    </main>
  );
}
