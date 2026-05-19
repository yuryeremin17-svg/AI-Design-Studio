# HANDOFF — Geneline Royal Peptides (v3.0)

> Если ты новая сессия Claude и продолжаешь этот проект — прочитай этот файл целиком.
> **Дата последнего обновления:** 2026-05-19, конец сессии #23.
> Старый HANDOFF от утра 2026-05-19 (план перезапуска v2.0) → `HANDOFF-2026-05-19.md`

---

## TL;DR (за 30 секунд)

- **Клиент:** Geneline, продуктовая линия Royal Peptides
- **Задача:** Премиальная обучающая презентация для дистрибьюторов-врачей. 28 слайдов. Single-HTML.
- **Статус:** Собрано **6 из 28 слайдов** в v3.0. Юрий показал обложку клиенту, ждёт реакцию.
- **Работаем конвейером:** Юрий генерит картинки в Midjourney → я вставляю в слайд → собираем структуру.
- **Главный файл:** `output/geneline-royal-peptides/presentation-v3.html`
- **Промпты MJ:** `output/geneline-royal-peptides/mj-prompts.md` — 13 hero-картинок, единый style guide

---

## Что готово в v3.0 (6 слайдов)

Все в едином **split-формате** (текст слева, картинка справа во всю высоту):

| № | Слайд | Контент | Картинка |
|---|---|---|---|
| 01 | Обложка | Royal Peptides · by Doctor Gusarova · куратор + контакты | `ai-visuals/01-cover.png` (MJ) |
| 02 | Дисклеймер | 5 пунктов медицинского дисклеймера (текст дословно из методички, стр. 13-19) | — (SVG-волны) |
| 03 | Оглавление | 8 разделов с описаниями | — (молекулярные иконки) |
| 04 | Не строитель, а сигнал | Базовая теория 01 — что такое пептиды | `ai-visuals/04-signal.png` (MJ) |
| 05 | Ключ к замку | Базовая теория 02 — как работают | `ai-visuals/peptide-receptor-visual.png` (старая, можно заменить на MJ) |
| 10 | Каталог 10 комплексов | Разделитель раздела 02. Список 10 пептидов в 2 колонки. | `ai-visuals/10-catalogue-divider.png` (MJ) |

**Пропуски в нумерации (6-9, 11-28):** в v3 не сделаны. Слайды 6-9 пойдут когда дойдём (SVG, без MJ).

---

## Конвейер работы Юрий ↔ Claude

Юрий **сам гонит Midjourney** (веб-версия, аккаунт есть). Claude **описывает** слайд + **выдаёт промпт**.

**Цикл для каждого AI-слайда:**

1. Claude: «следующий слайд N — тема X, концепция Y. Промпт: ...»
2. Юрий: копирует промпт в MJ → правит `--sref <URL>` со ссылками на готовые эталоны → генерит
3. Юрий: сохраняет PNG в `ai-visuals/` (можно с любым именем, Claude переименует)
4. Юрий: пишет «смотри» / «давай» / кидает PNG
5. Claude: переименовывает, переделывает слайд в split-формат, делает скриншот, показывает
6. Юрий: фидбэк → правки или «дальше»

**Ключ к единству стиля — `--sref`:**

```
--sref URL_ОБЛОЖКИ URL_СЛАЙДА_4 URL_СЛАЙДА_10 --sw 250
```

Чем больше URL-эталонов в `--sref` (через пробел) — тем стабильнее серия. Сейчас 3 эталона в стиле: обложка, 04 сигнал, 10 каталог.

---

## Что дальше (план до 28 слайдов)

### AI-слайды (нужна MJ-картинка)

Промпты — все в `mj-prompts.md`. Метафоры из **методички**, не выдуманные.

