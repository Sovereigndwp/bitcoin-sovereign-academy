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

function extractLogoInner(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>\s*$/);
  return m ? m[1].trim() : '';
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

  // ---- Header section (tightened single-line title) ----
  const titleLines = wrapText(content.title, 34).map((text, i) => ({
    text,
    y: 122 + i * 54,
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
    return { ...c, card_y, does_lines, if_fails_lines };
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
  const logoInner = extractLogoInner(logoSvg);

  const data = args.template.startsWith('portrait')
    ? preparePortrait(content, logoInner)
    : prepareStub(content, logoInner);

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
