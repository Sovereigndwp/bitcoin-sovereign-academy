#!/usr/bin/env node
/**
 * Foundations infographic renderer (Path B v2).
 *
 * Compiles a Handlebars SVG template + content JSON into an SVG, then rasterizes
 * to PNG via sharp. Logo is read from assets/dalia/logo.svg and inlined.
 *
 * Usage:
 *   node scripts/render-foundations.mjs \
 *     --content content/foundations/foundation-2.en.json \
 *     --template portrait-1024x1536 \
 *     --output assets/foundations/foundation-2-en-portrait
 *
 * Emits <output>.svg and <output>.png.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (!line) { line = w; continue; }
    if ((line + ' ' + w).length > maxChars) {
      lines.push(line);
      line = w;
    } else {
      line += ' ' + w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function extractSvgInner(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>\s*$/);
  return m ? m[1].trim() : '';
}

async function loadIcon(rootDir, illustrationId) {
  if (!illustrationId) return null;
  const iconPath = path.join(rootDir, 'assets/foundations/icons', `${illustrationId}.svg`);
  try {
    const raw = await fs.readFile(iconPath, 'utf8');
    return extractSvgInner(raw);
  } catch {
    return null;
  }
}

/**
 * Layout the portrait template. Anchors:
 *   - Top:    header band, title, subtitle, lead, divider
 *   - Middle: 5 stacked cards, derivation arc, arc caption, misconceptions
 *   - Bottom: key lesson band (60h) + footer (60h), pinned to canvas bottom.
 */
function preparePortrait(content, logoInner) {
  const W = 1024, H = 1536;
  const M = 60;

  // ---- Header section (tightened single-line title; font scales w/ length) ----
  // 904px content width, font weight 900. Pick the largest size that keeps the
  // longest line under 880px, assuming caps width ≈ 0.62 × font-size.
  const titleLen = content.title.length;
  const titleFontSize = titleLen <= 28 ? 50 : titleLen <= 34 ? 44 : titleLen <= 40 ? 38 : 34;
  const titleLineH = Math.round(titleFontSize * 1.08);
  const titleCharLimit = Math.floor(880 / (titleFontSize * 0.62));
  const titleLines = wrapText(content.title, titleCharLimit).map((text, i) => ({
    text,
    y: 122 + i * titleLineH,
  }));
  const titleLastY = titleLines.at(-1).y;

  const subtitleLines = wrapText(content.subtitle, 60).map((text, i) => ({
    text,
    y: titleLastY + 38 + i * 28,
  }));
  const subtitleLastY = subtitleLines.at(-1).y;

  const leadLines = wrapText(content.lead, 86).map((text, i) => ({
    text,
    y: subtitleLastY + 28 + i * 22,
  }));
  const leadLastY = leadLines.at(-1).y;

  const dividerY = leadLastY + 16;

  // ---- Cards (5 stacked, illustration LEFT of text, taller per option A) ----
  const cardH = 130;
  const cardGap = 12;
  const cardCY = cardH / 2;
  const cardNumY = cardCY + 11;
  const illSize = 100;
  const illX = 110;
  const illY = (cardH - illSize) / 2;
  const textX = 230;

  const cardsStartY = dividerY + 18;
  const components = content.components.map((c, i) => {
    const card_y = cardsStartY + i * (cardH + cardGap);
    const does_lines = wrapText(c.does, 62).map((text, idx) => ({
      text,
      y: 82 + idx * 18,
    }));
    const lastDoesY = does_lines.at(-1).y;
    const if_fails_lines = wrapText(c.if_fails, 76).map((text, idx) => ({
      text,
      y: lastDoesY + 20 + idx * 14,
      first: idx === 0,
    }));
    return {
      ...c,
      card_y,
      does_lines,
      if_fails_lines,
      iconInner: c._iconInner ?? null,
    };
  });
  const cardsEndY = cardsStartY + 5 * cardH + 4 * cardGap;

  // ---- Arc ----
  const arcY = cardsEndY + 22;
  const arcChipW = 130;
  const arcArrowW = 26;
  const steps = content.arc.steps;
  const arcTotalW = steps.length * arcChipW + (steps.length - 1) * arcArrowW;
  const arcStartX = (W - arcTotalW) / 2;
  const arcChips = steps.map((label, i) => ({
    label,
    x: arcStartX + i * (arcChipW + arcArrowW),
    cx: arcChipW / 2,
    w: arcChipW,
  }));
  const arcArrows = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const x1 = arcStartX + i * (arcChipW + arcArrowW) + arcChipW + 2;
    const x2 = x1 + arcArrowW - 8;
    arcArrows.push({ x1, x2, ax: x2 - 8 });
  }
  const arcEndY = arcY + 40;

  // ---- Arc caption ----
  const arcCaptionLines = wrapText(content.arc.caption, 92).map((text, i) => ({
    text,
    y: arcEndY + 26 + i * 18,
  }));
  const arcCaptionLastY = arcCaptionLines.at(-1).y;

  // ---- Misconceptions (4 rows) ----
  const misconHeaderY = arcCaptionLastY + 30;
  const misconRowH = 56;
  const misconStartY = misconHeaderY + 18;
  const misconceptions = content.misconceptions.map((m, i) => {
    const better_lines = wrapText(m.better, 88).map((text, idx) => ({
      text,
      y: 36 + idx * 16,
    }));
    return { ...m, y: misconStartY + i * misconRowH, better_lines };
  });

  // ---- Bottom-anchored bands ----
  const footerY = H - 60;
  const keyY = footerY - 60;

  return {
    ...content,
    titleLines,
    titleFontSize,
    subtitleLines,
    leadLines,
    dividerY,
    cardH,
    cardCY,
    cardNumY,
    illSize,
    illX,
    illY,
    textX,
    components,
    arcY,
    arcChips,
    arcArrows,
    arcCaptionLines,
    misconHeaderY,
    misconceptions,
    keyY,
    footerY,
    logoInner,
  };
}

