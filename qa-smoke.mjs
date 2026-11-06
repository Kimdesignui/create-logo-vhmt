import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const appUrl = "http://127.0.0.1:4182/";
const outputDir = path.resolve("output/playwright");
const sampleLogo = path.resolve("../Tieu-hoc-Ngo-quyen-1-web.png");

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => consoleMessages.push(`${message.type()}: ${message.text()}`));
page.on("pageerror", (error) => consoleMessages.push(`pageerror: ${error.message}`));

try {
  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outputDir, "logo-composer-empty-page.png"),
    fullPage: true
  });
  await page.setInputFiles("#image-input", sampleLogo);
  await page.waitForFunction(() => document.querySelector(".crop-shell")?.classList.contains("has-image"), null, {
    timeout: 10000
  });
  await page.waitForTimeout(1200);
  const cropperClasses = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[class*="cropper"]')).map((element) => element.className)
  );
  await page.screenshot({
    path: path.join(outputDir, "logo-composer-after-upload-page.png"),
    fullPage: true
  });
  await page.fill("#bottom-text", "Tiểu học Ngô Quyền");
  await page.fill("#top-text", "Hệ thống thư viện số");
  await page.selectOption("#top-font-select", "utm-helve-bold");
  await page.selectOption("#bottom-font-select", "utm-helvetins");
  await page.click("#free-crop");
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(outputDir, "logo-composer-filled-page.png"),
    fullPage: true
  });
  await page.click("#square-crop");
  await page.waitForTimeout(200);

  const preview = await page.locator(".preview-root").screenshot({
    path: path.join(outputDir, "logo-composer-preview.png")
  });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click('[data-export="svg"]')
  ]);

  const downloadPath = path.join(outputDir, "logo-composer-export.svg");
  await download.saveAs(downloadPath);
  const exportedSvg = await fs.readFile(downloadPath, "utf8");

  const report = {
    hasPath: exportedSvg.includes("<path"),
    hasText: exportedSvg.includes("<text"),
    hasEmbeddedImage: exportedSvg.includes("data:image/png"),
    previewBytes: preview.byteLength,
    cropperClasses,
    consoleMessages
  };

  await fs.writeFile(path.join(outputDir, "qa-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await context.close();
  await browser.close();
}
