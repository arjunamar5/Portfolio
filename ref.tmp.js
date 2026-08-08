const { chromium } = require("playwright-core");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "C:/Users/ADMIN/AppData/Local/Temp/claude/d--Portfolio-arjun-amar-portfolio/5abe3a2d-8117-4ca6-8d3c-828a31580791/scratchpad";

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });

  // --- Site 1: aayushbharti.in (project/case-study reference) ---
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("https://aayushbharti.in", { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(2000);
    const height = await page.evaluate(() => document.body.scrollHeight);
    console.log("aayushbharti height:", height);
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), (height / steps) * i);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/ref-aayush-${i}.png` });
    }
    await page.close();
  } catch (e) {
    console.log("aayushbharti error:", e.message);
  }

  // --- Site 2: az-dev.vercel.app (color / clarity reference) ---
  try {
    const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page2.goto("https://az-dev.vercel.app/#home", { waitUntil: "networkidle", timeout: 45000 });
    await page2.waitForTimeout(2000);
    const height2 = await page2.evaluate(() => document.body.scrollHeight);
    console.log("az-dev height:", height2);
    const steps2 = 6;
    for (let i = 0; i < steps2; i++) {
      await page2.evaluate((y) => window.scrollTo(0, y), (height2 / steps2) * i);
      await page2.waitForTimeout(1000);
      await page2.screenshot({ path: `${OUT}/ref-azdev-${i}.png` });
    }
    await page2.close();
  } catch (e) {
    console.log("az-dev error:", e.message);
  }

  await browser.close();
})();
