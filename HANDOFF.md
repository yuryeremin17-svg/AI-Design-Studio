# HANDOFF — AI Design Studio
> Дата: 2026-03-22 | Сессия: #19

## Что сделано в сессии #19

### Birca Kolet — доработка по фидбэку клиента (Максим)

**Фидбэк от Максима:**
1. Логотип — идея бирки ОК, но "обыграть интереснее"
2. Цвета — "грязно и мрачно" → хочет ярче, чище
3. Шрифт — Montserrat "заезженный"
4. Референс — 3D буква B из зелёной ленты (прислал свою картинку)

**Что сделано:**

1. **Мозговой штурм** — 3 независимых креативщика (Agent), каждый со своим вариантом:
   - A: 3D Ribbon B (отброшен — SVG слишком угловатый)
   - B: Smart Flat / Geometric Tag (отброшен — не понравился)
   - C: Tag-Integrated Wordmark (выбран Юрием)

2. **Concept C — Tag-Integrated Wordmark:**
   - Буква "I" в BIRCA = бирка с отверстием и петлёй нити (лаймовый акцент)
   - Механизм FedEx — скрытый символ прямо в названии
   - Шрифт: Nunito Sans ExtraBold (outlined через opentype.js)
   - Outlined SVG paths — не зависит от загрузки шрифтов

3. **Новая палитра (по фидбэку):**
   - #00A85A (Vivid Green, ярче прежнего #008C53)
   - #7ED321 (Lime, чище прежнего #8DB838)
   - #CEFF00 (Signal Lime — из preferred_colors клиента)
   - #FAF8F5 (Warm White)
   - #1A1A1A (Rich Black, нейтральный вместо болотного #1A3A2A)

4. **Каскадное обновление всех файлов:**
   - brandbook.html — CSS переменные + hardcoded HEX + SVG symbols + названия цветов + RGB
   - social-templates.html — CSS переменные + 7 wordmark SVG + 6 icon SVG + заголовок
   - brand.json — палитра + шрифт
   - brand-strategy.md — палитра + шрифтовые пары
   - email-draft.html — ссылочный цвет
   - SVG логотипы: logo.svg, logo-light.svg, icon.svg — Concept C outlined

5. **logo-presentation-v2.html** — сравнение "До/После" для Максима

6. **Скриншоты** — убраны из корня проекта в output/birca-kolet/screenshots/

**Урок сессии:** При каскадном обновлении бренда — менять ВСЁ за один проход (CSS переменные + hardcoded HEX + inline SVG symbols + текстовые упоминания). Записано в memory.

### Что осталось по Birca Kolet
- [ ] Показать Максиму (logo-presentation-v2 + brandbook через GitHub Pages)
- [ ] Фидбэк от Максима (раунд 2)
- [ ] Правки по фидбэку (если будут)
- [ ] /deliver — сборка ZIP

---

> Дата: 2026-03-18 | Сессия: #16

## Что сделано в сессии #16

### Аудит по чек-листу — внедрён
- **refs/AUDIT_CHECKLIST.md** — 6 секций (A-F), 25 пунктов проверки
  - A: данные клиента vs brief-response.json
  - B: сверка с brand-strategy.md (архетип, палитра, шрифты, ToV, luxury-шкала)
  - C: консистентность между файлами (grep)
  - D: визуальное качество (Playwright)
  - E: функциональность по типу файла (просмотр vs fillable)
  - F: доставка (brand.json формат, ZIP, превью в мессенджерах)
- **.claude/rules/quality-check.md** — переписан: жёсткая ссылка на чек-лист, запрет "на глаз"
- **CLAUDE.md** — добавлена секция "Аудит deliverables"

### Fillable PDF для бланков — правило внедрено
- **CLAUDE.md** — новая секция "Форматы файлов — когда какой"
  - Брендбук/визитки → HTML → Chrome PDF (как было)
  - Бланки для контрактов → Fillable PDF (reportlab)
  - DOCX → только по явному запросу клиента
- **Memory: reference_fillable_pdf.md** — 7 граблей reportlab + ссылка на скрипт из LH-brand

