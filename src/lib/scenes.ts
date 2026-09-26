export type SceneAge =
  | "paper"
  | "ink"
  | "city"
  | "plant"
  | "void"
  | "carbon"
  | "docs"
  | "road"
  | "return"
  | "close";

export type Scene = {
  id: string;
  act: string;
  slide: number;
  age: SceneAge;
  label: string;
  line: string;
  html: "title" | "line" | "split" | "batch" | "docs" | "road" | "carbon" | "question" | "thanks";
  kicker?: string;
  sub?: string;
  quote?: string;
  left?: { title: string; items: string[] };
  right?: { title: string; items: string[] };
  cue: string;
};

/** 16 beats on stage. PPTX collapses to 15 slides (title + 14 + thanks). */
export const SCENES: Scene[] = [
  {
    id: "title",
    act: "0",
    slide: 1,
    age: "paper",
    label: "Hold",
    html: "title",
    line: "Digitalisation, Sustainability & the Future of Chemicals",
    kicker: "AUTOMA Chem 2026 · Berlin · Opening panel",
    sub: "From Brasília to the Plant Floor",
    quote: "People, Data and AI in Sustainable Digital Transformation",
    cue: "HOLD. Do not speak. Chair introduces you. Copper line draws for 10s, city glaze at 38%. First spoken line is Act 01.",
  },
  {
    id: "architect",
    act: "1",
    slide: 2,
    age: "paper",
    label: "Act 01  The architect",
    html: "line",
    kicker: "Act 01 · The architect",
    line: "I am an architect. Not as a metaphor.",
    sub: "I studied architecture. I drew buildings. Then I spent the last twenty years designing something else: data and AI governance.",
    quote: "We design from above, not for the person who has to live with it.",
    cue: "0:05–1:10  Speak the approved text. Land on: we design from above.",
  },
  {
    id: "framework",
    act: "1",
    slide: 3,
    age: "plant",
    label: "Act 01  Ground level",
    html: "line",
    kicker: "Act 01",
    line: "I am not here to sell you a framework this morning.",
    sub: "I work inside a chemical company, like many of you, and I have got plenty of these things wrong myself.",
    quote: "The distance between the beautiful plan and what actually happens at ground level.",
    cue: "Hold half a beat. Then the chemical-company confession. Do not rush it.",
  },
  {
    id: "brasilia",
    act: "2",
    slide: 4,
    age: "ink",
    label: "Act 02  Brasília",
    html: "line",
    kicker: "Act 02 · Brasília",
    line: "Let me take you to Brasília.",
    sub: "Plans drawn by people looking down from above, then dropped onto the ground. Jan Gehl called it the Brasília Syndrome.",
    cue: "Artefact only. Lúcio Costa. Niemeyer. Syndrome. Then leave.",
  },
  {
    id: "above",
    act: "2",
    slide: 4,
    age: "city",
    label: "Act 02  From the air",
    html: "line",
    kicker: "Act 02 · From the air",
    line: "Beautiful from above.",
    sub: "A city can make perfect sense from a helicopter and feel completely different when you walk through it.",
    quote: "A plan can be beautiful and still fail to account for the experience of the person standing inside it.",
    cue: "The overlay is the point. Do not explain the picture.",
  },
  {
    id: "finished",
    act: "2",
    slide: 5,
    age: "city",
    label: "Act 02  Street level",
    html: "line",
    kicker: "Act 02 · Street level",
    line: "The city was finished.",
    quote: "It just was not designed around the people who had to live and work in it.",
    cue: "The builders who could not live there. Then leave Brasília.",
  },
  {
    id: "plant",
    act: "3",
    slide: 6,
    age: "plant",
    label: "Act 03  The plant",
    html: "line",
    kicker: "Act 03 · When the drawing meets the ground",
    line: "Seen from above, everything looks complete.",
    sub: "Then the framework reaches the plant.",
    cue: "Policies, RACI, auditor’s chair. Slow down on ‘Then the framework reaches the plant.’",
  },
  {
    id: "plaza",
    act: "3",
    slide: 7,
    age: "void",
    label: "Act 03  The plaza",
    html: "line",
    kicker: "Act 03",
    line: "I had built them a plaza nobody wanted to stand in.",
    sub: "So I stopped being interested only in whether a framework was complete. I became much more interested in whether people actually used it.",
    cue: "They were not being difficult. Most honest line. Do not hurry it.",
  },
  {
    id: "sustain",
    act: "4",
    slide: 8,
    age: "void",
    label: "Act 04  Sustainability",
    html: "split",
    kicker: "Act 04 · Sustainability has the same problem",
    line: "People. Planet. Progress.",
    sub: "The ambition may be global, but the data that makes that ambition measurable is created across businesses, processes, systems, suppliers and people.",
    left: { title: "Designed from above", items: ["Ambitions", "Targets", "Roadmaps"] },
    right: {
      title: "Has to become evidence",
      items: ["Where did it come from?", "Who owns it?", "What definition sits behind it?"],
    },
    cue: "Approved text only. Ambition has to become evidence. Who will stand behind it?",
  },
  {
    id: "carbon",
    act: "5",
    slide: 9,
    age: "carbon",
    label: "Act 05  The carbon number",
    html: "carbon",
    kicker: "Act 05 · The carbon number",
    line: "A carbon number looks like chemistry. It is not.",
    sub: "Supplier declarations. Energy meters. Batch records. Transport data. Allocation rules. A collection of assumptions.",
    quote: "You cannot report what you cannot trace.",
    cue: "4:20–5:30  The challenge is explaining the number. Last line, slow.",
  },
  {
    id: "ai",
    act: "6",
    slide: 10,
    age: "void",
    label: "Act 06  Why not just AI",
    html: "batch",
    kicker: "Act 06 · Then someone says",
    line: "Why don’t we just use AI?",
    sub: "Five people in an organisation use the word batch to mean eight different things. Putting an AI agent on top of that ambiguity does not remove the problem. It can simply scale it up.",
    cue: "Optimistic. Not the frightened speech.",
  },
  {
    id: "docs",
    act: "6",
    slide: 11,
    age: "docs",
    label: "Act 06  Ten thousand documents",
    html: "docs",
    kicker: "Act 06 · One agent project I saw",
    line: "10 000 went in. 2 000 were relevant.",
    sub: "Duplicates, superseded drafts, or the same deck sitting under four different filenames. All of it was embedded. All of it was consuming tokens and energy.",
    cue: "Filtering before you embed is governance, cost and sustainability at the same time.",
  },
  {
    id: "road",
    act: "7",
    slide: 12,
    age: "road",
    label: "Act 07  The shiny city",
    html: "road",
    kicker: "Act 07 · The road to the shiny city",
    line: "We do not get there by teleportation.",
    sub: "The road is paved with definitions, ownership, lineage, quality and context.",
    cue: "Otherwise we have built another Brasília.",
  },
  {
    id: "twin",
    act: "8",
    slide: 13,
    age: "plant",
    label: "Act 08  The night shift",
    html: "line",
    kicker: "Act 08 · Back at ground level",
    line: "A digital twin is still a plan.",
    quote: "It only becomes sustainable, in both senses, when the operator on the night shift trusts what it tells them.",
    cue: "Affection for the twin, not sarcasm.",
  },
  {
    id: "agents",
    act: "8",
    slide: 14,
    age: "void",
    label: "Act 08  The principle",
    html: "line",
    kicker: "Act 08 · The principle",
    line: "Agents do not own risk. Humans do. Always.",
    sub: "They do not carry accountability.",
    cue: "The line the panel will pick up. Say it. Stop. Do not explain it.",
  },
  {
    id: "return",
    act: "9",
    slide: 15,
    age: "return",
    label: "Act 09  Back to Brasília",
    html: "line",
    kicker: "Act 09 · Back to Brasília",
    line: "Still beautiful from the air.",
    sub: "Still very different at street level. The real question is whether we can build this without losing the people who have to make it work.",
    cue: "Analogy only. I think we can. It is worth doing.",
  },
  {
    id: "question",
    act: "9",
    slide: 15,
    age: "void",
    label: "Act 09  The question",
    html: "question",
    kicker: "Ask it at lunch",
    line: "What is one word in your organisation that means something different depending on which floor you are standing on?",
    sub: "You may discover that the answer tells you more about your governance than another hundred pages of framework ever could.",
    cue: "9:30–10:00  Ask it. Leave it hanging. Then thank you.",
  },
  {
    id: "thanks",
    act: "9",
    slide: 15,
    age: "close",
    label: "Hold for panel",
    html: "thanks",
    kicker: "Thank you",
    line: "Eduardo Sopalda",
    sub: "D&T Global Data Governance Lead · dsm-firmenich",
    quote: "eduardosopalda.com",
    cue: "10:00  Leave this up. Sit down.",
  },
];

export const SLIDE_COUNT = 15;
