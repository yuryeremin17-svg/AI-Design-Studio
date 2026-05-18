# HANDOFF — Geneline Royal Peptides

> Если ты новая сессия Claude и продолжаешь этот проект — прочитай этот файл целиком.
> Дата последнего обновления: **2026-05-18**, конец сессии #22.

---

## TL;DR (за 30 секунд)

- **Клиент:** Geneline, продуктовая линия Royal Peptides
- **Задача:** Обучающий курс для дистрибьюторов-врачей (10 пептидных комплексов)
- **Статус:** ✅ Готов v1.2, отдан клиенту через ZIP. Ждём фидбэк.
- **Что отдано:** HTML-презентация 36 слайдов + PDF + 36 PNG + README → ZIP 8.2 MB
- **Стиль:** в фирстиле Geneline (айвори+медь, Manrope), не тёмный sci-fi NotebookLM
- **Git:** всё закоммичено и запушено в `master` (commit `e8f1b34`)

---

## Файлы проекта (где что лежит)

### Исходники (под git)

```
output/geneline-royal-peptides/
├── presentation.html              ← главный HTML-файл, 36 слайдов
├── Royal-Peptides-by-Geneline-Training.pdf   ← PDF 1.5 MB для рассылки
├── brand.json                     ← палитра/шрифты/контакты по нашему стандарту
├── brand-strategy.md              ← стиль бренда, антипаттерны, применение
├── brief-response.json            ← бриф клиента и контекст работы
├── slides/                        ← 36 PNG 1600×900 (по 1 на слайд)
└── HANDOFF.md                     ← этот файл

assets/logos/geneline/
├── logo-mark.svg                  ← знак (4-элементная молекула G)
└── logo-full.svg                  ← знак + GENELINE wordmark

delivery/geneline-royal-peptides/
├── Royal-Peptides-Training-Package.zip    ← ГЛАВНЫЙ ZIP клиенту (8.2 MB)
└── Geneline-Royal-Peptides-Brand-Kit.zip  ← вспомогательный (524 KB, от deliver-v2)
```

### Исходные материалы клиента (под `пептиды преза/`, НЕ в git)

```
/Users/apple/Documents/WORK/AI-Design-Studio/пептиды преза/
├── Geneline_guideline.pdf               (152 MB) — брендбук клиента 40 стр.
├── file-1_edited 2.docx                 (71 KB) — методичка 92K знаков (КОНТЕНТ)
├── Royal-Peptides-Training (1).pdf      (6.7 MB) — работа другого Claude (НЕ использовать, только референс структуры)
└── Peptide_Specialist_Playbook (1).pdf  (17 MB) — версия от NotebookLM (НЕ использовать, тёмный sci-fi стиль, нарушает брендбук)
```

### Memory (всегда подгружается)

```
~/.claude/projects/-Users-apple-Documents-WORK-AI-Design-Studio/memory/
├── MEMORY.md                                  ← Geneline в начале списка клиентов
└── project_geneline_royal_peptides.md          ← полная инфо по бренду
```

---

## Бренд (всё что нужно знать)

### Палитра
- **Айвори** `#F8F6EB` — фон всех слайдов (НЕ менять на тёмный!)
- **Горький шоколад / медь** `#8A6646` — основной акцент
- **Тёмный графит** `#3D3A37` — основной текст
- **Графит** `#5D5D5B`, **Латте** `#D2C8B5`, **Тёплый бетон** `#B1B0A9`, **Песочный беж** `#D3B489` — вспомогательные
- **Семантические:** `#2E7D32` (зелёный «ОК»), `#B07A0E` (охра «корректировать»), `#B33A2F` (красный «стоп») — только для медицинской визуализации

### Шрифты
- **Manrope** (Google Fonts, weights 300-800) — substitute для платного TT Norms из брендбука
- **PT Sans Narrow** (Google Fonts, weights 400/700) — для технических подписей, eyebrow

### Логотип Geneline (КРИТИЧНО!)
**4-элементная молекулярная композиция:**
1. Большой круг с буквой G
2. Средний круг сверху-справа + точка-сателлит
3. Маленький круг слева
4. Точка снизу-справа

Все 4 элемента ОБЯЗАТЕЛЬНЫ. Упрощение запрещено (по стр. 14 брендбука).
SVG: `assets/logos/geneline/logo-mark.svg`, используется inline через `<symbol id="logo-mark">` в `presentation.html`.

### Графический язык
- Молекулярные кружки на фоне (декоративные градиенты в углах слайдов)
- Тонкие волнистые линии — НЕ использованы пока, можно добавить
- НЕ использовать эмодзи как иконки — только SVG в фирстиле

---

## Структура презентации (36 слайдов)

