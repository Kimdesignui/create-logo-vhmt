import "./styles.css";
import opentype from "opentype.js";
import { HSStaticMethods } from "preline/non-auto";

const SVG_NS = "http://www.w3.org/2000/svg";
const FONT_CATALOG = {
  "utm-helve": { label: "UTM Helve", file: "utm-helve.ttf", family: "UTMHelve" },
  "utm-helve-bold": { label: "UTM Helve Bold", file: "utm-helve-bold.ttf", family: "UTMHelveBold" },
  "utm-helvetins": { label: "UTM HelvetIns", file: "utm-helvetins.ttf", family: "UTMHelvetIns" },
  "be-vietnam-pro": { label: "Be Vietnam Pro", family: "Be Vietnam Pro", google: true },
  roboto: { label: "Roboto", family: "Roboto", google: true },
  "noto-sans": { label: "Noto Sans", family: "Noto Sans", google: true },
  system: { label: "Segoe UI / Arial", family: "Segoe UI, Arial, sans-serif", system: true }
};

const ui = {
  imageInput: document.querySelector("#image-input"),
  sourceImage: document.querySelector("#source-image"),
  sourcePlaceholder: document.querySelector("#source-placeholder"),
  previewRoot: document.querySelector("#preview-root"),
  previewFrame: document.querySelector("#preview-frame"),
  textInput: document.querySelector("#text-input"),
  secondaryText: document.querySelector("#secondary-text"),
  textColor: document.querySelector("#text-color"),
  secondaryColor: document.querySelector("#secondary-color"),
  fontSize: document.querySelector("#font-size"),
  fontSizeOutput: document.querySelector("#font-size-output"),
  secondarySize: document.querySelector("#secondary-size"),
  secondarySizeOutput: document.querySelector("#secondary-size-output"),
  fontSelect: document.querySelector("#font-select"),
  secondaryFontSelect: document.querySelector("#secondary-font-select"),
  preserveOriginalLogo: document.querySelector("#preserve-original-logo"),
  uppercase: document.querySelector("#uppercase-text"),
  gap: document.querySelector("#text-gap"),
  gapOutput: document.querySelector("#gap-output"),
  logoSize: document.querySelector("#logo-size"),
  markWidthValue: document.querySelector("#mark-width-value"),
  markHeightValue: document.querySelector("#mark-height-value"),
  markLockRatio: document.querySelector("#mark-lock-ratio"),
  logoWidth: document.querySelector("#logo-width"),
  logoHeight: document.querySelector("#logo-height"),
  layoutWidthOutput: document.querySelector("#layout-width-output"),
  layoutHeightOutput: document.querySelector("#layout-height-output"),
  paddingTop: document.querySelector("#padding-top"),
  paddingRight: document.querySelector("#padding-right"),
  paddingBottom: document.querySelector("#padding-bottom"),
  paddingLeft: document.querySelector("#padding-left"),
  paddingLock: document.querySelector("#padding-lock"),
  settingsValidation: document.querySelector("#settings-validation"),
  wrapText: document.querySelector("#wrap-text"),
  exportWidth: document.querySelector("#export-width"),
  exportHeight: document.querySelector("#export-height"),
  canvasSizeLabel: document.querySelector("#canvas-size-label"),
  removeBg: document.querySelector("#remove-bg"),
  enhance: document.querySelector("#enhance-image"),
  aiNote: document.querySelector("#ai-note"),
  status: document.querySelector("#processing-status"),
  exportButton: document.querySelector("#export-button"),
  reset: document.querySelector("#reset-all"),
  formatOptions: Array.from(document.querySelectorAll(".format-option")),
  presets: Array.from(document.querySelectorAll("[data-size]"))
};

const state = {
  imageName: "logo-studio",
  originalDataUrl: "",
  workingDataUrl: "",
  image: null,
  font: null,
  fonts: { primary: null, secondary: null },
  fontKeys: { primary: "utm-helve-bold", secondary: "utm-helve-bold" },
  selectedFormat: "png",
  hasRemovedBackground: false,
  hasEnhanced: false,
  preserveOriginalLogo: false,
  layoutInitialized: false,
  markInitialized: false
};

