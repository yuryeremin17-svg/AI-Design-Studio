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

// Lazy Playwright singleton — import once, reuse everywhere
let _pw = null;
async function getPlaywright() {
  if (!_pw) {
    const mod = await import(path.join(ROOT, 'node_modules', 'playwright', 'index.mjs'));
    _pw = mod;
  }
  return _pw;
}

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

// 6. Email Signature (2.1)
console.log('\n6. Email Signature...');
const emailSigFile = path.join(outputDir, 'email-signature.html');
const emailSigDir = path.join(kitDir, 'Email-Signature');
if (fs.existsSync(emailSigFile)) {
  fs.mkdirSync(emailSigDir, { recursive: true });
  fs.copyFileSync(emailSigFile, path.join(emailSigDir, 'signature.html'));
  generateEmailInstruction(emailSigDir, brand);
  console.log('   signature.html');
  console.log('   How-to-Install.txt (RU + EN)');
} else {
  console.log('   No email signature found, skipping');
}

// 7. Social Media PNG (2.2)
console.log('\n7. Social Media...');
const socialFile = path.join(outputDir, 'social-templates.html');
if (fs.existsSync(socialFile)) {
  const socialDir = path.join(kitDir, 'Social');
  fs.mkdirSync(socialDir, { recursive: true });
  await exportSocialPng(socialFile, socialDir);
} else {
  console.log('   No social templates found, skipping');
}

// 8. Favicon set (2.4)
console.log('\n8. Favicons...');
const faviconSource = fs.existsSync(path.join(logosDir, 'icon.svg'))
  ? path.join(logosDir, 'icon.svg')
  : fs.existsSync(path.join(logosDir, 'logo.svg'))
    ? path.join(logosDir, 'logo.svg')
    : null;
if (faviconSource) {
  const webDir = path.join(kitDir, 'Web');
  fs.mkdirSync(webDir, { recursive: true });
  await exportFavicons(faviconSource, webDir, brand);
} else {
  console.log('   No icon/logo SVG found, skipping');
}

// 9. Print Specifications (2.3)
console.log('\n9. Print Specs...');
const printSpecsDir = path.join(kitDir, 'Print-Specs');
fs.mkdirSync(printSpecsDir, { recursive: true });
generatePrintSpecs(printSpecsDir, brand);
console.log('   print-specifications.txt (RU + EN)');

// 10. README RU+EN (1.4)
console.log('\n10. README...');
generateReadme(kitDir, brandKitName, brand, pdfCount);

// 11. Create ZIP
console.log('\n11. Creating ZIP...');
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
  const { chromium } = await getPlaywright();

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

EMAIL-ПОДПИСЬ / EMAIL SIGNATURE (Email-Signature/)
  signature.html — готовая подпись для email
  How-to-Install.txt — инструкция для Gmail, Outlook, Apple Mail

  signature.html — ready-to-use email signature
  How-to-Install.txt — setup guide for Gmail, Outlook, Apple Mail

СОЦСЕТИ / SOCIAL MEDIA (Social/)
  Готовые PNG для публикации в Instagram и LinkedIn.

  Ready-to-use PNG images for Instagram and LinkedIn.

ВЕБ / WEB (Web/)
  favicon-16.png, favicon-32.png — иконки для сайта
  apple-touch-icon-180.png — иконка для iPhone
  css-variables.txt — CSS-переменные для разработчика

  Favicon set for website + CSS variables for developer.

ТИПОГРАФИЯ / PRINT SPECS (Print-Specs/)
  print-specifications.txt — бумага, размеры, вылеты, покрытие
  Передайте в типографию вместе с PDF файлами.

  Paper weight, sizes, bleed, finish specs for print shop.

ИНТЕРАКТИВ / INTERACTIVE (Interactive/)
  HTML-версии документов с анимациями.
  Открыть в браузере (Chrome, Safari, Firefox).

  HTML versions with animations and interactive features.
  Open in any modern browser. Click to copy colors.

