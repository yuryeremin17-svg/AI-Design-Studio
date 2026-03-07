#!/usr/bin/env node

/**
 * Brand Kit Delivery Script v2
 * Собирает ZIP для клиента: PDF, логотипы, аватарки, шрифты, README RU+EN
 *
 * Usage: node scripts/deliver-v2.js <client-name>
 * Example: node scripts/deliver-v2.js aurelius-group
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const clientName = process.argv[2];
if (!clientName) {
  console.error('Usage: node scripts/deliver-v2.js <client-name>');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(clientName)) {
  console.error('Client name must contain only lowercase letters, numbers, and hyphens');
  process.exit(1);
}

const outputDir = path.join(ROOT, 'output', clientName);
const logosDir = path.join(ROOT, 'assets', 'logos', clientName);
const deliveryDir = path.join(ROOT, 'delivery', clientName);
const brandKitName = formatBrandKitName(clientName);

if (!fs.existsSync(outputDir)) {
  console.error(`Client output not found: ${outputDir}`);
  process.exit(1);
}

// Load brand.json
const brandJsonPath = path.join(outputDir, 'brand.json');
const brand = fs.existsSync(brandJsonPath)
  ? JSON.parse(fs.readFileSync(brandJsonPath, 'utf8'))
  : { brand: clientName, palette: {}, fonts: {} };

// Add version + date (1.6)
if (!brand.version) brand.version = '1.0';
const buildDate = new Date().toISOString().split('T')[0];
brand.buildDate = buildDate;

// --- Main ---
console.log(`\nPreparing Brand Kit v2 for: ${brandKitName}`);
console.log('='.repeat(50));

// Clean previous delivery
if (fs.existsSync(deliveryDir)) {
  fs.rmSync(deliveryDir, { recursive: true });
}

const kitDir = path.join(deliveryDir, brandKitName);
fs.mkdirSync(kitDir, { recursive: true });

// 1. Copy PDF files from print/ to root (1.1)
console.log('\n1. PDF files...');
const printDir = path.join(outputDir, 'print');
let pdfCount = 0;
if (fs.existsSync(printDir)) {
  const pdfFiles = fs.readdirSync(printDir).filter(f => f.endsWith('.pdf'));
  for (const pdf of pdfFiles) {
    fs.copyFileSync(path.join(printDir, pdf), path.join(kitDir, pdf));
    console.log(`   ${pdf}`);
    pdfCount++;
  }
}
if (pdfCount === 0) {
  console.log('   No PDF found in print/ — skipping');
}

// 2. Move HTML to Interactive/ subfolder (1.2)
console.log('\n2. Interactive HTML...');
const interactiveDir = path.join(kitDir, 'Interactive');
fs.mkdirSync(interactiveDir, { recursive: true });
const htmlFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
  const dest = formatFileName(file);
  fs.copyFileSync(path.join(outputDir, file), path.join(interactiveDir, dest));
  console.log(`   Interactive/${dest}`);
}

// 3. Copy & export logos + avatars
console.log('\n3. Logos + Avatars...');
const logosOutDir = path.join(kitDir, 'Logos');
fs.mkdirSync(logosOutDir, { recursive: true });

if (fs.existsSync(logosDir)) {
  const svgFiles = fs.readdirSync(logosDir).filter(f => f.endsWith('.svg'));
  for (const svg of svgFiles) {
    fs.copyFileSync(path.join(logosDir, svg), path.join(logosOutDir, svg));
    console.log(`   SVG: ${svg}`);
    const baseName = svg.replace('.svg', '');
    exportSvgToPng(path.join(logosDir, svg), logosOutDir, baseName);
  }

  // 1.3 — Avatars 512x512
  const iconSvg = path.join(logosDir, 'icon.svg');
  const logoSvg = path.join(logosDir, 'logo.svg');
  const avatarSource = fs.existsSync(iconSvg) ? iconSvg : logoSvg;

  if (fs.existsSync(avatarSource)) {
    console.log('\n   Avatars (512x512):');
    await exportAvatars(avatarSource, logosOutDir, brand);
  }
} else {
  console.log('   No logo directory found, skipping...');
}

// 4. Download fonts TTF (1.5)
console.log('\n4. Fonts...');
const fontsDir = path.join(kitDir, 'Fonts');
fs.mkdirSync(fontsDir, { recursive: true });
await downloadFonts(brand.fonts, fontsDir);

// 5. Colors
console.log('\n5. Colors...');
const colorsDir = path.join(kitDir, 'Colors');
fs.mkdirSync(colorsDir, { recursive: true });
fs.writeFileSync(
  path.join(colorsDir, 'colors.json'),
  JSON.stringify({ brand: brand.brand, palette: brand.palette }, null, 2)
);
console.log(`   ${Object.keys(brand.palette).length} colors exported`);

// 6. README RU+EN (1.4)
console.log('\n6. README...');
generateReadme(kitDir, brandKitName, brand, pdfCount);

// 7. Create ZIP
console.log('\n7. Creating ZIP...');
const zipPath = path.join(deliveryDir, `${brandKitName}.zip`);
execSync(`cd "${deliveryDir}" && zip -r "${zipPath}" "${brandKitName}"`, { stdio: 'pipe' });
const zipSize = (fs.statSync(zipPath).size / 1024).toFixed(0);
console.log(`   ${brandKitName}.zip (${zipSize} KB)`);

// Done
console.log('\n' + '='.repeat(50));
console.log(`Brand Kit v2 ready: ${deliveryDir}/`);
console.log(`ZIP: ${zipPath}`);
console.log(`Version: ${brand.version} | Date: ${buildDate}`);
console.log(`\nContents:`);
listDir(kitDir, '  ');

// --- Helpers ---

function formatBrandKitName(name) {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-') + '-Brand-Kit';
}

function formatFileName(file) {
  const name = file.replace('.html', '');
  const formatted = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
  return formatted + '.html';
}

function exportSvgToPng(svgPath, outDir, baseName) {
  const sizes = [
    { suffix: '@1x', width: 400 },
    { suffix: '@2x', width: 800 },
    { suffix: '@4x', width: 1600 },
  ];

  for (const { suffix, width } of sizes) {
    const pngPath = path.join(outDir, `${baseName}${suffix}.png`);
    try {
      execSync(`rsvg-convert -w ${width} "${svgPath}" -o "${pngPath}" 2>/dev/null`, { stdio: 'pipe' });
      console.log(`   PNG: ${baseName}${suffix}.png (${width}px)`);
    } catch {
      try {
        exportWithPlaywrightSync(svgPath, pngPath, width);
        console.log(`   PNG: ${baseName}${suffix}.png (${width}px)`);
      } catch {
        console.log(`   SKIP: ${baseName}${suffix}.png (no converter)`);
      }
    }
  }
}

function exportWithPlaywrightSync(svgPath, pngPath, width) {
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const viewBoxMatch = svgContent.match(/viewBox="[^"]*\s(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)"/);
  const aspectRatio = viewBoxMatch ? parseFloat(viewBoxMatch[2]) / parseFloat(viewBoxMatch[1]) : 0.3;
  const height = Math.round(width * aspectRatio);

  const chromePath = getChromePath();
  const scriptPath = path.join('/tmp', 'svg-to-png-v2.mjs');
  const script = `
import { chromium } from '${path.join(ROOT, 'node_modules', 'playwright', 'index.mjs').replace(/'/g, "\\'")}';
const browser = await chromium.launch({ executablePath: '${chromePath}' });
const page = await browser.newPage({ viewport: { width: ${width}, height: ${height} } });
await page.goto('file://${svgPath}', { waitUntil: 'load' });
await page.waitForTimeout(300);
await page.screenshot({ path: '${pngPath}', omitBackground: true, timeout: 10000 });
await browser.close();
`;
  fs.writeFileSync(scriptPath, script);
  execSync(`node "${scriptPath}"`, { stdio: 'pipe', timeout: 30000 });
}

async function exportAvatars(svgPath, outDir, brand) {
  const chromePath = getChromePath();
  const { chromium } = await import(path.join(ROOT, 'node_modules', 'playwright', 'index.mjs'));

  const browser = await chromium.launch({ executablePath: chromePath });
  const size = 512;

  // Read SVG
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // Get primary dark and light colors from brand
  const paletteEntries = Object.entries(brand.palette);
  const darkColor = paletteEntries.find(([k]) => /primary|navy|deep|dark/i.test(k))?.[1]?.hex || '#1A1A1A';
  const lightColor = paletteEntries.find(([k]) => /light|cream|white|warm\s*white/i.test(k))?.[1]?.hex || '#FFFFFF';

  const variants = [
    { name: 'avatar-512-dark', bg: darkColor },
    { name: 'avatar-512-light', bg: lightColor },
    { name: 'avatar-512-circle', bg: darkColor, circle: true },
  ];

  for (const v of variants) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    const borderRadius = v.circle ? '50%' : '0';
    const html = `<!DOCTYPE html>
<html><head><style>
  body { margin: 0; display: flex; align-items: center; justify-content: center;
         width: ${size}px; height: ${size}px; background: ${v.bg};
         border-radius: ${borderRadius}; overflow: hidden; }
  svg { width: 70%; height: 70%; }
</style></head>
<body>${svgContent}</body></html>`;

    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(200);

    const pngPath = path.join(outDir, `${v.name}.png`);
    await page.screenshot({ path: pngPath, omitBackground: v.circle, timeout: 10000 });
    console.log(`   ${v.name}.png`);
    await page.close();
  }

  await browser.close();
}

async function downloadFonts(fontsConfig, fontsDir) {
  if (!fontsConfig?.heading) {
    console.log('   No font info in brand.json, skipping');
    return;
  }

  const families = [fontsConfig.heading, fontsConfig.body].filter(Boolean);
  const weights = {
    [fontsConfig.heading]: fontsConfig.headingWeights || [400, 700],
    [fontsConfig.body]: fontsConfig.bodyWeights || [400, 500],
  };

  for (const family of families) {
    const familySlug = family.replace(/\s+/g, '').toLowerCase();
    // Google Fonts GitHub — full TTF with all charsets
    const githubBase = `https://github.com/google/fonts/raw/main/ofl/${familySlug}`;

    for (const w of (weights[family] || [400])) {
      const fileName = `${family.replace(/\s+/g, '')}-${weightName(w)}.ttf`;
      const destPath = path.join(fontsDir, fileName);

      // Try direct GitHub download
      const url = `${githubBase}/static/${fileName}`;
      try {
        execSync(`curl -sL -o "${destPath}" "${url}" --max-time 10`, { stdio: 'pipe' });
        // Check if we got a valid TTF (starts with 0x00010000 or 'true')
        const header = fs.readFileSync(destPath).slice(0, 4);
        if (header[0] === 0 && header[1] === 1 && header[2] === 0 && header[3] === 0) {
          console.log(`   ${fileName}`);
          continue;
        }
      } catch {}

      // Try alternative path (no /static/ subfolder)
      const url2 = `${githubBase}/${fileName}`;
      try {
        execSync(`curl -sL -o "${destPath}" "${url2}" --max-time 10`, { stdio: 'pipe' });
        const header = fs.readFileSync(destPath).slice(0, 4);
        if (header[0] === 0 && header[1] === 1 && header[2] === 0 && header[3] === 0) {
          console.log(`   ${fileName}`);
          continue;
        }
      } catch {}

      // Try variable font
      const varFileName = `${family.replace(/\s+/g, '')}[wght].ttf`;
      const varUrl = `${githubBase}/${varFileName}`;
      try {
        const varDest = path.join(fontsDir, `${family.replace(/\s+/g, '')}-Variable.ttf`);
        if (!fs.existsSync(varDest)) {
          execSync(`curl -sL -o "${varDest}" "${varUrl}" --max-time 10`, { stdio: 'pipe' });
          const header = fs.readFileSync(varDest).slice(0, 4);
          if (header[0] === 0 && header[1] === 1 && header[2] === 0 && header[3] === 0) {
            console.log(`   ${family.replace(/\s+/g, '')}-Variable.ttf (all weights)`);
            // Remove individual weight file if we got variable
            if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            break; // No need to download other weights
          } else {
            fs.unlinkSync(varDest);
          }
        } else {
          // Variable already downloaded
          if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
          break;
        }
      } catch {}

      // Clean up failed downloads
      if (fs.existsSync(destPath)) {
        const size = fs.statSync(destPath).size;
        if (size < 1000) {
          fs.unlinkSync(destPath);
          console.log(`   SKIP: ${fileName} (download failed)`);
        }
      }
    }
  }

  // Add OFL license note
  fs.writeFileSync(
    path.join(fontsDir, 'LICENSE.txt'),
    'These fonts are licensed under the SIL Open Font License (OFL).\nhttps://scripts.sil.org/OFL\n'
  );
}

function weightName(w) {
  const map = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
  return map[w] || 'Regular';
}

function generateReadme(kitDir, brandKitName, brand, pdfCount) {
  const name = brand.brand || brandKitName.replace('-Brand-Kit', '');
  const version = brand.version || '1.0';
  const date = brand.buildDate || new Date().toISOString().split('T')[0];

  const readme = `${name} — Brand Kit
${'='.repeat(name.length + 14)}
Version: ${version} | ${date}

СОДЕРЖИМОЕ / CONTENTS
---------------------

${pdfCount > 0 ? `ДОКУМЕНТЫ PDF (корневая папка)
  Основные файлы для печати и просмотра.
  Brand_Guidelines.pdf — брендбук (цвета, шрифты, правила)
  Business_Cards.pdf — визитные карточки для типографии
  Letterhead_A4.pdf — фирменный бланк (если есть)

  PDF DOCUMENTS (root folder)
  Main files for printing and viewing.
  Brand_Guidelines.pdf — brand guidelines (colors, fonts, rules)
  Business_Cards.pdf — business cards for print shop
  Letterhead_A4.pdf — letterhead template (if included)
` : ''}
ЛОГОТИПЫ / LOGOS (Logos/)
  .svg — вектор для дизайнера и печати (масштабируется без потерь)
  @1x.png — стандартный (400px) для документов и email
  @2x.png — средний (800px) для презентаций и сайта
  @4x.png — высокое разрешение (1600px) для печати
  avatar-512-*.png — аватарка для WhatsApp, Telegram, Instagram

  .svg — vector for designers and print (scales without quality loss)
  @1x/@2x/@4x.png — raster at different sizes
  avatar-512-*.png — profile picture for messengers and social media

ШРИФТЫ / FONTS (Fonts/)
  TTF файлы для установки на компьютер.
  Установка: двойной клик → "Установить шрифт"
  Лицензия: SIL Open Font License (бесплатно для любого использования)

  TTF files for installation on your computer.
  Install: double-click → "Install Font"
  License: SIL Open Font License (free for any use)

ЦВЕТА / COLORS (Colors/colors.json)
  Палитра бренда с HEX и RGB значениями.
  Передайте этот файл дизайнеру или разработчику.

  Brand color palette with HEX and RGB values.
  Share this file with your designer or developer.

ИНТЕРАКТИВ / INTERACTIVE (Interactive/)
  HTML-версии документов с анимациями.
  Открыть в браузере (Chrome, Safari, Firefox).
  Копирование цветов по клику, интерактивные элементы.
  Для печати из HTML: Ctrl+P (Cmd+P на Mac) → Сохранить как PDF.

  HTML versions with animations and interactive features.
  Open in any modern browser. Click to copy colors.

---------------------
По вопросам / Questions: ${brand.contact?.email || 'contact your brand studio'}
`;

  fs.writeFileSync(path.join(kitDir, 'README.txt'), readme);
  console.log('   README.txt (RU + EN)');
}

function getChromePath() {
  const cacheDir = path.join(process.env.HOME, 'Library', 'Caches', 'ms-playwright');
  if (fs.existsSync(cacheDir)) {
    const dirs = fs.readdirSync(cacheDir).filter(d => /^chromium-\d+$/.test(d));
    if (dirs.length > 0) {
      const chromePath = path.join(cacheDir, dirs[0], 'chrome-mac-x64',
        'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing');
      if (fs.existsSync(chromePath)) return chromePath;
    }
  }
  return undefined;
}

function listDir(dir, indent) {
  const items = fs.readdirSync(dir).sort();
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      console.log(`${indent}${item}/`);
      listDir(full, indent + '  ');
    } else {
      console.log(`${indent}${item}`);
    }
  }
}
