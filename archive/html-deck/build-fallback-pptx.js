const pptxgen = require("pptxgenjs");
const path = require("path");
const assets = path.join(__dirname, "assets");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Eduardo Sopalda";
pres.title = "From Brasília to the Plant Floor";
pres.subject = "AUTOMA Chem 2026 opening panel";

const VOID = "090B08";
const BONE = "F3EEE3";
const SAP = "C6D24A";
const MUTED = "9A917E";
const PAPER = "E7DFCF";

function cover(slide, img, opts = {}) {
  slide.addImage({ path: path.join(assets, img), x: 0, y: 0, w: "100%", h: "100%" });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color: VOID, transparency: opts.dark || 42 }
  });
}

function eyebrow(slide, text, y = 0.42) {
  slide.addText(text.toUpperCase(), {
    x: 0.7, y, w: 11.5, h: 0.32,
    fontFace: "Calibri", fontSize: 12, color: SAP, bold: true,
    charSpacing: 4
  });
}

const slides = [];

{
  const s = pres.addSlide();
  cover(s, "drawing.jpg", { dark: 50 });
  eyebrow(s, "AUTOMA Chem 2026  ·  Berlin  ·  26 October  ·  Opening panel");
  s.addText("From Brasília\nto the Plant Floor", {
    x: 0.7, y: 2.3, w: 11, h: 2.4,
    fontFace: "Georgia", fontSize: 44, color: BONE, italic: false
  });
  s.addText("People, Data and AI in Sustainable Digital Transformation", {
    x: 0.7, y: 4.8, w: 10, h: 0.4, fontFace: "Georgia", fontSize: 16, color: PAPER, italic: true
  });
  s.addText("Eduardo Sopalda  ·  Global Data Governance Lead  ·  dsm-firmenich", {
    x: 0.7, y: 6.4, w: 12, h: 0.3, fontFace: "Calibri", fontSize: 14, color: MUTED
  });
}

{
  const s = pres.addSlide(); s.addShape(pres.shapes.RECTANGLE, { x:0,y:0,w:"100%",h:"100%", fill:{color:VOID}});
  eyebrow(s, "01  ·  The architect");
  s.addText("I am an architect.\nNot as a metaphor.", {
    x: 0.7, y: 1.8, w: 12, h: 2.4, fontFace: "Georgia", fontSize: 40, color: BONE
  });
  s.addText("I studied architecture. I drew buildings. Then I spent twenty years designing something else: the ethereal structures around data.", {
    x: 0.7, y: 4.4, w: 10, h: 1.4, fontFace: "Calibri", fontSize: 18, color: PAPER
  });
}

{
  const s = pres.addSlide();
  cover(s, "drawing.jpg", { dark: 48 });
  eyebrow(s, "The same problem");
  s.addText("We design for the drawing, not for the person who has to live with it.", {
    x: 0.7, y: 2.4, w: 11.5, h: 2.2, fontFace: "Georgia", fontSize: 32, color: BONE
  });
  s.addText("I am not here to sell you a framework this morning.", {
    x: 0.7, y: 5.0, w: 10, h: 0.6, fontFace: "Georgia", fontSize: 20, color: PAPER, italic: true
  });
}

{
  const s = pres.addSlide();
  cover(s, "aerial.jpg", { dark: 38 });
  eyebrow(s, "02  ·  Brasília  ·  Jan Gehl");
  s.addText("Beautiful from above.", {
    x: 0.7, y: 4.6, w: 12, h: 1.0, fontFace: "Georgia", fontSize: 36, color: BONE
  });
  s.addText("A city can make perfect sense from a helicopter and feel completely different when you walk through it.", {
    x: 0.7, y: 5.7, w: 11, h: 0.8, fontFace: "Calibri", fontSize: 16, color: PAPER
  });
}

{
  const s = pres.addSlide();
  cover(s, "street.jpg", { dark: 35 });
  eyebrow(s, "At street level");
  s.addText("The city was finished.", {
    x: 0.7, y: 4.4, w: 12, h: 0.8, fontFace: "Georgia", fontSize: 36, color: BONE
  });
  s.addText("It just was not designed around the people who had to live and work in it.", {
    x: 0.7, y: 5.3, w: 11, h: 1.0, fontFace: "Georgia", fontSize: 20, color: PAPER, italic: true
  });
}