const fontStyle = document.createElement("style");
document.head.appendChild(fontStyle);

bootstrap();

async function bootstrap() {
  bindEvents();
  ui.fontSelect.value = "utm-helve-bold";
  ui.secondaryFontSelect.value = "utm-helve-bold";
  await Promise.all([loadFont("utm-helve-bold", "primary"), loadFont("utm-helve-bold", "secondary")]);
  await loadSampleLogo();
  HSStaticMethods.autoInit();
  render();
}

function bindEvents() {
  ui.imageInput.addEventListener("change", handleImageUpload);
  [ui.textInput, ui.secondaryText, ui.textColor, ui.secondaryColor, ui.fontSize, ui.secondarySize, ui.gap, ui.uppercase, ui.wrapText].forEach((control) => control.addEventListener("input", render));
  [ui.paddingTop, ui.paddingRight, ui.paddingBottom, ui.paddingLeft].forEach((control) => control.addEventListener("input", () => {
    if (ui.paddingLock.checked) {
      [ui.paddingTop, ui.paddingRight, ui.paddingBottom, ui.paddingLeft].forEach((padding) => {
        if (padding !== control) padding.value = control.value;
      });
    }
    render();
  }));
  ui.markWidthValue.addEventListener("input", () => {
    if (ui.markLockRatio.checked && state.image && isPositiveInteger(ui.markWidthValue.value)) ui.markHeightValue.value = String(Math.max(1, Math.round(Number(ui.markWidthValue.value) / getImageAspectRatio())));
    render();
  });
  ui.markHeightValue.addEventListener("input", () => {
    if (ui.markLockRatio.checked && state.image && isPositiveInteger(ui.markHeightValue.value)) ui.markWidthValue.value = String(Math.max(1, Math.round(Number(ui.markHeightValue.value) * getImageAspectRatio())));
    render();
  });
  ui.preserveOriginalLogo.addEventListener("change", () => {
    state.preserveOriginalLogo = ui.preserveOriginalLogo.checked;
    render();
  });
  ui.fontSelect.addEventListener("change", async () => {
    await loadFont(ui.fontSelect.value, "primary");
    render();
  });
  ui.secondaryFontSelect.addEventListener("change", async () => {
    await loadFont(ui.secondaryFontSelect.value, "secondary");
    render();
  });
  ui.gap.addEventListener("input", render);
  ui.removeBg.addEventListener("click", removeOuterWhiteBackground);
  ui.enhance.addEventListener("click", enhanceImage);
  ui.exportButton.addEventListener("click", exportFile);
  ui.reset.addEventListener("click", resetAll);
  ui.presets.forEach((button) => button.addEventListener("click", () => {
    const [width, height] = button.dataset.size.split("x");
    ui.exportWidth.value = width;
    ui.exportHeight.value = height;
    ui.presets.forEach((item) => item.classList.toggle("is-active", item === button));
    render();
  }));
  ui.formatOptions.forEach((option) => option.addEventListener("click", () => {
    const input = option.querySelector("input");
    state.selectedFormat = input.value;
    ui.formatOptions.forEach((item) => item.classList.toggle("is-selected", item === option));
  }));
}

async function loadSampleLogo() {
  try {
    const response = await fetch("/assets/logo-bvdk-moc-chau-short.svg");
    if (!response.ok) return;
    const svg = await response.text();
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    setLogo(dataUrl, "logo-bvdk-moc-chau-short");
  } catch {
    setStatus("Sẵn sàng");
  }
}

async function handleImageUpload(event) {
  const [file] = event.target.files || [];
  if (!file) return;
  const dataUrl = sanitizeImportedSvg(await readFileAsDataUrl(file));
  state.imageName = sanitizeFileName(file.name.replace(/\.[^.]+$/, "")) || "logo-studio";
  setLogo(dataUrl, state.imageName);
  setStatus("Đã tải logo");
}