---------------------
По вопросам / Questions: ${brand.contact?.email || 'contact your brand studio'}
`;

  fs.writeFileSync(path.join(kitDir, 'README.txt'), readme);
  console.log('   README.txt (RU + EN)');
}

function generateEmailInstruction(dir, brand) {
  const name = brand.brand || '';
  const instruction = `${name} — Email Signature / Подпись для email
${'='.repeat(50)}

GMAIL
-----
1. Откройте Gmail → Настройки (шестерёнка) → "Все настройки"
2. Прокрутите до "Подпись" → "Создать"
3. Откройте signature.html в браузере (Chrome)
4. Выделите всё (Ctrl+A / Cmd+A) → Скопируйте (Ctrl+C / Cmd+C)
5. Вставьте в поле подписи Gmail (Ctrl+V / Cmd+V)
6. Нажмите "Сохранить изменения" внизу страницы

GMAIL (English)
1. Open Gmail → Settings (gear) → "See all settings"
2. Scroll to "Signature" → "Create new"
3. Open signature.html in Chrome browser
4. Select all (Ctrl+A / Cmd+A) → Copy (Ctrl+C / Cmd+C)
5. Paste into Gmail signature field (Ctrl+V / Cmd+V)
6. Click "Save Changes" at bottom

OUTLOOK (Desktop)
-----------------
1. Файл → Параметры → Почта → Подписи
2. Создайте новую подпись
3. Откройте signature.html в браузере
4. Выделите всё → Скопируйте → Вставьте
5. Нажмите OK

OUTLOOK (English)
1. File → Options → Mail → Signatures
2. Create new signature
3. Open signature.html in browser
4. Select all → Copy → Paste
5. Click OK

APPLE MAIL
----------
1. Mail → Настройки → Подписи
2. Нажмите "+" для новой подписи
3. Откройте signature.html в Safari
4. Выделите всё → Скопируйте → Вставьте
5. Снимите галочку "Всегда использовать шрифт по умолчанию"
`;
  fs.writeFileSync(path.join(dir, 'How-to-Install.txt'), instruction);
}

async function exportSocialPng(htmlPath, socialDir) {
  const chromePath = getChromePath();
  const { chromium } = await getPlaywright();
  const browser = await chromium.launch({ executablePath: chromePath });

  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Find all social template cards by CSS classes
  const templates = await page.evaluate(() => {
    const cards = [];
    // Priority 1: data-format attribute
    // Priority 2: known social media CSS classes
    // Priority 3: .template-card or .social-template
    const selectors = [
      '[data-format]',
      '.ig-post', '.ig-story', '.linkedin-post', '.linkedin-banner',
      '.template-card', '.social-template',
    ];
    const seen = new Set();
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        const rect = el.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) return;
        // Build descriptive format name
        const cls = el.className.split(' ').filter(c => c && c !== 'template-card');
        const format = el.dataset.format || cls.join('-') || `${Math.round(rect.width)}x${Math.round(rect.height)}`;
        cards.push({ format, x: rect.x, y: rect.y, width: rect.width, height: rect.height });
      });
    }
    return cards;
  });

  if (templates.length > 0) {
    // Filter out templates with zero or invalid dimensions
    const valid = templates.filter(t => t.width > 10 && t.height > 10);
    for (let i = 0; i < valid.length; i++) {
      const t = valid[i];
      const fileName = `Social-${i + 1}-${t.format}.png`;
      try {
        await page.screenshot({
          path: path.join(socialDir, fileName),
          clip: { x: Math.max(0, t.x), y: Math.max(0, t.y), width: t.width, height: t.height },
          fullPage: true,
          timeout: 10000,
        });
        console.log(`   ${fileName}`);
      } catch {
        console.log(`   SKIP: ${fileName} (clip out of bounds)`);
      }
    }
  }
  if (templates.length === 0) {
    console.log('   No individual templates detected, exporting full page...');
    await page.screenshot({
      path: path.join(socialDir, 'Social-Templates-Full.png'),
      fullPage: true,
      timeout: 15000,
    });
    console.log('   Social-Templates-Full.png');
  }

  await browser.close();
}

async function exportFavicons(svgPath, webDir, brand) {
  const chromePath = getChromePath();
  const { chromium } = await getPlaywright();
  const browser = await chromium.launch({ executablePath: chromePath });

  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const paletteEntries = Object.entries(brand.palette);
  const darkColor = paletteEntries.find(([k]) => /primary|navy|deep|dark/i.test(k))?.[1]?.hex || '#1A1A1A';

  const sizes = [
    { name: 'favicon-16.png', size: 16 },
    { name: 'favicon-32.png', size: 32 },
    { name: 'apple-touch-icon-180.png', size: 180 },
  ];

  for (const { name, size } of sizes) {
    const renderSize = Math.max(size, 64); // render at min 64px for quality, then resize
    const page = await browser.newPage({ viewport: { width: renderSize, height: renderSize } });

    const html = `<!DOCTYPE html>