- [ ] **Слайд 11 — AMORE** — «Оркестр и дирижёр» (гормональный баланс)
- [ ] **Слайд 12 — ACTIVEBRAIN** — «Мозг как процессор с охлаждением»
- [ ] **Слайд 13 — IMMUNACTIV** — «Вовремя и точно, а не много/мало»
- [ ] **Слайд 14 — NO STRESS** — «Педаль тормоза, которую заело»
- [ ] **Слайд 15 — OXYGEN** — «Датчики безопасности, мост между людьми»
- [ ] **Слайд 16 — RECOVERY** — «Архитектура сна, дельта-волны»
- [ ] **Слайд 17 — RELIEF** — «Расшумить нервную систему»
- [ ] **Слайд 18 — STOPBACTERIA** — «Передовая линия защиты слизистых»
- [ ] **Слайд 19 — STRESSRELIEF** — «Помощь нейронам выжить и восстановить связи»
- [ ] **Слайд 20 — TESTOBOOSTER** — «Желание начинается в мозге, не виагра»
- [ ] **Слайд 28 — Финал** — куратор + контакты, копперные флаконы

### SVG-слайды (без AI, я делаю параллельно)

- [ ] Слайд 06 — Системы организма
- [ ] Слайд 07 — Таблица быстрого выбора
- [ ] Слайд 08 — Алгоритм визита (9-шаговая блок-схема)
- [ ] Слайд 09 — Красные флаги
- [ ] Слайды 21-26 — Сценарии продаж, возражения, ошибки, FAQ

### Доставка клиенту

- **PDF файлом:** `Royal-Peptides-preview-v3.pdf` (6.5 MB сейчас)
- **PNG-альбом для Telegram mobile:** `for-telegram/` — 6 PNG (на iPhone Telegram PDF режет края, PNG-альбом — единственный надёжный путь для mobile)
- **Финальный ZIP:** через `/deliver geneline-royal-peptides` когда будет готово

---

## Правила работы (из этой сессии)

### ✅ Делать

- **Один split-формат для всех концептуальных слайдов** (обложка, разделители, теория) — текст слева 50%, картинка справа 50% во всю высоту
- **Брать метафоры строго из методички** (`file-1_edited 2.docx`) — оркестр, процессор, тормоз, и т.д.
- **Использовать `--sref` от уже сделанных эталонов** — серия будет в одном стиле
- **`cover-text-title--md`** = 96px для длинных заголовков («10 комплексов», «Не строитель»). Дефолтный 124px — только для коротких слов (Royal/Peptides)
- **z-index: 20 на footer-tag и slide-counter** в split-слайдах — иначе утонут под картинкой

### ❌ НЕ делать

- **Не выдумывать контент** — не пиши описания пептидов одной строкой если в методичке этого нет (на разделителе каталога — только названия)
- **Не отправлять PDF в Telegram mobile как превью-картинку** — режет. Только PNG-альбом или PDF как файл (через скрепку «Файл»)
- **Не использовать DOCX** — Word ломает шрифты в Telegram
- **Не возвращаться к старым придуманным метафорам** (петля Мёбиуса для AMORE, спираль для STRESSRELIEF и т.д.) — это всё **выдумки из v1.2**, отвергнутые клиентом
- **Не делать слайды до того как пришла картинка от Юрия** — конвейер работает по очереди

---

## Файлы (где что лежит)

### Под git
```
output/geneline-royal-peptides/
├── presentation-v3.html              ← ГЛАВНЫЙ файл, 6 слайдов
├── mj-prompts.md                     ← 13 промптов MJ, единый style guide
├── brand-strategy.md                 ← обновлена (Lover+Sage, контакты, доктор Gusarova)
├── brand.json
├── brief-response.json
├── HANDOFF.md                        ← этот файл
├── HANDOFF-2026-05-19.md             ← старый план перезапуска v2.0 (для контекста)
├── Royal-Peptides-preview-v3.pdf     ← последний экспорт для пересылки
├── for-telegram/                     ← 6 PNG для mobile-альбома в Telegram
└── ai-visuals/                       ← AI-картинки от Юрия
    ├── 01-cover.png                  (MJ)
    ├── 04-signal.png                 (MJ)
    ├── 10-catalogue-divider.png      (MJ)
    ├── peptide-receptor-visual.png   (старая, на слайде 05)
    ├── body-systems-visual.png       (старая, для слайда 06)
    └── ключ.png                      (резерв)

assets/logos/geneline/
├── logo-mark-official.svg            ← OFFICIAL знак (currentColor) — на слайдах
├── logo-full-official.svg            ← OFFICIAL знак+wordmark
└── sources/                          ← 15 SVG + 15 PDF (5 цветов × 3 формы) из Dropbox
```