### Источник: проект LH-brand
- Прочитан refs/TZ_FOR_DESIGN_STUDIO.md — ТЗ от Claude (LH-brand) для Claude (AI-Design-Studio)
- Взято: fillable PDF, грабли reportlab, правило форматов
- Не взято: ОАЭ-специфика (нет клиента), полный чек-лист LH (создан свой)

### Обнаруженный баг (не в этом проекте)
- ~/.claude/CLAUDE.md строка 66: ссылка на refs/AUDIT_PROMPT.md — файл не существует ни в одном проекте
- Зафиксировать в AI_OFFICE при следующей ревизии глобальных инструкций

---

> Дата: 2026-03-08 | Сессия: #15

## Что сделано в сессии #15

### Bloshka DELUXE — Brand Algorithm применён к дизайну

**Фаза 1 (brief-analysis.md):**
- WebFetch всех 3 URL: 3soroki.ru, neustarelo.ru, kaoristore.ru
- Конкурентный аудит: таблица 8×2, white space (dusty plum/rose свободен), дифференциатор
- Анализ liked_logos: Chanel, Dior, Celine — таблица 8 характеристик → что берём
- Positioning map: "доступный + тёплый" = незанятый квадрант

**Фаза 2 (brand-strategy.md — НОВЫЙ):**
- Архетип: Lover 70% + Caregiver 30% (не Ruler!)
- Палитра обоснована через 5 критериев, контраст 12.4:1 и 9.4:1
- Tone of Voice: 3 "говорим" + 3 "не говорим" + стиль обращения
- Психо-чеклист: все 8 пунктов

**Фаза 4 — Аудит дизайна vs стратегия (ключевой урок сессии):**
- Обложка БЫЛА: тёмный plum + двойная рамка = Ruler (luxury=4)
- Обложка СТАЛА: Warm Ivory + plum логотип + одинарная рамка = Lover/Caregiver (luxury=2)
- Двойная рамка убрана с обложки (осталась только на визитках)
- Секция Tone of Voice добавлена в брендбук (секция "О бренде")
- brand.json переведён в формат palette для deliver-v2.js

**ZIP собран:** delivery/bloshka-deluxe/Bloshka-Deluxe-Brand-Kit.zip (1024 KB, 48 файлов)

### Brand Algorithm v2.1 — критический фикс

**Проблема:** алгоритм позволял заполнить документы стратегии и НЕ применить их к дизайну. Стратегия ≠ действие.

**Решение:**
- Добавлен **шаг 4.4** — обязательный аудит каждого HTML vs brand-strategy.md (таблица сверки)
- **Gate 4 усилен**: первый пункт = "аудит vs стратегия пройден", без него нельзя к доставке
- Антипаттерн задокументирован: "заполнить стратегию → посмотреть что дизайн и так ОК → не менять → сдать"

**Правила в MEMORY.md (4-7):**
- Стратегия без применения = бесполезная бумага
- Не спрашивать "делаю?" — реализовывать
- Обложка определяется архетипом, не шаблоном
- brand.json формат проверять до deliver

---

### Что осталось по Bloshka DELUXE
- [ ] Показать клиенту через WhatsApp (+79037221134)
- [ ] Правки по фидбеку (раунд 1 из 2)
- [ ] PDF экспорт (если клиент попросит)

---

> Дата: 2026-03-08 | Сессия: #14

## Что сделано в сессии #14

### Brand Algorithm v2 — полный pipeline от брифа до доставки
- **BRAND-ALGORITHM.md** — 6 фаз, 4 gate-проверки, инструменты ИИ на каждом шаге
- **references/** — 4 справочника (архетипы, шрифты, цвета, психология)
- **templates/strategy/** — 2 шаблона обязательных артефактов (brief-analysis, brand-strategy)
- **/new-client** обновлён — шаг 3 = обязательный Brand Algorithm
- **CLAUDE.md** обновлён — gate-правило, ссылки на справочники, единый источник шрифтов
- **Инцидент:** git add подхватил удаления файлов — откачен через git revert, все файлы целы

### Что решает алгоритм:
- Каждое дизайн-решение обосновано через бриф (не "потому что красиво")
- WebFetch всех ссылок обязателен
- Превью клиенту ПЕРЕД производством (Фаза 3)
- Gate-проверки не дают пропустить этапы

---

## Bloshka DELUXE — ПЕРВЫЙ РЕАЛЬНЫЙ КЛИЕНТ (в работе)

