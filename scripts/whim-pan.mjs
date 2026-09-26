import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('https://whimsical.com/automa-chem-from-brasilia-to-the-plant-floor-9-act-visual-roadma-LiawEE3cD2n6G4TEBgGUKB', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(4000);
await page.keyboard.press('1'); // zoom to content
await page.waitForTimeout(600);
await page.keyboard.press('7'); // 70%
await page.waitForTimeout(800);
const box = await page.locator('canvas').first().boundingBox();
console.log('canvas', box);

async function pan(dx, dy=0) {
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width/2 + dx, box.y + box.height/2 + dy, { steps: 16 });
  await page.mouse.up();
  await page.waitForTimeout(350);
}
async function shot(name) {
  await page.screenshot({ path: `/workspace/screenshots/${name}` });
  console.log('saved', name);
}

// pan to far left
for (let i=0;i<8;i++) await pan(-900);
await shot('whim-left.png');
for (let i=0;i<12;i++) {
  await shot(`whim-col-${String(i).padStart(2,'0')}.png`);
  await pan(650);
}
await browser.close();