{
  const s = pres.addSlide();
  cover(s, "plant.jpg", { dark: 40 });
  eyebrow(s, "03  ·  When the drawing meets the ground");
  s.addText("Seen from above,\neverything looks complete.", {
    x: 0.7, y: 3.8, w: 12, h: 1.6, fontFace: "Georgia", fontSize: 32, color: BONE
  });
  s.addText("Then the framework reaches the plant.", {
    x: 0.7, y: 5.6, w: 11, h: 0.5, fontFace: "Calibri", fontSize: 18, color: PAPER
  });
}

{
  const s = pres.addSlide(); s.addShape(pres.shapes.RECTANGLE, { x:0,y:0,w:"100%",h:"100%", fill:{color:VOID}});
  eyebrow(s, "I have been the person with the beautiful drawing");
  s.addText("I had built them a plaza nobody wanted to stand in.", {
    x: 0.7, y: 2.2, w: 12, h: 1.8, fontFace: "Georgia", fontSize: 32, color: BONE
  });
  s.addText("So I stopped asking whether the framework was complete. I became interested in whether people actually used it.", {
    x: 0.7, y: 4.4, w: 11, h: 1.2, fontFace: "Calibri", fontSize: 18, color: PAPER
  });
}

{
  const s = pres.addSlide(); s.addShape(pres.shapes.RECTANGLE, { x:0,y:0,w:"100%",h:"100%", fill:{color:VOID}});
  eyebrow(s, "04  ·  Sustainability has the same problem");
  s.addText("AMBITION", { x: 0.7, y: 1.5, w: 5.5, h: 0.3, fontFace: "Calibri", fontSize: 12, color: SAP, bold: true, charSpacing: 3 });
  s.addText("Targets\nRoadmaps\nCommitments", { x: 0.7, y: 1.9, w: 5.5, h: 2.0, fontFace: "Georgia", fontSize: 24, color: BONE });
  s.addText("EVIDENCE", { x: 7.0, y: 1.5, w: 5.5, h: 0.3, fontFace: "Calibri", fontSize: 12, color: SAP, bold: true, charSpacing: 3 });
  s.addText("Definitions\nOwnership\nLineage", { x: 7.0, y: 1.9, w: 5.5, h: 2.0, fontFace: "Georgia", fontSize: 24, color: BONE });
  s.addText("Eventually the ambition has to become evidence.", {
    x: 0.7, y: 5.2, w: 12, h: 0.8, fontFace: "Georgia", fontSize: 22, color: PAPER, italic: true
  });
}

{
  const s = pres.addSlide();
  cover(s, "carbon.jpg", { dark: 46 });
  eyebrow(s, "05  ·  The carbon number");
  s.addText("CO₂e", { x: 0.7, y: 1.6, w: 12, h: 1.6, fontFace: "Georgia", fontSize: 72, color: SAP });
  s.addText("A carbon number looks like chemistry. It is a data product.", {
    x: 0.7, y: 3.4, w: 11, h: 0.7, fontFace: "Calibri", fontSize: 18, color: PAPER
  });
  s.addText("You cannot report what you cannot trace.", {
    x: 0.7, y: 5.4, w: 11, h: 0.7, fontFace: "Georgia", fontSize: 22, color: BONE, italic: true
  });
}

{
  const s = pres.addSlide(); s.addShape(pres.shapes.RECTANGLE, { x:0,y:0,w:"100%",h:"100%", fill:{color:VOID}});
  eyebrow(s, "06  ·  Then someone says");
  s.addText("Why don’t we just use AI?", {
    x: 0.7, y: 1.6, w: 12, h: 1.1, fontFace: "Georgia", fontSize: 32, color: BONE
  });
  s.addText("batch     lot     campaign     shift     tank     order     recipe     day", {
    x: 0.7, y: 3.2, w: 12, h: 0.6, fontFace: "Georgia", fontSize: 20, color: MUTED
  });
  s.addText("Five people. One word. Eight different things.\nPutting an agent on top of ambiguity does not remove the problem. It scales it up.", {
    x: 0.7, y: 4.4, w: 11.5, h: 1.4, fontFace: "Calibri", fontSize: 18, color: PAPER
  });
}

