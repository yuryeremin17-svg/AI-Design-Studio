#!/usr/bin/env node

/**
 * Brand Kit Delivery Script
 * Собирает ZIP-архив для клиента: HTML, логотипы (SVG+PNG), colors.json
 *
 * Usage: node scripts/deliver.js <client-name>
 * Example: node scripts/deliver.js aurelius-group
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const clientName = process.argv[2];

if (!clientName) {
  console.error('Usage: node scripts/deliver.js <client-name>');
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

// --- Main ---
console.log(`\nPreparing Brand Kit for: ${brandKitName}`);
console.log('='.repeat(50));

// Clean previous delivery
if (fs.existsSync(deliveryDir)) {
  fs.rmSync(deliveryDir, { recursive: true });
}

const kitDir = path.join(deliveryDir, brandKitName);
fs.mkdirSync(kitDir, { recursive: true });

// 1. Copy HTML files
console.log('\n1. Copying HTML files...');
const htmlFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
  const dest = formatFileName(file);
  fs.copyFileSync(path.join(outputDir, file), path.join(kitDir, dest));
  console.log(`   ${dest}`);
}

// 2. Copy & export logos
console.log('\n2. Exporting logos...');
const logosOutDir = path.join(kitDir, 'Logos');
fs.mkdirSync(logosOutDir, { recursive: true });

if (fs.existsSync(logosDir)) {
  const svgFiles = fs.readdirSync(logosDir).filter(f => f.endsWith('.svg'));
  for (const svg of svgFiles) {
    // Copy SVG (vector, for designers)
    fs.copyFileSync(path.join(logosDir, svg), path.join(logosOutDir, svg));
    console.log(`   SVG: ${svg}`);

    // Export PNG at multiple sizes using built-in rsvg or sips
    const baseName = svg.replace('.svg', '');
    exportSvgToPng(path.join(logosDir, svg), logosOutDir, baseName);
  }
} else {
  console.log('   No logo directory found, skipping...');
}

// 3. Generate colors.json
console.log('\n3. Generating colors.json...');
const colorsDir = path.join(kitDir, 'Colors');
fs.mkdirSync(colorsDir, { recursive: true });
const colors = extractColors(clientName);
fs.writeFileSync(
  path.join(colorsDir, 'colors.json'),
  JSON.stringify(colors, null, 2)
);
console.log(`   ${Object.keys(colors.palette).length} colors exported`);

// 4. Generate README for the client
console.log('\n4. Creating README...');
generateReadme(kitDir, brandKitName, htmlFiles, colors);

// 5. Create ZIP
console.log('\n5. Creating ZIP archive...');
const zipPath = path.join(deliveryDir, `${brandKitName}.zip`);
execSync(`cd "${deliveryDir}" && zip -r "${zipPath}" "${brandKitName}"`, { stdio: 'pipe' });
const zipSize = (fs.statSync(zipPath).size / 1024).toFixed(0);
console.log(`   ${brandKitName}.zip (${zipSize} KB)`);

// Done
console.log('\n' + '='.repeat(50));
console.log(`Brand Kit ready: ${deliveryDir}/`);
console.log(`ZIP archive: ${zipPath}`);
console.log(`\nContents:`);
listDir(kitDir, '  ');

// --- Helpers ---

function formatBrandKitName(name) {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-') + '-Brand-Kit';
}

function formatFileName(file) {
  // brandbook.html -> Brandbook.html, business-cards.html -> Business-Cards.html
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
      // Try rsvg-convert first (best quality)
      execSync(`rsvg-convert -w ${width} "${svgPath}" -o "${pngPath}" 2>/dev/null`, { stdio: 'pipe' });
      console.log(`   PNG: ${baseName}${suffix}.png (${width}px)`);
    } catch {
      try {
        // Fallback: use sips (macOS built-in) via temporary conversion
        // sips can't handle SVG directly, use Playwright if available
        exportWithPlaywright(svgPath, pngPath, width);
        console.log(`   PNG: ${baseName}${suffix}.png (${width}px)`);
      } catch {
        console.log(`   SKIP: ${baseName}${suffix}.png (no SVG converter found)`);
      }
    }
  }
}

function exportWithPlaywright(svgPath, pngPath, width) {
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  // Get aspect ratio from viewBox
  const viewBoxMatch = svgContent.match(/viewBox="(\d+)\s+(\d+)\s+(\d+)\s+(\d+)"/);
  const aspectRatio = viewBoxMatch ? parseInt(viewBoxMatch[4]) / parseInt(viewBoxMatch[3]) : 0.3;
  const height = Math.round(width * aspectRatio);

  const html = `<html><body style="margin:0;padding:0;background:transparent">
    <img src="file://${svgPath}" width="${width}" height="${height}">
  </body></html>`;
  const tmpHtml = path.join('/tmp', 'svg-export.html');
  fs.writeFileSync(tmpHtml, html);

  execSync(
    `HOME=/tmp npx playwright@latest screenshot --viewport-size="${width},${height}" "file://${tmpHtml}" "${pngPath}" 2>/dev/null`,
    { stdio: 'pipe', timeout: 30000 }
  );
}

function extractColors(clientName) {
  // Client-specific color data
  const clientColors = {
    'aurelius-group': {
      brand: 'Aurelius Group',
      style: 'Luxury / Old Money',
      palette: {
        'Navy (Primary)': { hex: '#010110', rgb: '1, 1, 16', usage: 'Backgrounds, primary text' },
        'Gold (Accent)': { hex: '#BE9A64', rgb: '190, 154, 100', usage: 'Accent elements, decorations, logo' },
        'Cream (Light)': { hex: '#F5F0E8', rgb: '245, 240, 232', usage: 'Light backgrounds, paper' },
        'White': { hex: '#FFFFFF', rgb: '255, 255, 255', usage: 'Text on dark backgrounds' },
        'Warm Gray': { hex: '#8A8A8A', rgb: '138, 138, 138', usage: 'Secondary text, captions' },
      },
      fonts: {
        heading: 'Cormorant Garamond (300, 400, 600)',
        body: 'DM Sans (300, 400)',
        source: 'Google Fonts'
      }
    },
    'rubiilnik': {
      brand: 'РубИИльник',
      style: 'Tech Premium / Warm Minimalism',
      palette: {
        'Deep Blue (Primary)': { hex: '#0F2B4C', rgb: '15, 43, 76', usage: 'Backgrounds, primary text' },
        'Copper Electric (Accent)': { hex: '#C46B2A', rgb: '196, 107, 42', usage: 'Accents, CTA, "ИИ" highlight' },
        'Warm Sand (Secondary)': { hex: '#C4A87C', rgb: '196, 168, 124', usage: 'Decorations, tagline, frames' },
        'Warm White (Light)': { hex: '#FAF7F2', rgb: '250, 247, 242', usage: 'Light backgrounds, paper' },
      },
      fonts: {
        heading: 'Space Grotesk (400, 500, 600, 700)',
        body: 'Inter (300, 400, 500, 600)',
        source: 'Google Fonts'
      }
    }
  };

  if (clientColors[clientName]) {
    return clientColors[clientName];
  }

  // Fallback: try to parse from brandbook HTML
  const brandbook = path.join(ROOT, 'output', clientName, 'brandbook.html');
  if (fs.existsSync(brandbook)) {
    const html = fs.readFileSync(brandbook, 'utf8');
    const hexMatches = [...new Set(html.match(/#[0-9A-Fa-f]{6}/g) || [])];
    return {
      brand: clientName,
      palette: Object.fromEntries(hexMatches.slice(0, 10).map((hex, i) => [`Color ${i + 1}`, { hex }])),
      fonts: { note: 'Extracted automatically, verify manually' }
    };
  }

  return { brand: clientName, palette: {}, fonts: {} };
}

function generateReadme(kitDir, brandKitName, htmlFiles, colors) {
  const clientDisplayName = colors.brand || brandKitName.replace('-Brand-Kit', '');
  const readme = `${clientDisplayName} — Brand Kit
${'='.repeat(clientDisplayName.length + 14)}

How to use this kit
-------------------

BRANDBOOK
  Open Brandbook.html in any modern browser (Chrome, Safari, Firefox).
  This is your complete brand guidelines document.
  To print or save as PDF: Ctrl+P (Cmd+P on Mac) > Save as PDF.

LOGOS (Logos/ folder)
  .svg files — vector format for designers, print, and large formats.
  @1x.png — standard size (400px width) for documents and email.
  @2x.png — double size (800px) for presentations and web.
  @4x.png — high-res (1600px) for print and large displays.

COLORS (Colors/colors.json)
  Complete color palette with HEX and RGB values.
  Share this file with your designer, developer, or print shop.

OTHER FILES
${htmlFiles.filter(f => f !== 'brandbook.html').map(f => `  ${formatFileName(f)} — open in browser`).join('\n')}

For questions: contact your brand studio.
`;
  fs.writeFileSync(path.join(kitDir, 'README.txt'), readme);
  console.log('   README.txt');
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