### НЕ под git (методичка от клиента)
```
/Users/apple/Documents/WORK/AI-Design-Studio/пептиды преза/
└── file-1_edited 2.docx              ← ИСТОЧНИК всего контента. Юрий сказал: «читай только его»
```

### Memory
```
~/.claude/projects/-Users-apple-Documents-WORK-AI-Design-Studio/memory/
├── project_geneline_royal_peptides.md   ← общий контекст клиента
├── project_geneline_brandbook.md         ← 40 страниц брендбука (постранично)
└── feedback-geneline-overstep.md         ← урок не опережать клиента
```

---

## Бренд (фиксы из этой сессии)

### Палитра (без изменений)
- Айвори `#F8F6EB` (фон)
- Медь / горький шоколад `#8A6646` (акцент)
- Графит-тёмный `#3D3A37` (текст)
- Графит `#5D5D5B`, Латте `#D2C8B5` (вспом)

### Шрифты
- **Display:** Cormorant Garamond (заголовки) — был Inter, поменялось
- **Body:** Inter (текст)
- **Narrow:** PT Sans Narrow (eyebrow, технические подписи)

Все Google Fonts, подключены через `<link>` в `<head>`.

### Логотип
- `<symbol id="logo-mark" viewBox="0 0 292.756 279.033">` встроен в `presentation-v3.html`
- Использовать через `<use href="#logo-mark"/>` + `style="color: var(--copper)"` (currentColor)
- Источник: `assets/logos/geneline/sources/Symbol_Red_Gold.svg`

### Контакты (на обложке)
- Doctor Elena Gusarova
- @doctor__gusarova (ДВА подчёркивания!)
- geneline.ru
- +8 (965) 341-28-64

---

## Технические заметки

### Запуск пересборки PDF + PNG-альбома

```bash
# PDF (для рассылки файлом)
node /tmp/make-pdf.mjs

# PNG-альбом для Telegram mobile
node /tmp/make-png-album.mjs
```

Скрипты лежат в `/tmp/` — могут пропасть. Если что — см. содержимое команд в этом HANDOFF (раздел «как пересобрать»).

### Скрипт `/tmp/make-pdf.mjs` (восстановить если потерян)

```javascript
import { chromium } from '/Users/apple/Documents/WORK/AI-Design-Studio/node_modules/playwright/index.mjs';
const browser = await chromium.launch({
  executablePath: '/Users/apple/Library/Caches/ms-playwright/chromium-1208/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('file:///Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides/presentation-v3.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.pdf({
  path: '/Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides/Royal-Peptides-preview-v3.pdf',
  width: '1600px', height: '900px',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 }
});
await browser.close();
```

### Скрипт `/tmp/make-png-album.mjs` (восстановить если потерян)

```javascript
import { chromium } from '/Users/apple/Documents/WORK/AI-Design-Studio/node_modules/playwright/index.mjs';
const browser = await chromium.launch({
  executablePath: '/Users/apple/Library/Caches/ms-playwright/chromium-1208/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('file:///Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides/presentation-v3.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const slides = await page.$$('section.slide');
const outDir = '/Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides/for-telegram';
for (let i = 0; i < slides.length; i++) {
  await slides[i].scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await slides[i].screenshot({ path: `${outDir}/${String(i+1).padStart(2,'0')}_slide.png` });
}
await browser.close();
```

---

## Точка входа для новой сессии Claude

Если Юрий говорит «продолжаем geneline»:

1. **`git log --oneline -5`** — посмотреть последние коммиты
2. **Прочитать этот HANDOFF.md целиком**
3. **Прочитать memory:**
   - `project_geneline_royal_peptides.md`
   - `project_geneline_brandbook.md`
   - `feedback-geneline-overstep.md` — урок про опережение клиента!
4. **Открыть `presentation-v3.html`** — посмотреть текущие 6 слайдов
5. **Спросить Юрия**: «фидбэк от клиента по обложке пришёл? какой следующий слайд гоним в MJ?»

**Не начинать сначала.** Версия v3.0 — рабочая, 6 слайдов готовы и согласованы по формату.

**Конвейер активен** — Юрий гонит MJ, я вставляю.