{
  const s = pres.addSlide();
  cover(s, "docs.jpg", { dark: 40 });
  eyebrow(s, "One agent project I saw");
  s.addText("10 000", { x: 0.7, y: 2.2, w: 5.5, h: 1.3, fontFace: "Georgia", fontSize: 48, color: BONE });
  s.addText("documents in", { x: 0.7, y: 3.5, w: 5.5, h: 0.35, fontFace: "Calibri", fontSize: 14, color: MUTED });
  s.addText("2 000", { x: 6.5, y: 2.2, w: 5.5, h: 1.3, fontFace: "Georgia", fontSize: 48, color: SAP });
  s.addText("actually relevant", { x: 6.5, y: 3.5, w: 5.5, h: 0.35, fontFace: "Calibri", fontSize: 14, color: MUTED });
  s.addText("All of it embedded. All of it consuming tokens and energy.", {
    x: 0.7, y: 5.4, w: 12, h: 0.5, fontFace: "Calibri", fontSize: 16, color: PAPER
  });
}

{
  const s = pres.addSlide();
  cover(s, "city.jpg", { dark: 38 });
  eyebrow(s, "07  ·  The road to the shiny city");
  s.addText("We do not get there\nby teleportation.", {
    x: 0.7, y: 2.8, w: 12, h: 1.6, fontFace: "Georgia", fontSize: 34, color: BONE
  });
  s.addText("DEFINITIONS   ·   OWNERSHIP   ·   LINEAGE   ·   QUALITY   ·   CONTEXT", {
    x: 0.7, y: 5.6, w: 12, h: 0.4, fontFace: "Calibri", fontSize: 13, color: SAP, bold: true
  });
}

{
  const s = pres.addSlide();
  cover(s, "plant.jpg", { dark: 42 });
  eyebrow(s, "08  ·  Back at ground level");
  s.addText("A digital twin is still a plan.", {
    x: 0.7, y: 3.6, w: 12, h: 0.8, fontFace: "Georgia", fontSize: 30, color: BONE
  });
  s.addText("It only becomes sustainable, in both senses, when the operator on the night shift trusts what it tells them.", {
    x: 0.7, y: 4.6, w: 11.5, h: 1.2, fontFace: "Georgia", fontSize: 18, color: PAPER, italic: true
  });
}

{
  const s = pres.addSlide(); s.addShape(pres.shapes.RECTANGLE, { x:0,y:0,w:"100%",h:"100%", fill:{color:VOID}});
  eyebrow(s, "The principle");
  s.addText("Agents do not own risk.\nHumans do.\nAlways.", {
    x: 0.7, y: 2.1, w: 12, h: 3.2, fontFace: "Georgia", fontSize: 40, color: BONE
  });
}

{
  const s = pres.addSlide();
  cover(s, "aerial.jpg", { dark: 40 });
  eyebrow(s, "09  ·  Back to Brasília");
  s.addText("Still beautiful from the air.", {
    x: 0.7, y: 4.4, w: 12, h: 0.8, fontFace: "Georgia", fontSize: 32, color: BONE
  });
  s.addText("The drawing was superb. The problem was the distance.", {
    x: 0.7, y: 5.3, w: 12, h: 0.7, fontFace: "Georgia", fontSize: 18, color: PAPER, italic: true
  });
}

{
  const s = pres.addSlide(); s.addShape(pres.shapes.RECTANGLE, { x:0,y:0,w:"100%",h:"100%", fill:{color:VOID}});
  eyebrow(s, "10  ·  Ask it at lunch");
  s.addText("What is one word in your organisation that means something different depending on which floor you are standing on?", {
    x: 0.7, y: 1.8, w: 12, h: 2.6, fontFace: "Georgia", fontSize: 28, color: BONE
  });
  s.addText("You may discover that the answer tells you more about your governance than another hundred-page framework ever could.", {
    x: 0.7, y: 4.8, w: 11.5, h: 1.0, fontFace: "Calibri", fontSize: 16, color: PAPER
  });
}

{
  const s = pres.addSlide();
  cover(s, "drawing.jpg", { dark: 52 });
  eyebrow(s, "Thank you");
  s.addText("Eduardo Sopalda", {
    x: 0.7, y: 2.6, w: 12, h: 1.0, fontFace: "Georgia", fontSize: 40, color: BONE
  });
  s.addText("Global Data Governance Lead  ·  dsm-firmenich", {
    x: 0.7, y: 3.7, w: 12, h: 0.4, fontFace: "Calibri", fontSize: 16, color: PAPER
  });
  s.addText("eduardosopalda.com", {
    x: 0.7, y: 5.6, w: 12, h: 0.4, fontFace: "Calibri", fontSize: 16, color: SAP
  });
}

pres.writeFile({ fileName: path.join(__dirname, "Sopalda_Brasilia_FALLBACK.pptx") })
  .then(() => console.log("wrote fallback pptx"))
  .catch((e) => { console.error(e); process.exit(1); });