<html><head><style>
  body { margin: 0; display: flex; align-items: center; justify-content: center;
         width: ${renderSize}px; height: ${renderSize}px; background: ${darkColor};
         border-radius: ${size <= 32 ? '0' : '20%'}; overflow: hidden; }
  svg { width: 70%; height: 70%; }
</style></head>
<body>${svgContent}</body></html>`;

    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(200);

    const pngPath = path.join(webDir, name);
    await page.screenshot({ path: pngPath, timeout: 10000 });

    // Resize if renderSize != target size
    if (renderSize !== size) {
      try {
        execSync(`sips -z ${size} ${size} "${pngPath}" --out "${pngPath}" 2>/dev/null`, { stdio: 'pipe' });
      } catch {}
    }

    console.log(`   ${name} (${size}x${size})`);
    await page.close();
  }

  // CSS variables snippet
  const cssVars = Object.entries(brand.palette)
    .map(([name, val]) => `  --${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}: ${val.hex};`)
    .join('\n');
  fs.writeFileSync(path.join(webDir, 'css-variables.txt'),
    `/* ${brand.brand} — CSS Variables */\n:root {\n${cssVars}\n}\n`);
  console.log('   css-variables.txt');

  await browser.close();
}

function generatePrintSpecs(dir, brand) {
  const name = brand.brand || '';
  const specs = `${name} — Print Specifications / Спецификация для типографии
${'='.repeat(55)}

ВИЗИТНЫЕ КАРТОЧКИ / BUSINESS CARDS
-----------------------------------
  Размер / Size: 90 x 50 мм (3.54 x 1.97 in)
  Вылеты / Bleed: 3 мм с каждой стороны (итого 96 x 56 мм)
  Безопасная зона / Safe zone: 5 мм от края (80 x 40 мм)
  Бумага / Paper: 350 г/м² мелованная матовая (coated matte)
  Покрытие / Finish: Soft-touch ламинация + выборочный UV-лак на логотипе
  Цветность / Colors: 4+4 (CMYK, двусторонняя печать)
  Тираж / Quantity: рекомендуется от 200 шт.

ФИРМЕННЫЙ БЛАНК / LETTERHEAD
-----------------------------
  Размер / Size: A4 (210 x 297 мм)
  Вылеты / Bleed: 3 мм
  Бумага / Paper: 120 г/м² офсетная или 100 г/м² мелованная
  Цветность / Colors: 4+0 (односторонняя)
  Тираж / Quantity: от 500 шт. или цифровая печать по запросу

ОБЩИЕ РЕКОМЕНДАЦИИ / GENERAL
-----------------------------
  Формат файлов / File format: PDF (из комплекта Brand Kit)
  Цветовой режим / Color mode: RGB (конвертация в CMYK — типографией)
  Разрешение / Resolution: 300 dpi для растровых элементов
  Шрифты / Fonts: встроены в PDF, дополнительно в папке Fonts/
  Логотип / Logo: векторный SVG в папке Logos/ (для допечатной подготовки)

ВОПРОСЫ / QUESTIONS
  Передайте этот файл вместе с PDF в типографию.
  При возникновении вопросов — свяжитесь с вашей дизайн-студией.

  Send this file along with PDF files to your print shop.
  For questions — contact your brand studio.
`;
  fs.writeFileSync(path.join(dir, 'print-specifications.txt'), specs);
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
