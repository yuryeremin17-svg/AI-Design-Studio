# HANDOFF — AI Design Studio
> Дата: 2026-03-05 | Сессия: #8

## Что сделано в этой сессии (#8)

### B2. Лендинг — рабочие данные (DONE)
- Контакты: `rubelnick.ai@gmail.com`, `+971 58 517 7230`, WhatsApp, Telegram
- OG-теги: title, description, url, twitter card
- Кейсы кликабельные: карточки ведут на `output/*/brandbook.html`
- Визуальная проверка Playwright — OK

### B3. Deploy лендинга (ЧАСТИЧНО)
- Репо сделан публичным (`gh repo edit --visibility public`)
- GitHub Pages включён, но **legacy build зависает** (duration: 0)
- **Блокер:** токен без `workflow` scope — не пушится `.github/workflows/pages.yml`
- **Решение:** обновить токен (Settings > Tokens > добавить workflow scope) или настроить Pages вручную в Settings репо

### Исправления визиток РубИИльник
- `business-cards.html`: добавлен телефон `+971 58 517 7230` и email на оборот обоих вариантов
- `brandbook.html`: добавлен телефон и email в секцию визитки (11) и контакты (12)

## Что осталось

### Глобальный план

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
- [ ] Автоматизация (бриф -> брендбук)
- [ ] Ценообразование по рынку
- [ ] Интеграция с AI Office

## Структура файлов
```
AI-Design-Studio/
├── index.html                      <- Лендинг (контакты, OG, кликабельные кейсы)
├── scripts/
│   ├── deliver.js                  <- brand.json, transparent PNG
│   ├── export-pdf.js
│   └── screenshot-sections.js
├── assets/logos/
│   ├── aurelius-group/ (logo.svg, logo-light.svg) — outlined
│   └── rubiilnik/ (logo.svg, logo-light.svg, icon.svg) — Manrope outlined
├── output/
│   ├── aurelius-group/
│   │   ├── brand.json
│   │   ├── brandbook.html
│   │   ├── business-cards.html
│   │   ├── letterhead.html
│   │   ├── presentation.html
│   │   ├── email-signature.html
│   │   └── archive/
│   └── rubiilnik/
│       ├── brand.json
│       ├── brandbook.html          <- v1.1, 12 секций, Manrope, телефон+email
│       └── business-cards.html     <- 2 варианта, телефон+email
├── delivery/
│   ├── aurelius-group/ (ZIP 89KB)
│   └── rubiilnik/ (ZIP 95KB)
└── .claude/commands/
```

## Live
https://yuryeremin17-svg.github.io/AI-Design-Studio/