function prepareStub(content, logoInner) {
  return { ...content, logoInner };
}

/**
 * Square 1080×1080 layout: header → arc hero → 5 compact rows → key band → footer.
 */
function prepareSquare(content, logoInner) {
  const W = 1080, H = 1080;

  // Title font scaled by length, content max width 960
  const titleLen = content.title.length;
  const titleFontSize = titleLen <= 28 ? 50 : titleLen <= 34 ? 44 : titleLen <= 40 ? 38 : 34;
  const titleLineH = Math.round(titleFontSize * 1.08);
  const titleCharLimit = Math.floor(940 / (titleFontSize * 0.62));
  const titleLines = wrapText(content.title, titleCharLimit).map((text, i) => ({
    text,
    y: 110 + i * titleLineH,
  }));
  const titleLastY = titleLines.at(-1).y;

  const subtitleLines = wrapText(content.subtitle, 64).map((text, i) => ({
    text,
    y: titleLastY + 38 + i * 28,
  }));
  const subtitleLastY = subtitleLines.at(-1).y;

  // Arc as hero
  const arcY = subtitleLastY + 36;
  const arcChipW = 150;
  const arcArrowW = 28;
  const steps = content.arc.steps;
  const arcTotalW = steps.length * arcChipW + (steps.length - 1) * arcArrowW;
  const arcStartX = (W - arcTotalW) / 2;
  const arcChips = steps.map((label, i) => ({
    label,
    x: arcStartX + i * (arcChipW + arcArrowW),
    cx: arcChipW / 2,
    w: arcChipW,
  }));
  const arcArrows = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const x1 = arcStartX + i * (arcChipW + arcArrowW) + arcChipW + 2;
    const x2 = x1 + arcArrowW - 8;
    arcArrows.push({ x1, x2, ax: x2 - 8 });
  }

  // 5 compact rows
  const rowH = 74;
  const rowGap = 10;
  const rowsStartY = arcY + 80;
  const components = content.components.map((c, i) => {
    const row_y = rowsStartY + i * (rowH + rowGap);
    const does_lines = wrapText(c.does, 72).slice(0, 1).map((text, idx) => ({
      text,
      y: 56 + idx * 18,
    }));
    return { ...c, row_y, does_lines };
  });

  // Bottom-anchored
  const footerY = H - 50;
  const keyY = footerY - 60;

  return {
    ...content,
    titleLines,
    titleFontSize,
    subtitleLines,
    arcY,
    arcChips,
    arcArrows,
    components,
    keyY,
    footerY,
    logoInner,
  };
}