function sanitizeImportedSvg(dataUrl) {
  if (!dataUrl.startsWith("data:image/svg+xml")) return dataUrl;
  try {
    const source = decodeDataUrlText(dataUrl);
    const hasOverprint = /fill\s*=\s*["']#d93fcc["']/i.test(source) && /fill\s*=\s*["']#173b8f["']/i.test(source);
    if (!hasOverprint) return dataUrl;
    const cleaned = source.replace(/<path\b(?=[^>]*\bfill\s*=\s*["']#d93fcc["'])[^>]*\/?>/gi, "");
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleaned)}`;
  } catch {
    return dataUrl;
  }
}

function setLogo(dataUrl, name) {
  state.imageName = name || state.imageName;
  state.originalDataUrl = dataUrl;
  state.workingDataUrl = dataUrl;
  state.hasRemovedBackground = false;
  state.hasEnhanced = false;
  state.layoutInitialized = false;
  state.markInitialized = false;
  loadImage(dataUrl).then((image) => {
    state.image = image;
    const aspectRatio = getSourceAspectRatio(dataUrl) || (image.naturalWidth || image.width) / (image.naturalHeight || image.height);
    const autoPreserve = name !== "logo-thpt-thao-nguyen" && aspectRatio >= 2.2;
    state.preserveOriginalLogo = autoPreserve;
    ui.preserveOriginalLogo.checked = autoPreserve;
    ui.sourceImage.src = dataUrl;
    ui.sourceImage.hidden = false;
    ui.sourcePlaceholder.hidden = true;
    render();
  });
}

async function loadFont(key, slot = "primary") {
  const descriptor = FONT_CATALOG[key] || FONT_CATALOG["utm-helve-bold"];
  state.fontKeys[slot] = key;
  if (descriptor.google || descriptor.system) {
    state.fonts[slot] = null;
    if (descriptor.google) {
      await document.fonts.load(`600 16px "${descriptor.family}"`, "Tiếng Việt Á Â Đ Ê Ô Ơ Ư");
    }
    return;
  }
  try {
    const response = await fetch(`/assets/fonts/${descriptor.file}`);
    if (!response.ok) throw new Error("Font asset not found");
    const buffer = await response.arrayBuffer();
    state.fonts[slot] = opentype.parse(buffer.slice(0));
    const url = URL.createObjectURL(new Blob([buffer], { type: "font/ttf" }));
    fontStyle.textContent = `@font-face{font-family:"${descriptor.family}";src:url("${url}") format("truetype");font-display:swap;}`;
  } catch {
    state.fonts[slot] = null;
    fontStyle.textContent = "";
  }
}

async function removeOuterWhiteBackground() {
  if (!state.workingDataUrl) return setStatus("Hãy chọn logo trước", "warning");
  setStatus("Đang tách nền…");
  const image = await loadImage(state.workingDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = pixels;
  const queue = [];
  const seen = new Uint8Array(width * height);
  const threshold = 246;
  const enqueue = (x, y) => {
    const index = y * width + x;
    if (seen[index]) return;
    const offset = index * 4;
    if (data[offset] >= threshold && data[offset + 1] >= threshold && data[offset + 2] >= threshold && data[offset + 3] > 0) {
      seen[index] = 1;
      queue.push(index);
    }
  };
  for (let x = 0; x < width; x += 1) { enqueue(x, 0); enqueue(x, height - 1); }
  for (let y = 0; y < height; y += 1) { enqueue(0, y); enqueue(width - 1, y); }
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor];
    data[index * 4 + 3] = 0;
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueue(x - 1, y);
    if (x < width - 1) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y < height - 1) enqueue(x, y + 1);
  }
  context.putImageData(pixels, 0, 0);
  state.workingDataUrl = canvas.toDataURL("image/png");
  state.hasRemovedBackground = true;
  ui.sourceImage.src = state.workingDataUrl;
  setStatus("Đã tách nền", "ready");
  ui.aiNote.textContent = "Nền trắng liên thông phía ngoài đã được chuyển thành trong suốt; vùng trắng bên trong được giữ lại.";
  render();
}

async function enhanceImage() {
  if (!state.workingDataUrl) return setStatus("Hãy chọn logo trước", "warning");
  setStatus("Đang tăng nét…");
  const image = await loadImage(state.workingDataUrl);
  const canvas = document.createElement("canvas");
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.max(1, 1600 / sourceWidth, 900 / sourceHeight);
  canvas.width = Math.round(sourceWidth * scale);
  canvas.height = Math.round(sourceHeight * scale);
  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.filter = "contrast(1.12) saturate(1.06)";
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  state.workingDataUrl = canvas.toDataURL("image/png");
  state.hasEnhanced = true;
  ui.sourceImage.src = state.workingDataUrl;
  setStatus("Đã tăng nét", "ready");
  ui.aiNote.textContent = "Đã tăng độ tương phản, độ bão hòa và độ phân giải bằng xử lý cục bộ.";
  render();
}

function render() {
  if (state.image && !state.markInitialized) {
    ui.markWidthValue.value = "360";
    ui.markHeightValue.value = String(Math.max(0, Math.round(360 / getImageAspectRatio())));
    state.markInitialized = true;
  }
  const layout = computeLayout();
  const width = layout.canvasWidth;
  const height = layout.canvasHeight;
  const fontSize = Math.max(1, Number(ui.fontSize.value) || 1);
  const secondarySize = Math.max(1, Number(ui.secondarySize.value) || 1);
  const gap = Number(ui.gap.value) || 0;
  const logoSize = Number(ui.logoSize.value) || 72;
  ui.fontSizeOutput.value = String(fontSize);
  ui.secondarySizeOutput.value = String(secondarySize);
  ui.gapOutput.value = String(gap);
  ui.logoWidth.value = String(layout.markWidth);
  ui.logoHeight.value = String(layout.markHeight);
  const contentWidth = layout.canvasWidth - (Number(ui.paddingLeft.value) || 0) - (Number(ui.paddingRight.value) || 0);
  const contentHeight = layout.canvasHeight - (Number(ui.paddingTop.value) || 0) - (Number(ui.paddingBottom.value) || 0);
  ui.layoutWidthOutput.textContent = String(width);
  ui.layoutHeightOutput.textContent = String(height);
  validateSettings();
  ui.exportWidth.value = String(width);
  ui.exportHeight.value = String(height);
  ui.canvasSizeLabel.textContent = `${width} × ${height} px`;
  ui.previewRoot.classList.toggle("empty-preview", !state.workingDataUrl);
  ui.previewRoot.classList.toggle("preserve-original", state.preserveOriginalLogo);
  if (!state.workingDataUrl) return;
  const frameWidth = Math.max(1, ui.previewFrame.clientWidth - 48);
  const frameHeight = Math.max(1, ui.previewFrame.clientHeight - 48);
  const previewScale = Math.min(frameWidth / width, frameHeight / height);
  const previewWidth = Math.max(1, width * previewScale);
  const previewHeight = Math.max(1, height * previewScale);
  ui.previewRoot.style.width = `${previewWidth}px`;
  ui.previewRoot.style.height = `${previewHeight}px`;
  ui.previewRoot.style.minHeight = `${previewHeight}px`;
  ui.previewRoot.style.padding = "0";
  ui.previewRoot.style.gap = `${layout.gap * previewScale}px`;
  ui.previewRoot.replaceChildren();
  ui.previewRoot.classList.remove("empty-preview");
  const composite = document.createElement("img");
  composite.className = "preview-composite";
  composite.alt = "Bản xem trước logo và text";
  composite.style.width = `${previewWidth}px`;
  composite.style.height = `${previewHeight}px`;
  composite.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildExportSvg(width, height, layout))}`;
  ui.previewRoot.append(composite);
}

function getText() {
  const value = ui.textInput.value.trim() || "TEXT CỦA BẠN";
  return ui.uppercase.checked ? value.toLocaleUpperCase("vi-VN") : value;
}

function getSecondaryText() {
  const value = ui.secondaryText.value.trim();
  return ui.uppercase.checked ? value.toLocaleUpperCase("vi-VN") : value;
}

function stripDiacritics(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[Đđ]/g, (character) => character === "Đ" ? "D" : "d");
}

function getPreviewFamily(slot = "primary") {
  const key = state.fontKeys[slot];
  const descriptor = FONT_CATALOG[key] || FONT_CATALOG["utm-helve-bold"];
  return descriptor.system ? descriptor.family : `"${descriptor.family}", "Segoe UI", sans-serif`;
}

async function exportFile() {
  if (!state.workingDataUrl) return window.alert("Bạn cần chọn logo trước khi xuất file.");
  if (!validateSettings()) {
    setStatus("Thông số chưa hợp lệ", "warning");
    return;
  }
  if (!state.fonts.primary) await loadFont("utm-helve", "primary");
  if (!state.fonts.secondary) await loadFont("utm-helve", "secondary");
  const layout = computeLayout();
  const width = layout.canvasWidth;
  const height = layout.canvasHeight;
  const svg = buildExportSvg(width, height, layout);
  const format = state.selectedFormat;
  setStatus("Đang tạo file…");
  if (format === "svg") {
    downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${state.imageName}-logo.svg`);
  } else {
    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const blob = await rasterizeSvg(svg, width, height, mime, format === "jpg");
    downloadBlob(blob, `${state.imageName}-logo.${format}`);
  }
  setStatus(`Đã xuất ${format.toUpperCase()}`, "ready");
}

function buildExportSvg(width, height, layout = computeLayout()) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("xmlns", SVG_NS);
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  if (state.selectedFormat === "jpg") {
    const background = document.createElementNS(SVG_NS, "rect");
    background.setAttribute("width", String(width));
    background.setAttribute("height", String(height));
    background.setAttribute("fill", "#ffffff");
    svg.appendChild(background);
  }
  if (state.preserveOriginalLogo) {
    if (state.workingDataUrl.startsWith("data:image/svg+xml")) {
      appendInlineSvg(svg, state.workingDataUrl, layout);
      return new XMLSerializer().serializeToString(svg);
    }
    const image = document.createElementNS(SVG_NS, "image");
    image.setAttribute("x", String(layout.logoX));
    image.setAttribute("y", String(layout.logoY));
    image.setAttribute("width", String(layout.logoWidth));
    image.setAttribute("height", String(layout.logoHeight));
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", state.workingDataUrl);
    svg.appendChild(image);
    return new XMLSerializer().serializeToString(svg);
  }
  const image = document.createElementNS(SVG_NS, "image");
  image.setAttribute("x", String(layout.logoX));
  image.setAttribute("y", String(layout.logoY));
  image.setAttribute("width", String(layout.logoWidth));
  image.setAttribute("height", String(layout.logoHeight));
  image.setAttribute("preserveAspectRatio", "xMidYMid meet");
  image.setAttributeNS("http://www.w3.org/1999/xlink", "href", state.workingDataUrl);
  svg.appendChild(image);
  const secondaryLines = wrapText(getSecondaryText(), state.fonts.secondary, layout.secondaryFontSize, layout.textMaxWidth);
  const primaryLines = wrapText(getText(), state.fonts.primary, layout.fontSize, layout.textMaxWidth);
  let lineIndex = 0;
  for (const line of secondaryLines) {
    appendVectorLine(svg, state.fonts.secondary, line, layout.secondaryFontSize, ui.secondaryColor.value, layout.textX, layout.textBaselines[lineIndex]);
    lineIndex += 1;
  }
  for (const line of primaryLines) {
    appendVectorLine(svg, state.fonts.primary, line, layout.fontSize, ui.textColor.value, layout.textX, layout.textBaselines[lineIndex]);
    lineIndex += 1;
  }
  return new XMLSerializer().serializeToString(svg);
}

function appendInlineSvg(targetSvg, dataUrl, layout) {
  const source = decodeDataUrlText(dataUrl);
  const documentNode = new DOMParser().parseFromString(source, "image/svg+xml");
  const sourceSvg = documentNode.documentElement;
  const viewBox = (sourceSvg.getAttribute("viewBox") || "0 0 1 1").trim().split(/[\s,]+/).map(Number);
  const sourceWidth = viewBox[2] || Number.parseFloat(sourceSvg.getAttribute("width")) || 1;
  const sourceHeight = viewBox[3] || Number.parseFloat(sourceSvg.getAttribute("height")) || 1;
  const group = document.createElementNS(SVG_NS, "g");
  group.setAttribute("transform", `translate(${layout.logoX} ${layout.logoY}) scale(${layout.logoWidth / sourceWidth} ${layout.logoHeight / sourceHeight})`);
  Array.from(sourceSvg.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) group.appendChild(document.importNode(child, true));
  });
  targetSvg.appendChild(group);
}

function computeLayout() {
  const paddingTop = Math.max(0, Number(ui.paddingTop.value) || 0);
  const paddingRight = Math.max(0, Number(ui.paddingRight.value) || 0);
  const paddingBottom = Math.max(0, Number(ui.paddingBottom.value) || 0);
  const paddingLeft = Math.max(0, Number(ui.paddingLeft.value) || 0);
  const imageRatio = getImageAspectRatio();
  const baseLogoWidth = clamp(Number(ui.markWidthValue.value) || 0, 0, 8000);
  const baseLogoHeight = clamp(Number(ui.markHeightValue.value) || 0, 0, 8000);
  const baseFontSize = clamp(Number(ui.fontSize.value) || 0, 0, 5760);
  const baseSecondaryFontSize = clamp(Number(ui.secondarySize.value) || 0, 0, 3600);
  const baseGap = Number(ui.gap.value) || 0;
  const secondaryLines = state.preserveOriginalLogo ? [] : wrapText(getSecondaryText(), state.fonts.secondary, baseSecondaryFontSize, Number.POSITIVE_INFINITY);
  const primaryLines = state.preserveOriginalLogo ? [] : wrapText(getText(), state.fonts.primary, baseFontSize, Number.POSITIVE_INFINITY);
  const secondaryWidth = secondaryLines.length ? Math.max(...secondaryLines.map((line) => measureText(state.fonts.secondary, line, baseSecondaryFontSize))) : 0;
  const primaryWidth = primaryLines.length ? Math.max(...primaryLines.map((line) => measureText(state.fonts.primary, line, baseFontSize))) : 0;
  const baseTextWidth = Math.max(secondaryWidth, primaryWidth);
  const textRuns = [];
  for (const line of secondaryLines) {
    textRuns.push({ line, font: state.fonts.secondary, size: baseSecondaryFontSize });
  }
  for (const line of primaryLines) {
    textRuns.push({ line, font: state.fonts.primary, size: baseFontSize });
  }
  let minTextY = 0;
  let maxTextY = 0;
  let minInkY = 0;
  let maxInkY = 0;
  if (textRuns.length) {
    minTextY = Infinity;
    maxTextY = -Infinity;
    minInkY = Infinity;
    maxInkY = -Infinity;
    for (let index = 0; index < textRuns.length; index += 1) {
      const run = textRuns[index];
      const bodyText = stripDiacritics(run.line);
      run.bodyBounds = run.font?.getPath ? run.font.getPath(bodyText, 0, 0, run.size).getBoundingBox() : { y1: -run.size * .72, y2: run.size * .08 };
      run.inkBounds = run.font?.getPath ? run.font.getPath(run.line, 0, 0, run.size).getBoundingBox() : run.bodyBounds;
      run.baseline = index === 0 ? 0 : textRuns[index - 1].baseline + textRuns[index - 1].bodyBounds.y2 + 8 - run.bodyBounds.y1;
      minTextY = Math.min(minTextY, run.baseline + run.bodyBounds.y1);
      maxTextY = Math.max(maxTextY, run.baseline + run.bodyBounds.y2);
      minInkY = Math.min(minInkY, run.baseline + run.inkBounds.y1);
      maxInkY = Math.max(maxInkY, run.baseline + run.inkBounds.y2);
    }
  }
  const baseTextHeight = Math.max(0, maxTextY - minTextY);
  const logoWidth = baseLogoWidth;
  const logoHeight = baseLogoHeight;
  const fontSize = baseFontSize;
  const secondaryFontSize = baseSecondaryFontSize;
  const gap = baseGap;
  const textWidth = baseTextWidth;
  const textHeight = baseTextHeight;
  const contentWidth = logoWidth + (textWidth ? gap : 0) + textWidth;
  const contentHeight = Math.max(logoHeight, textHeight);
  const canvasWidth = clamp(Math.ceil(paddingLeft + contentWidth + paddingRight), 1, 8000);
  const canvasHeight = clamp(Math.ceil(paddingTop + contentHeight + paddingBottom), 1, 8000);
  const logoX = paddingLeft;
  const logoY = paddingTop + (contentHeight - logoHeight) / 2;
  const textX = logoX + logoWidth + (textWidth ? gap : 0);
  const bodyCenterY = (minTextY + maxTextY) / 2;
  const inkCenterY = (minInkY + maxInkY) / 2;
  const textStartBaseline = logoY + logoHeight / 2 - bodyCenterY;
  return { canvasWidth, canvasHeight, logoX, logoY, logoWidth: Math.round(logoWidth), logoHeight: Math.round(logoHeight), markWidth: Math.round(logoWidth), markHeight: Math.round(logoHeight), textX, fontSize, secondaryFontSize, gap, textMaxWidth: textWidth, textStartBaseline, textBaselines: textRuns.map((run) => textStartBaseline + run.baseline), textLineGap: 8, bodyCenterY, inkCenterY };
}

function appendVectorLine(svg, font, text, fontSize, color, x, baseline) {
  if (!text || !font) return;
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", buildGlyphPath(font, text, fontSize, color, x, baseline));
  path.setAttribute("fill", color);
  svg.appendChild(path);
}

function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  if (!font || !ui.wrapText.checked) return [text];
  const lines = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && measureText(font, candidate, fontSize) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }
  return lines.length ? lines : [text];
}

function buildGlyphPath(font, text, fontSize, color, startX, baselineY) {
  const scale = fontSize / font.unitsPerEm;
  let cursorX = startX;
  let previous = null;
  let pathData = "";
  for (const glyph of font.stringToGlyphs(text)) {
    if (previous) cursorX += font.getKerningValue(previous, glyph) * scale;
    pathData += `${glyph.getPath(cursorX, baselineY, fontSize).toPathData(3)} `;
    cursorX += (glyph.advanceWidth || font.unitsPerEm * 0.5) * scale;
    previous = glyph;
  }
  return pathData.trim();
}

function measureText(font, text, fontSize) {
  return font.getAdvanceWidth(text, fontSize);
}

function getImageAspectRatio() {
  if (!state.image) return 1;
  const sourceRatio = getSourceAspectRatio(state.workingDataUrl);
  if (sourceRatio) return sourceRatio;
  return (state.image.naturalWidth || state.image.width) / (state.image.naturalHeight || state.image.height);
}

function getSourceAspectRatio(dataUrl) {
  if (!dataUrl?.startsWith("data:image/svg+xml")) return 0;
  try {
    const source = decodeDataUrlText(dataUrl);
    const viewBox = source.match(/viewBox\s*=\s*["']\s*[-+\d.]+\s+[-+\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
    if (viewBox) return Number(viewBox[1]) / Number(viewBox[2]);
    const width = source.match(/\bwidth\s*=\s*["']([\d.]+)/i);
    const height = source.match(/\bheight\s*=\s*["']([\d.]+)/i);
    return width && height ? Number(width[1]) / Number(height[1]) : 0;
  } catch {
    return 0;
  }
}

function decodeDataUrlText(dataUrl) {
  const [header, ...parts] = dataUrl.split(",");
  const payload = parts.join(",");
  if (/;base64/i.test(header)) {
    const binary = atob(payload);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  }
  return decodeURIComponent(payload);
}

function rasterizeSvg(svgString, width, height, mime, whiteBackground) {
  return loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`).then((image) => new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (whiteBackground) { context.fillStyle = "#ffffff"; context.fillRect(0, 0, width, height); }
    context.drawImage(image, 0, 0, width, height);
    canvas.toBlob(resolve, mime, mime === "image/jpeg" ? 0.96 : 1);
  }));
}

