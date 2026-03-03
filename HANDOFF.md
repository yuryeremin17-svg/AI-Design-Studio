# HANDOFF — AI Design Studio
> Дата: 2026-03-03 | Сессия: #4

## Что сделано

1. **Playwright MCP починен**: `.mcp.json` → `@playwright/mcp@latest`
2. **Брендбук Aurelius v2.0** — полностью переделан (2052 строки, 18 секций, inline SVG)
3. **Визуальная проверка** — все 18 секций проверены Playwright-скриншотами
4. **PDF-экспорт (скрипт)** — `scripts/export-pdf.js` создан, работает, но качество неудовлетворительное
5. **План развития** — 7 шагов к полному циклу (файл: `.claude/plans/floating-spinning-dolphin.md`)

## Что НЕ сделано

- [ ] **PDF премиум-качества** — попробовано 3 подхода, ни один не дал print-ready результат. Проблема: @media print ломает layout, скриншоты дают растр. Нужен свежий подход.
- [ ] Web3Forms к бриф-форме (нужен API key)
- [ ] Уникальность Aurelius (сейчас = копия LH-brand)
- [ ] Баг setLang() в бриф-форме
- [ ] Сайт-портфолио
- [ ] Deliver-скрипт (ZIP)
- [ ] Второй тестовый клиент

## Ключевые решения сессии

### Брендбук v2.0 vs v1
| Аспект | v1 (сессия #3) | v2 (сессия #4) |
|--------|---------------|----------------|
| Строки | 1385 | 2052 |
| Секции | 17 | 18 (+ Print Specs) |
| Логотипы | Внешние SVG | Inline SVG `<symbol>` + `<use>` |
| Визитки | 2 варианта | 3 варианта |
| Бланки | 1 | 3 варианта |
| Презентации | Текст | 4 мокапа слайдов |

### PDF-экспорт: что пробовали
1. `page.pdf()` с @media print → layout ломается, контент обрезается
2. Скриншот full-page → нарезка на страницы → разрывы секций
3. `element.screenshot()` посекционно → растровый текст (не премиум)

**Вывод:** Нужно либо переписать @media print с нуля (сложно, хрупко), либо использовать другой инструмент (Puppeteer headerTemplate, wkhtmltopdf, или Prince XML).

## План развития (7 шагов)

Полный план: `.claude/plans/floating-spinning-dolphin.md`

1. **PDF-экспорт** — print-ready качество
2. **Уникальность** — Aurelius ≠ LH (другой шрифт/палитра)
3. **Бриф-форма** — починить setLang() + Web3Forms
4. **Сайт-портфолио** — лендинг + деплой
5. **Автоматизация** — scripts/new-client.js
6. **Deliver** — сборка ZIP
7. **Второй клиент** — другой стиль, тест пайплайна

## Технические заметки

### Playwright CLI
```bash
HOME=/tmp npx playwright@latest screenshot --full-page "file:///path" output.png
```

### npm workaround
```bash
sudo chown -R 501:20 "/Users/apple/.npm"  # одноразово, нужен пароль
HOME=/tmp npx ...  # workaround
```

### Установленные зависимости
```
package.json: playwright ^1.58.2
node_modules/ — в .gitignore нет, добавить!
```

## Следующая сессия → #5
1. Добавить `node_modules/` в `.gitignore`
2. PDF: попробовать подход с `@media print` переписанным с нуля (отдельный CSS файл для print, не встроенный)
3. Двигаться по плану: уникальность → бриф → портфолио

## Структура файлов
```
AI-Design-Studio/
├── .mcp.json              ← ИСПРАВЛЕН
├── scripts/
│   └── export-pdf.js      ← СОЗДАН (рабочий, но качество нужно улучшить)
├── output/aurelius-group/
│   ├── brandbook.html     ← v2.0 (18 секций, откачен к оригиналу)
│   └── print/             ← PDF-файлы (черновые)
├── package.json           ← СОЗДАН (playwright)
└── .claude/plans/         ← План 7 шагов
```