/**
 * Card 1200×627 layout (OG/link-share): header → arc → key band → footer. Compact.
 */
function prepareCard(content, logoInner) {
  const W = 1200, H = 627;

  // Title — narrower vertical so smaller font
  const titleLen = content.title.length;
  const titleFontSize = titleLen <= 28 ? 42 : titleLen <= 34 ? 36 : titleLen <= 40 ? 32 : 28;
  const titleLineH = Math.round(titleFontSize * 1.08);
  const titleCharLimit = Math.floor(1080 / (titleFontSize * 0.62));
  const titleLines = wrapText(content.title, titleCharLimit).map((text, i) => ({
    text,
    y: 102 + i * titleLineH,
  }));
  const titleLastY = titleLines.at(-1).y;

  const subtitleLines = wrapText(content.subtitle, 78).slice(0, 2).map((text, i) => ({
    text,
    y: titleLastY + 32 + i * 24,
  }));
  const subtitleLastY = subtitleLines.at(-1).y;

  // Arc
  const arcY = subtitleLastY + 30;
  const arcChipW = 154;
  const arcArrowW = 28;
  const steps = content.arc.steps;
  const arcTotalW = steps.length * arcChipW + (steps.length - 1) * arcArrowW;
  const arcStartX = (W - arcTotalW) / 2;
  const arcChips = steps.map((label, i) => ({
    label,
    x: arcStartX + i * (arcChipW + arcArrowW),
    cx: arcChipW / 2,
    w: arcChipW,
  }));
  const arcArrows = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const x1 = arcStartX + i * (arcChipW + arcArrowW) + arcChipW + 2;
    const x2 = x1 + arcArrowW - 8;
    arcArrows.push({ x1, x2, ax: x2 - 8 });
  }

  // Bottom anchored
  const footerY = H - 40;
  const keyY = footerY - 48;

  return {
    ...content,
    titleLines,
    titleFontSize,
    subtitleLines,
    arcY,
    arcChips,
    arcArrows,
    keyY,
    footerY,
    logoInner,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.content || !args.template || !args.output) {
    console.error('Usage: --content <json> --template <name> --output <path-no-ext>');
    process.exit(2);
  }

  const contentPath = path.resolve(ROOT, args.content);
  const templatePath = path.resolve(ROOT, `templates/foundations/${args.template}.svg.hbs`);
  const logoPath = path.resolve(ROOT, 'assets/dalia/logo.svg');
  const outBase = path.resolve(ROOT, args.output);

  const [contentRaw, templateSrc, logoSvg] = await Promise.all([
    fs.readFile(contentPath, 'utf8'),
    fs.readFile(templatePath, 'utf8'),
    fs.readFile(logoPath, 'utf8'),
  ]);

  const content = JSON.parse(contentRaw);
  const logoInner = extractSvgInner(logoSvg);

  // Resolve icon SVGs for each component (by illustration_id).
  const componentsWithIcons = await Promise.all(
    (content.components || []).map(async (c) => ({
      ...c,
      _iconInner: await loadIcon(ROOT, c.illustration_id),
    })),
  );
  const enrichedContent = { ...content, components: componentsWithIcons };

  let data;
  if (args.template.startsWith('portrait')) {
    data = preparePortrait(enrichedContent, logoInner);
  } else if (args.template.startsWith('square')) {
    data = prepareSquare(enrichedContent, logoInner);
  } else if (args.template.startsWith('card')) {
    data = prepareCard(enrichedContent, logoInner);
  } else {
    data = prepareStub(enrichedContent, logoInner);
  }

  const tpl = Handlebars.compile(templateSrc);
  const svg = tpl(data);

  await fs.mkdir(path.dirname(outBase), { recursive: true });
  await fs.writeFile(`${outBase}.svg`, svg);
  console.log(`SVG → ${path.relative(ROOT, outBase)}.svg`);

  try {
    await sharp(Buffer.from(svg), { density: 288 }).png().toFile(`${outBase}.png`);
    console.log(`PNG → ${path.relative(ROOT, outBase)}.png`);
  } catch (e) {
    console.warn(`PNG rasterization failed: ${e.message}`);
    console.warn('SVG is valid; rasterize manually if needed.');
  }
}

main().catch((e) => {
  console.error('Render failed:', e);
  process.exit(1);
});
