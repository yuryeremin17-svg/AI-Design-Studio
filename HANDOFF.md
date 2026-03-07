# HANDOFF — AI Design Studio
> Дата: 2026-03-07 | Сессия: #11

## Что сделано в сессии #11

### deliver-v2.js — полная переработка системы доставки

**Спринт 1 (MUST):**
- 1.1 PDF в корень ZIP (из output/*/print/) — клиент сразу видит PDF
- 1.2 HTML перемещены в Interactive/ — не путают клиента
- 1.3 Аватарки 512×512 (dark/light/circle) через Playwright — для WhatsApp/Telegram
- 1.4 README двуязычный (русский + английский)
- 1.5 Шрифты TTF скачиваются из Google Fonts GitHub (OFL лицензия)
- 1.6 Версия + дата сборки в brand.json и README

**Спринт 2 (Бизнес+):**
- 2.1 Email-подпись: signature.html + How-to-Install.txt (Gmail/Outlook/Apple Mail)
- 2.2 Social PNG: экспорт шаблонов по CSS-классам (.ig-post, .ig-story, .linkedin-*)
- 2.3 Print specs: спецификация для типографии (бумага, вылеты, покрытие, RU+EN)
- 2.4 Favicon: 16/32/180px + css-variables.txt для разработчика

**Финальный аудит (после спринтов):**
- try/finally на все Playwright-функции (exportAvatars, exportSocialPng, exportFavicons) — browser всегда закрывается
- try/catch на top-level main — ошибки ловятся с понятным сообщением
- Quick Start добавлен в README — 6 пошаговых инструкций для клиента (RU+EN)

**Архитектурные решения:**
- ESM (import) вместо CJS — совместимость с package.json type:module
- Playwright singleton getPlaywright() — один import на весь скрипт
- Валидация clientName `/^[a-z0-9-]+$/` — защита от command injection
- getChromePath() regex `/^chromium-\d+$/` — точный match

**Результат:**
- Aurelius: 89 KB → 1762 KB (5 PDF + email-sig + favicon + шрифты)
- РубИИльник: 95 KB → 1681 KB (2 PDF + 4 social PNG + favicon + шрифты)
- deliver.js v1 не тронут (архив)
- Web3Forms бриф проверен end-to-end (success: true)

### Решение: остановить разработку, начать продавать
- Спринт 3 (мокапы, PowerPoint) отложен до клиента на Премиум
- Следующий шаг: кейс-стади РубИИльник на лендинг → первый клиент
- Бриф готов к отправке клиенту: templates/brief/brand-brief.html

---

## Что было сделано в сессии #10

- Web3Forms ключ вставлен, GitHub Pages включен
- Шаблоны соцсетей, ценообразование, воронка — Фаза 1 закрыта

---

## Аудит Brand Kit — что сейчас отправляем клиенту

### Текущий ZIP (проблемы):
```
Brand-Kit/
├── Brandbook.html          ← клиент не знает как открыть
├── Business-Cards.html     ← типография не примет
├── Logos/ (SVG + PNG)      ← ОК, но нет аватарки для мессенджеров
├── Colors/colors.json      ← клиент не откроет JSON
└── README.txt              ← на английском, клиент из СНГ не читает
```
PDF уже есть в `output/*/print/`, но в ZIP НЕ попадает!

---

## План доработок deliver.js (полный, после аудита)

### СПРИНТ 1 — MUST (без этого нельзя отдавать клиенту)

| # | Задача | Что делаем | Почему | Как |
|---|--------|------------|--------|-----|
| 1.1 | **PDF в ZIP** | Копировать PDF из print/ в корень ZIP | Клиент ожидает PDF. Типография принимает PDF. PDF уже есть — просто не копируются | 10 строк в deliver.js |
| 1.2 | **HTML → Interactive/** | Переместить HTML в подпапку | В корне только PDF — не путать клиента. HTML оставить для продвинутых (copy HEX, анимации) | Изменить путь копирования |
| 1.3 | **Аватарка 512×512** | Crop icon.svg → PNG (dark/light/circle) | Первое действие клиента — аватарка в WhatsApp/Instagram/Telegram | Playwright crop, 3 варианта |
| 1.4 | **README на русском** | "Какой файл для чего" + как отправить в типографию | Русскоязычный клиент не читает английский README | Переписать generateReadme() |
| 1.5 | **Шрифты TTF** | Скачать Google Fonts TTF, положить в ZIP | Клиент/дизайнер не может сделать презентацию без шрифта. OFL лицензия — можно включать | Скачать из GitHub google/fonts |
| 1.6 | **Версия + дата** | Добавить version в brand.json, показывать в README и footer | После правок — путаница "какой файл актуальный?" | Поле version в brand.json |

### СПРИНТ 2 — ВАЖНО (для Бизнес+)

| # | Задача | Что делаем | Почему | Как |
|---|--------|------------|--------|-----|
| 2.1 | **Email-подпись + инструкция** | Отдельный HTML + PDF "как вставить в Gmail/Outlook" | 20-50 писем/день = бесплатная реклама бренда. Клиент не знает как вставить | HTML есть, написать PDF-инструкцию |
| 2.2 | **Social PNG** | Экспорт шаблонов соцсетей → PNG в ZIP | HTML нельзя загрузить в Instagram. Клиенту нужны готовые картинки | Playwright screenshot каждого шаблона |
| 2.3 | **Спецификация для типографии** | PDF: бумага 300г/м², покрытие, размер, bleed 3мм | Типография спросит — клиент не знает. Предотвращает брак | Новый HTML-шаблон → PDF |
| 2.4 | **Favicon набор** | 16×16, 32×32, 180×180 PNG | Для сайта клиента. Веб-разработчик попросит первым делом | Playwright resize icon.svg |
| 2.5 | **QR-код vCard** | QR с контактами для визитки | Стандарт деловых визиток в ОАЭ. Сканируешь — контакт сохранён | JS-генерация из brand.json |

### СПРИНТ 3 — ПРЕМИУМ

| # | Задача | Что делаем | Почему |
|---|--------|------------|--------|
| 3.1 | **Мокапы** | Визитка в руке, логотип на стене, бланк на столе | Продаёт бренд. Для презентации партнёрам/инвесторам |
| 3.2 | **PowerPoint шаблон** | .pptx с мастер-слайдами в стиле бренда | Клиент делает презентации каждую неделю |
| 3.3 | **Brand One-Pager** | 1 страница: лого + цвета + шрифт + контакт | Быстрая справка, распечатать и повесить |

### SKIP — не делаем сейчас

| Что | Почему |
|-----|--------|
| Brand Portal | Overhead. GitHub Pages = мини-портал. Вернёмся после 10 клиентов |
| CMYK PDF | Онлайн-типографии (99%) принимают RGB. Для премиум-печати — штучно |
| EPS формат | Устарел. SVG — стандарт. Если попросят — конвертируем через Inkscape |

### Без изменений (уже ОК)

| Что | Почему не трогаем |
|-----|-------------------|
| Логотипы SVG + PNG @1x/@2x/@4x | Покрывает все нужды: вектор, документы, веб, печать |
| export-pdf.js | Работает, проверен, не трогать |
| HTML брендбуки/визитки/бланки | Мастер-файлы, изменять только по запросу клиента |
| brand.json | Внутренний, в ZIP не попадает — правильно |
| Воронка (лендинг → бриф → email) | Работает, не трогать |

---

## Безопасность доработок

**Принцип: ничего не ломать, только добавлять.**

| Риск | Как избегаем |
|------|-------------|
| Сломать deliver.js | Создаём deliver-v2.js рядом. Тестируем. Когда работает — заменяем |
| Сломать HTML брендбуки | Не трогаем output/*.html вообще |
| Сломать export-pdf.js | Не трогаем. Новые скрипты — отдельные файлы |
| Клиент не найдёт файлы | После сборки: распаковать ZIP, пройти глазами клиента |

---

## Целевая структура ZIP (после всех спринтов)

```
Brand-Kit/
├── Brandbook.pdf                  ← главный документ (СПРИНТ 1)
├── Business-Cards.pdf             ← для типографии (СПРИНТ 1)
├── Letterhead.pdf                 ← для типографии (СПРИНТ 1, Бизнес+)
├── Logos/
│   ├── logo.svg, logo-light.svg
│   ├── logo@1x.png, @2x.png, @4x.png
│   ├── avatar-512-dark.png        ← NEW (СПРИНТ 1)
│   ├── avatar-512-light.png       ← NEW (СПРИНТ 1)
│   └── avatar-512-circle.png      ← NEW (СПРИНТ 1)
├── Fonts/                          ← NEW (СПРИНТ 1)
│   ├── Manrope-Regular.ttf
│   ├── Manrope-SemiBold.ttf
│   ├── Inter-Regular.ttf
│   └── Inter-Medium.ttf
├── Social/                         ← Бизнес+ (СПРИНТ 2)
│   ├── IG-Post-Dark-1080x1080.png
│   ├── IG-Post-Light-1080x1080.png
│   ├── IG-Story-Dark-1080x1920.png
│   ├── IG-Story-Light-1080x1920.png
│   ├── LinkedIn-Dark-1200x627.png
│   └── LinkedIn-Light-1200x627.png
├── Email-Signature/                ← Бизнес+ (СПРИНТ 2)
│   ├── signature.html
│   └── Instruction-Gmail-Outlook.pdf
├── Print-Specs/                    ← Бизнес+ (СПРИНТ 2)
│   └── print-specifications.pdf
├── Web/                            ← Бизнес+ (СПРИНТ 2)
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── apple-touch-icon-180.png
│   └── css-variables.txt
├── Colors/colors.json
├── Interactive/                    ← для продвинутых
│   ├── Brandbook.html
│   └── Business-Cards.html
└── README.txt                      ← русский + английский (СПРИНТ 1)
```

---

## Глобальный план

### Фаза 1: Готовность к клиентам — DONE
- [x] Бриф-форма (Web3Forms + ключ)
- [x] GitHub Pages (live)
- [x] PDF-экспорт
- [x] Шаблон КП
- [x] Шаблоны соцсетей
- [x] Ценообразование

### Фаза 2: Первые клиенты
- [x] **СПРИНТ 1** — deliver-v2.js (PDF, аватарки, README-RU, шрифты, версия) — DONE сессия #11
- [x] **СПРИНТ 2** — deliver-v2.js (email-подпись, social PNG, print specs, favicon) — DONE сессия #11
- [ ] **Кейс-стади РубИИльник на лендинг** (скриншоты + до/после)
- [ ] Реальный клиент #1 (Старт 5000 AED или бесплатно за отзыв)
- [ ] RTL-адаптация (когда будет арабоязычный клиент)

### Фаза 3: Масштаб
- [ ] **СПРИНТ 3** — мокапы, PowerPoint, Brand One-Pager (Премиум)
- [ ] Автоматизация (бриф → брендбук)
- [ ] Brand Portal (после 10 клиентов)
- [ ] Интеграция с AI Office

---

## Структура файлов
```
AI-Design-Studio/
├── index.html                      <- Лендинг (live на GitHub Pages)
├── package.json                    <- type: module, playwright
├── scripts/
│   ├── deliver.js                  <- ZIP сборка v1 (архив, НЕ ТРОГАТЬ)
│   ├── deliver-v2.js               <- ZIP сборка v2 (ОСНОВНОЙ, Спринт 1+2 готовы)
│   ├── export-pdf.js               <- PDF (НЕ ТРОГАТЬ)
│   └── screenshot-sections.js
├── templates/
│   ├── brief/brand-brief.html      <- Бриф (Web3Forms, ключ вставлен)
│   ├── proposal/proposal.html      <- Шаблон КП (5 страниц)
│   ├── social/social-templates.html <- Шаблоны соцсетей (универсальный)
│   ├── brandbook/starter.html
│   ├── businesscard/starter.html
│   └── letterhead/starter.html
├── assets/logos/
│   ├── aurelius-group/ (outlined SVG)
│   └── rubiilnik/ (outlined SVG, Manrope)
├── output/
│   ├── aurelius-group/ (brandbook, cards, letterhead, presentation, email-sig, print/)
│   └── rubiilnik/ (brandbook, cards, social-templates, print/)
├── delivery/
│   ├── aurelius-group/ (ZIP 1762KB — v2)
│   └── rubiilnik/ (ZIP 1681KB — v2)
└── .claude/commands/
```

## Live
- Лендинг: https://yuryeremin17-svg.github.io/AI-Design-Studio/
- Бриф: https://yuryeremin17-svg.github.io/AI-Design-Studio/templates/brief/brand-brief.html
- GitHub: https://github.com/yuryeremin17-svg/AI-Design-Studio
