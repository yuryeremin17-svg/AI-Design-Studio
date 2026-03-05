# HANDOFF — AI Design Studio
> Дата: 2026-03-05 | Сессия: #7

## Что сделано в этой сессии (#7) — Аудит качества

### A1. SVG логотипы -> outline (DONE)
- Все 4 SVG (aurelius logo/logo-light, rubiilnik logo/logo-light) — текст конвертирован в `<path>`
- Убран `@import url('https://fonts.googleapis.com/...')` — SVG полностью автономны
- **Открытие:** Space Grotesk НЕ поддерживает кириллицу (Latin/Vietnamese only)
- **Решение:** шрифт РубИИльник заменён на **Manrope** (геометрический, кириллица, 104 chars)
- Конвертация через fonttools (Python) + opentype.js (Node), шрифты скачаны с google/fonts GitHub

### A2. PNG transparent background (DONE)
- `deliver.js` переписан: Playwright с `omitBackground: true` вместо CLI screenshot
- PNG теперь RGBA (4 канала) — прозрачный фон
- Оба ZIP пересобраны (Aurelius 89 KB, РубИИльник 95 KB)

### A3. Брендбук РубИИльник расширен (DONE)
- 10 → 12 секций:
  - **03 О бренде** — расширена: миссия, аудитория, 5 столпов (было 3)
  - **07 Логотип на палитрах** (НОВАЯ) — 3 утверждённых + 4 запрещённых фона
  - **10 Do's & Don'ts** (НОВАЯ) — 4 do + 4 don't с наглядными карточками
  - **11 Визитная карточка** — номер сдвинут
  - **12 Контакты** — номер сдвинут
- **business-cards.html** — отдельный файл, 2 варианта (тёмный/светлый), спецификации печати
- Все `Space Grotesk` заменены на `Manrope` (CSS variable, @import, inline SVG font-family)
- TOC обновлён

### B1. brand.json (DONE)
- `output/aurelius-group/brand.json` и `output/rubiilnik/brand.json`
- `deliver.js` читает brand.json вместо хардкода — новые клиенты не требуют правки скрипта

## Что осталось (следующая сессия)

### B. Важные (не начаты)
- [ ] **B2. Лендинг — рабочие данные** — email, телефон, OG-теги, кликабельные кейсы
- [ ] **B3. Deploy лендинга** — GitHub Pages

### Глобальный план (без изменений)

#### Фаза 1: Готовность к клиентам
- [ ] Бриф-форма (Web3Forms)
- [ ] PDF-экспорт (Paged.js)
- [ ] Шаблон КП

#### Фаза 2: Первые клиенты
- [ ] Реальный клиент #1
- [ ] RTL-адаптация (арабский)
- [ ] Кейс-стади

#### Фаза 3: Масштаб
- [ ] Шаблоны соцсетей
- [ ] Автоматизация (бриф → брендбук)
- [ ] Ценообразование по рынку
- [ ] Интеграция с AI Office

## Структура файлов (обновлена)
```
AI-Design-Studio/
├── index.html                      <- Портфолио-лендинг
├── scripts/
│   ├── deliver.js                  <- Обновлён (brand.json, transparent PNG)
│   ├── export-pdf.js
│   └── screenshot-sections.js
├── assets/logos/
│   ├── aurelius-group/ (logo.svg, logo-light.svg) — outlined, no @import
│   └── rubiilnik/ (logo.svg, logo-light.svg, icon.svg) — Manrope outlined
├── output/
│   ├── aurelius-group/
│   │   ├── brand.json              <- NEW
│   │   ├── brandbook.html
│   │   ├── business-cards.html
│   │   ├── letterhead.html
│   │   ├── presentation.html
│   │   ├── email-signature.html
│   │   └── archive/
│   └── rubiilnik/
│       ├── brand.json              <- NEW
│       ├── brandbook.html          <- v1.1, 12 секций, Manrope
│       └── business-cards.html     <- NEW
├── delivery/
│   ├── aurelius-group/ (ZIP 89KB)
│   └── rubiilnik/ (ZIP 95KB)
└── .claude/commands/
```

## Ключевое решение сессии

**Space Grotesk → Manrope** для РубИИльник. Space Grotesk не имеет кириллицы в Google Fonts (confirmed via fonttools + Google Fonts CSS API). Manrope — ближайший геометрический sans-serif с полной кириллицей (104 chars). Обновлено: логотипы SVG, брендбук, deliver.js colors.json, brand.json.
