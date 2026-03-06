# HANDOFF — AI Design Studio
> Дата: 2026-03-06 | Сессия: #9

## Что сделано в этой сессии (#9)

### Фаза 1: Готовность к клиентам

#### 1. Бриф-форма — Web3Forms (DONE)
- `templates/brief/brand-brief.html` — подключена отправка через Web3Forms API
- `submitBrief()` теперь async: FormData → POST → email
- Fallback: если API недоступен → localStorage
- **TODO:** получить access_key на https://web3forms.com (email: rubelnick.ai@gmail.com) и заменить `YOUR_ACCESS_KEY_HERE`

#### 2. CTA на лендинге → бриф (DONE)
- Hero: "Start a project" (primary) + "View portfolio" (outline)
- Навигация: "Start a project" вместо "Get in touch"
- Контакт-секция: "Fill out a brief" + "Email us"
- Все ведут на `templates/brief/brand-brief.html`

#### 3. Шаблон КП (DONE)
- `templates/proposal/proposal.html` — 5 страниц, print-ready
- Cover (тёмная), About + Brief, таблица пакетов, рекомендация + timeline, условия + CTA
- Placeholder-переменные: `{{CLIENT_NAME}}`, `{{DATE}}`, `{{RECOMMENDED_PACKAGE}}`, `{{BRIEF_SUMMARY}}`
- Шрифты: Space Grotesk + Inter, стиль: тёмная обложка + светлые страницы

#### 4. PDF-экспорт — проверен (DONE)
- `scripts/export-pdf.js` работает для обоих клиентов
- Aurelius: 5 PDF (brandbook 1.3MB, cards, letterhead, presentation, email sig)
- РубИИльник: 2 PDF (brandbook 0.8MB, cards)
- Добавлен `"type": "module"` в package.json (убрал warning)

#### 5. Playwright-проверка (DONE)
- Лендинг, бриф, КП — визуально OK

## Что осталось

### Блокеры (требуют действий Юрия)
- [ ] **Web3Forms key** — зайти на https://web3forms.com → ввести rubelnick.ai@gmail.com → получить access_key → заменить в `templates/brief/brand-brief.html`
- [ ] **GitHub Pages** — Settings → Pages → "Deploy from branch" → master / root. Или обновить токен (добавить workflow scope)

### Глобальный план

#### Фаза 1: Готовность к клиентам — DONE
- [x] Бриф-форма (Web3Forms)
- [x] PDF-экспорт (проверен, работает)
- [x] Шаблон КП

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
├── index.html                      <- Лендинг (CTA → бриф, OG, кликабельные кейсы)
├── package.json                    <- type: module, playwright
├── scripts/
│   ├── deliver.js                  <- ZIP сборка
│   ├── export-pdf.js               <- PDF (vector, print-ready) ✓ проверен
│   └── screenshot-sections.js
├── templates/
│   ├── brief/brand-brief.html      <- Бриф-форма (Web3Forms, 5 шагов, EN/RU)
│   ├── proposal/proposal.html      <- Шаблон КП (5 страниц, print-ready) NEW
│   ├── brandbook/starter.html
│   ├── businesscard/starter.html
│   └── letterhead/starter.html
├── assets/logos/
│   ├── aurelius-group/ (outlined SVG)
│   └── rubiilnik/ (outlined SVG, Manrope)
├── output/
│   ├── aurelius-group/ (brandbook, cards, letterhead, presentation, email-sig, print/)
│   └── rubiilnik/ (brandbook, cards, print/)
├── delivery/
│   ├── aurelius-group/ (ZIP 89KB)
│   └── rubiilnik/ (ZIP 95KB)
└── .claude/commands/
```

## Live
https://yuryeremin17-svg.github.io/AI-Design-Studio/ (ожидает настройки Pages)