function resetAll() {
  ui.imageInput.value = "";
  ui.secondaryText.value = "TRƯỜNG THPT";
  ui.textInput.value = "TRƯỜNG THPT THẢO NGUYÊN";
  ui.fontSelect.value = "utm-helve-bold";
  ui.secondaryFontSelect.value = "utm-helve-bold";
  ui.secondarySize.value = "16";
  ui.fontSize.value = "16";
  ui.gap.value = "64";
  ui.logoSize.value = "72";
  ui.markWidthValue.value = "360";
  ui.markHeightValue.value = "360";
  ui.markWidthValue.value = "360";
  ui.markHeightValue.value = "360";
  ui.logoWidth.value = "0";
  ui.logoHeight.value = "0";
  ui.paddingTop.value = "0";
  ui.paddingRight.value = "0";
  ui.paddingBottom.value = "0";
  ui.paddingLeft.value = "0";
  ui.paddingLock.checked = false;
  ui.preserveOriginalLogo.checked = false;
  ui.exportWidth.value = "2400";
  ui.exportHeight.value = "900";
  state.selectedFormat = "png";
  state.preserveOriginalLogo = false;
  state.layoutInitialized = false;
  ui.formatOptions.forEach((option) => option.classList.toggle("is-selected", option.querySelector("input").value === "png"));
  ui.formatOptions[0].querySelector("input").checked = true;
  Promise.all([loadFont("utm-helve-bold", "primary"), loadFont("utm-helve-bold", "secondary")]).then(loadSampleLogo);
  setStatus("Đã làm mới", "ready");
}

