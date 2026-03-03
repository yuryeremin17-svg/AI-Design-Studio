/**
 * AI Design Studio — PDF Export (Vector)
 *
 * Использует page.pdf() напрямую — текст и SVG остаются ВЕКТОРНЫМИ.
 * Масштабируется без потери качества. Print-ready.
 *
 * Использование:
 *   node scripts/export-pdf.js <client-name>
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientName = process.argv[2];
if (!clientName) {
  console.error('Использование: node scripts/export-pdf.js <client-name>');
  process.exit(1);
}

const BASE = path.resolve(__dirname, '..');
const clientDir = path.join(BASE, 'output', clientName);
const printDir = path.join(clientDir, 'print');

if (!fs.existsSync(clientDir)) {
  console.error(`Папка не найдена: ${clientDir}`);
  process.exit(1);
}

fs.mkdirSync(printDir, { recursive: true });

const exports = [
  {
    html: 'brandbook.html',
    pdf: 'Brand_Guidelines.pdf',
    label: 'Brand Guidelines',
    format: 'A4',
  },
  {
    html: 'business-cards.html',
    pdf: 'Business_Cards.pdf',
    label: 'Business Cards',
    format: 'A4',
  },
  {
    html: 'letterhead.html',
    pdf: 'Letterhead_A4.pdf',
    label: 'Letterhead',
    format: 'A4',
  },
  {
    html: 'presentation.html',
    pdf: 'Presentation.pdf',
    label: 'Presentation',
    format: 'A4',
  },
  {
    html: 'email-signature.html',
    pdf: 'Email_Signature.pdf',
    label: 'Email Signature',
    format: 'A4',
  },
];

(async () => {
  const browser = await chromium.launch();

  for (const exp of exports) {
    const htmlPath = path.join(clientDir, exp.html);
    if (!fs.existsSync(htmlPath)) continue;

    console.log(`Экспорт: ${exp.label}...`);

    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Google Fonts

    const pdfPath = path.join(printDir, exp.pdf);
    await page.pdf({
      path: pdfPath,
      format: exp.format,
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      preferCSSPageSize: true,
    });

    const mb = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(1);
    console.log(`  ✓ ${exp.pdf} (${mb} MB)`);
    await page.close();
  }

  await browser.close();

  console.log('\nГотово.');
})();