| № | Слайд | Что особенного |
|---|---|---|
| 01 | Обложка | Огромный медный заголовок «ПЕПТИДНЫЕ КОМПЛЕКСЫ», pill-теги |
| 02 | Структура курса | 6 модулей карточками с номерами |
| 03 | Дисклеймер | 5 пунктов + блоки «для кого» и «как использовать» |
| 04 | Модуль 01 title | |
| 05 | Что такое пептиды | **Большая SVG-иллюстрация** механизма (ДНК → пептид → клетка) |
| 06 | Что регулируют пептиды | 5 пиктограмм систем организма |
| 07 | Принцип «ключ → замок» | **Большая SVG-иллюстрация** ключа и замка (НОВЫЙ слайд v1.2) |
| 08 | Пептиды vs препараты | Таблица сравнения |
| 09 | Модуль 02 title | |
| 10 | Таблица быстрого выбора | Запрос → комплекс (pill-таблица) |
| 11 | Карта 10 комплексов | **Силуэт человека** + иконки-метафоры по группам |
| 12 | Модуль 03 title | |
| 13–22 | 10 карточек комплексов | Hero-блок медный + иконка-метафора + 4 секции справа. STOPBACTERIA (20) — с иллюстрацией мембраны клетки |
| 23 | Модуль 04 title | |
| 24 | Алгоритм визита | **Блок-схема 8 шагов** с акцентом на «красные флаги» (4) |
| 25 | Красные флаги | 2 колонки противопоказаний |
| 26 | Контрольная точка | **Горизонтальный таймлайн** + 3 цветных решения |
| 27 | Модуль 05 title | |
| 28 | Готовые формулировки | 6 скриптов |
| 29 | Возражения | 5 ответов |
| 30 | Ошибки и юр.риски | 5 ошибок |
| 31 | Модуль 06 title | |
| 32 | Кейсы 1-2 | Стресс / туман в голове |
| 33 | Кейсы 3-4 | ОРВИ / снижение либидо |
| 34 | FAQ | 8 вопросов в 2 колонки |
| 35 | Чек-лист специалиста | 4 секции с галочками |
| 36 | Финал | Большой логотип + контакты + слоган |

---

## Контакты клиента Geneline (по работе)

- **Тел:** +7 (916) 568-27-01
- **Telegram / Instagram:** @geneline.clinic
- **Сайт:** geneline.clinic
- **Слоган:** «Ваша лучшая генетическая линия»

---

## Технический стек

### Как пересобрать всё с нуля
```bash
cd /Users/apple/Documents/WORK/AI-Design-Studio
node /tmp/build-all.mjs            # 36 PNG + PDF
# Скрипт лежит в /tmp/ — если потеряется, см. ниже как воссоздать
```

### Содержимое `/tmp/build-all.mjs` (если потеряется)
```javascript
import { chromium } from '/Users/apple/Documents/WORK/AI-Design-Studio/node_modules/playwright/index.mjs';
import { mkdirSync, existsSync } from 'fs';
const file = 'file:///Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides/presentation.html';
const outDir = '/Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides';
const pngDir = `${outDir}/slides`;
if (!existsSync(pngDir)) mkdirSync(pngDir, { recursive: true });
const b = await chromium.launch({
  executablePath: '/Users/apple/Library/Caches/ms-playwright/chromium-1208/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
});
const p = await b.newPage({ viewport: { width: 1600, height: 900 }});
await p.goto(file, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const slides = await p.locator('section.slide').all();
for (let i = 0; i < slides.length; i++) {
  await slides[i].screenshot({ path: `${pngDir}/slide_${String(i+1).padStart(2,'0')}.png` });
}
await p.emulateMedia({ media: 'print' });
await p.pdf({ path: `${outDir}/Royal-Peptides-by-Geneline-Training.pdf`, width: '1600px', height: '900px', printBackground: true, margin: { top:0, right:0, bottom:0, left:0 }});
await b.close();
```

### Как пересобрать ZIP
```bash
rm -rf /tmp/genepak && mkdir -p /tmp/genepak/Interactive /tmp/genepak/Slides-PNG
cp /Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides/Royal-Peptides-by-Geneline-Training.pdf /tmp/genepak/
cp /Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides/presentation.html /tmp/genepak/Interactive/
cp /Users/apple/Documents/WORK/AI-Design-Studio/output/geneline-royal-peptides/slides/*.png /tmp/genepak/Slides-PNG/
# README.txt — взять из последнего ZIP или см. ниже
cd /tmp/genepak && zip -r /Users/apple/Documents/WORK/AI-Design-Studio/delivery/geneline-royal-peptides/Royal-Peptides-Training-Package.zip . -x ".*"
```

### Откат к предыдущей версии (если новый эксперимент не зайдёт)
```bash
# Версии:
# fe9087a — v1.0 (34 слайда, без визуализации)
# 01a6baa — v1.1 (35 слайдов, базовые SVG-иллюстрации)
# 2b47f98 — v1.2 (36 слайдов, премиум-иллюстрации в фирстиле, крупный шрифт)  ← АКТУАЛЬНАЯ
# e8f1b34 — audit (документация: brand-strategy.md, brief-response.json)

git reset --hard 2b47f98   # откатить к рабочей v1.2 без аудит-доков
git reset --hard 01a6baa   # откатить к v1.1
git reset --hard fe9087a   # откатить к v1.0
```