function setStatus(message, tone = "") {
  ui.status.textContent = message;
  ui.status.className = `status-pill ${tone}`.trim();
}

function isPositiveInteger(value) {
  return /^\d+$/.test(String(value).trim()) && Number(value) > 0 && Number.isSafeInteger(Number(value));
}

function validateSettings() {
  const fields = [
    [ui.markWidthValue, "Biểu trưng rộng"],
    [ui.markHeightValue, "Biểu trưng cao"],
    [ui.paddingTop, "Padding trên"],
    [ui.paddingRight, "Padding phải"],
    [ui.paddingBottom, "Padding dưới"],
    [ui.paddingLeft, "Padding trái"]
  ];
  const invalid = fields.find(([control, label], index) => {
    const positive = index < 2;
    const validInteger = /^\d+$/.test(String(control.value).trim()) && Number.isSafeInteger(Number(control.value));
    return !validInteger || (positive ? Number(control.value) < 1 : Number(control.value) < 0) || Number(control.value) > 8000;
  });
  fields.forEach(([control], index) => {
    const validInteger = /^\d+$/.test(String(control.value).trim()) && Number.isSafeInteger(Number(control.value));
    const valid = validInteger && (index < 2 ? Number(control.value) >= 1 : Number(control.value) >= 0) && Number(control.value) <= 8000;
    control.setAttribute("aria-invalid", String(!valid));
  });
  if (!invalid) {
    ui.settingsValidation.hidden = true;
    ui.settingsValidation.textContent = "";
    return true;
  }
  ui.settingsValidation.hidden = false;
  ui.settingsValidation.textContent = `${invalid[1]} phải là số nguyên ${fields.indexOf(invalid) < 2 ? "từ 1" : "không âm"} đến 8000 px.`;
  return false;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function sanitizeFileName(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}

function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