**Статус:** палитра + логотип утверждены, брендбук + social-templates сделаны, НО brief-analysis и brand-strategy нужно переделать по новому алгоритму
**Пакет:** Старт (5-8K AED), срок 1 неделя
**Клиент:** Лариса Власова, винтаж и антиквариат (посуда, сервировка), СНГ
**WhatsApp:** +79037221134 | Email: lvlasova2016@yandex.ru

**Утверждено:**
- Стиль: Classic Luxury / Vintage Elegance
- Шрифты: Cormorant Garamond (Light 300) + DM Sans
- Палитра: Dusty Plum #5C3A4E + Champagne Gold #C5A882 + Muted Rose #B8929B + Warm Ivory #F8F4F0 + Deep Mauve #3D2B35 (текст, без чёрного)
- Логотип: BLOSHKA + золотой разделитель + DELUXE (outlined SVG, 3 варианта)
- Превью: `output/bloshka-deluxe/palette-preview.html`

**Готово:**
- [x] Структура: `assets/logos/bloshka-deluxe/`, `output/bloshka-deluxe/`
- [x] brand.json
- [x] Логотип SVG outlined: logo.svg (dark), logo-light.svg (light), icon.svg (B)
- [x] palette-preview.html — клиент одобрил

**Осталось:**
- [ ] Переделать brief-analysis.md по новому шаблону (Фаза 1 алгоритма)
- [ ] Создать brand-strategy.md (Фаза 2 алгоритма)
- [ ] Пересмотреть дизайн-решения через призму стратегии
- [ ] Визитные карточки (1 вариант, лицо + оборот)
- [ ] Визуальная проверка Playwright
- [ ] Сборка ZIP через /deliver
- [ ] Отправить клиенту

**Важно при продолжении:**
- SVG логотипы используются INLINE (не через `<img>`) — viewBox 359x118
- Шрифт Cormorant Garamond скачан с gstatic (не GitHub raw — тот даёт HTML redirect)
- fonttools для outlined: `/tmp/fontenv/bin/python3` (venv, может потребовать пересоздания)
- Ориентиры клиента: Chanel, Dior, Celine — минимализм, элегантность

---

## Что сделано в сессии #12

### Кейс-стади РубИИльник на лендинг
- 4 скриншота брендбука через Playwright: обложка, логотип, палитра, визитки
- Сохранены в `assets/portfolio/rubiilnik/` (284 KB суммарно, `loading="lazy"`)
- Новая секция Case Study в `index.html` — под карточками портфолио
- Содержит: галерея 2x2, описание клиента/deliverables/стиль, CTA на интерактивный брендбук
- Карточка РубИИльник ведёт якорем на кейс-стади (smooth scroll)
- Остальные секции (Hero, Services, Process, Contact, Footer) не тронуты

### Фикс бриф-формы — Cloudflare блокировал отправку
- **Проблема:** Web3Forms включил Cloudflare protection. `fetch()` получал HTML challenge вместо JSON → catch показывал ложное "спасибо" → письмо не уходило
- **Решение:** `fetch()` заменён на обычный `form.submit()` (HTML form POST). Cloudflare пропускает нативные form POST через challenge прозрачно для пользователя
- **Redirect:** Web3Forms поле `redirect` возвращает на `?sent=1` → JS показывает successScreen → `history.replaceState` чистит URL
- **Fallback:** `localStorage` бэкап перед отправкой + экран ошибки с WhatsApp/Telegram/Email (хотя при form POST он практически недостижим)
- **Тест:** localhost HTTP → Playwright → реальный POST → 3 письма дошли на rubelnick.ai@gmail.com

### Что НЕ тронуто
- deliver-v2.js, export-pdf.js — не тронуты
- output/ — только чтение для скриншотов
- templates/ (кроме brand-brief.html) — не тронуты

---

## Следующие шаги
- [ ] Первый реальный клиент (Старт 5000 AED или бесплатно за отзыв)
- [ ] Кейс-стади Aurelius (аналогично, когда будет второй клиент — для социального доказательства)
- [ ] RTL-адаптация (когда будет арабоязычный клиент)
- [ ] Спринт 3 deliver-v2.js — мокапы, PowerPoint, One-Pager (когда клиент на Премиум)

---

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