---

## История изменений

### v1.0 (commit `fe9087a`)
- 34 слайда базовые
- Простые SVG-иконки, без больших иллюстраций
- Логотип правильный (4 элемента)

### v1.1 (commit `01a6baa`)
- + Слайд «Что регулируют пептиды» с 5 пиктограммами систем
- + Слайд «Карта 10 комплексов» с силуэтом человека
- + 10 иконок-метафор в hero-блоках комплексов
- + Таймлайн контрольной точки
- 35 слайдов

### v1.2 (commit `2b47f98`)
- Глобальное увеличение шрифтов на ~20% (фидбэк «мелкий шрифт»)
- Улучшенная иллюстрация механизма пептидов (ДНК + ножницы + клетка с рецепторами)
- НОВЫЙ слайд «Принцип ключ → замок» с большой иллюстрацией
- Детальная иллюстрация мембраны клетки в hero-блоке STOPBACTERIA
- 36 слайдов

### audit (commit `e8f1b34`)
- Создан brand-strategy.md (правила фирстиля)
- Создан brief-response.json (бриф клиента)
- В brand.json добавлены семантические цвета (зелёный/охра/красный)
- В README ZIP добавлен EN-блок

---

## Что НЕ сделано (возможные следующие шаги)

### Если клиент попросит улучшить визуализацию ещё:
1. **9 оставшихся комплексов без больших иллюстраций** (как STOPBACTERIA имеет мембрану): можно добавить
   - AMORE → иллюстрация оркестра/дирижёра-гипоталамуса
   - ACTIVEBRAIN → нейроны-почтальоны передают сигналы
   - IMMUNACTIV → щит с молекулами обороны
   - NO STRESS → переключатель тревоги-спокойствия
   - OXYGEN → мост между двумя силуэтами людей
   - RECOVERY → фазы сна графиком (REM/NREM)
   - RELIEF → нервный путь с затухающими волнами
   - STRESSRELIEF → батарейка-мозг разряжен → заряжен
   - TESTOBOOSTER → пламя/искра в мозге

2. **Графический язык бренда** (волнистые линии — чешуя/пульс/солнце) НЕ использован — можно добавить как декор на 5-7 ключевых слайдов

3. **Анимации** в HTML-версии (fade-in между слайдами, hover-эффекты)

### Если клиент попросит изменить шрифт:
TT Norms из брендбука **платный** ($199/family). Если клиент готов купить:
```css
@font-face { font-family: 'TT Norms'; src: url('...'); }
:root { --font: 'TT Norms', 'Manrope', sans-serif; }
```

### Если клиент попросит другой формат:
- **PowerPoint .pptx** — наш deliver-v2 пока этого не умеет. Нужно: открыть HTML в Pages/Keynote, экспортнуть PPTX. Или написать конвертер html2pptx
- **Видеоверсия** — можно через Playwright запись + speaker notes

---

## Антипаттерны (что НЕ делать)

❌ Не использовать тёмный фон — нарушение брендбука (см. NotebookLM-версию для антипримера)
❌ Не упрощать логотип — 4 элемента обязательны
❌ Не использовать эмодзи как иконки — только SVG
❌ Не использовать стоковые AI-картинки тёмного sci-fi стиля
❌ Не таскать иллюстрации из NotebookLM PDF напрямую — стиль другой
❌ Не уменьшать шрифт (клиент жаловался на мелкий)
❌ Не вкладывать в HTML встроенные base64 шрифты — нагружает файл, используем Google Fonts

✅ Использовать палитру Geneline (айвори+медь+графит)
✅ Manrope как substitute для TT Norms
✅ Inline SVG-иконки в фирменной палитре
✅ 4-элементный логотип Geneline через `<symbol id="logo-mark">`
✅ @media print с page-break-after на каждом slide

---

## Связанные документы

- [refs/AUDIT_CHECKLIST.md](../../refs/AUDIT_CHECKLIST.md) — чек-лист аудита (пройден)
- [CLAUDE.md](../../CLAUDE.md) — общие правила AI Design Studio
- [BRAND-ALGORITHM.md](../../BRAND-ALGORITHM.md) — общий пайплайн (Geneline — особый случай, у клиента уже есть свой брендбук)
- Memory: `project_geneline_royal_peptides.md` — резерв на случай обрыва сессии

---

## Точка входа для новой сессии Claude

Если Юрий говорит «продолжи geneline» / «у клиента правки» — сделай:
1. `git log --oneline -5` — посмотреть последние коммиты
2. Прочитать этот HANDOFF.md целиком
3. Прочитать memory `project_geneline_royal_peptides.md`
4. Открыть `presentation.html` в браузере (`open path/to/file.html`)
5. Спросить Юрия: какие именно правки нужны от клиента?

**Не начинать переделку с нуля** — версия 1.2 это рабочее состояние.
