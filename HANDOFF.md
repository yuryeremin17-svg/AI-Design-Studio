# HANDOFF — AI Design Studio
> Дата: 2026-03-05 | Сессия: #5

## Аудит сессии #5: почему проект буксовал

### Корневые причины (сессии #1-4)
1. **Копирование вместо создания** — Aurelius = клон LH-brand (та же палитра, шрифт, структура)
2. **Технические кроличьи норы** — сессия #4 убита на PDF-экспорт (3 подхода, все провалились). PDF — последний шаг, не первый
3. **Украшения вместо фундамента** — нет дизайн-системы (случайные отступы, нет типографической шкалы)
4. **Визуал не проверялся** — 1 transition на 2052 строки. Статичный HTML уровня 2018 года
5. **Нет системы доставки** — клиент не может получить ZIP, PNG логотипов, PDF, онлайн-ссылку

### Что уже сделано и работает
- Структура проекта (папки, шаблоны, команды)
- Aurelius v2.0 — 18 секций, inline SVG, 76 KB (технически сильнее LH)
- Playwright MCP работает
- Шаблоны: brandbook, businesscard, letterhead, brief
- Логотипы SVG: dark + light
- export-pdf.js — работает, но качество плохое

### Что студия МОЖЕТ без дизайнера (85-90% от топовой студии)
- Типографика (Google Fonts = те же шрифты что у студий)
- Цвет, градиенты, контраст — всё в CSS
- Сетка и пропорции — CSS Grid, математические отступы
- Интерактивность — scroll-анимации, hover, copy-to-clipboard
- Стилизованные мокапы — CSS perspective + shadow (не фотореалистичные)
- Print-ready вёрстка — @media print, page-break
- Разнообразие стилей — CSS-переменные, разные палитры/шрифты

### Что НЕ МОЖЕТ (честно)
- Фотореалистичные 3D мокапы (нужен Photoshop/Blender)
- Кастомные иллюстрации
- CMYK PDF для типографии (браузеры = RGB)

## План: 7 шагов

### Шаг 1: Дизайн-система
- Типографическая шкала (Perfect Fourth: 1.0 → 1.333 → 1.777 → 2.369 → 3.157)
- Модульные отступы (8px grid — все margin/padding кратны 8)
- Цветовой баланс 60/30/10
- Вертикальный ритм
- CSS-переменные для быстрой смены стиля

### Шаг 2: Переделать Aurelius — премиальный визуал
- Применить дизайн-систему
- Разнообразные layouts (не "заголовок + текст" на каждой странице)
- Воздух и пропорции
- Глубина (multi-layer box-shadow, subtle gradients)
- CSS perspective мокапы визиток
- Реальные фото через URL (раздел "фотостиль")

### Шаг 3: Интерактивность
- IntersectionObserver: fade-in секций при скролле
- Smooth scroll навигация из оглавления
- Hover-transitions на всех интерактивных элементах
- Copy HEX по клику на палитре
- Прогресс-бар чтения (опционально)

### Шаг 4: Система доставки
- deliver.js — скрипт сборки:
  - ZIP-пакет (Brandbook/ + Logos/ + Production/ + Digital/ + README)
  - PNG логотипов из SVG (через Playwright, 500/1000/2000px)
  - colors.json (палитра + шрифты для разработчиков)
  - Print-версия HTML (без JS/анимаций) → PDF
- deploy.sh — публикация на GitHub Pages / Netlify
- Клиент получает: ссылку + ZIP

### Шаг 5: Второй клиент (другой стиль)
- Tech/Modern или Fashion — доказать универсальность
- Другая палитра, шрифты, настроение
- Та же дизайн-система, другие значения переменных

### Шаг 6: Пайплайн
- Починить бриф-форму (setLang баг, Web3Forms)
- Обновить slash-команды (brandbook.md устарел — "13 разделов")
- scripts/new-client.js — создание папки из брифа
- Протестировать Paged.js как альтернативу для PDF

### Шаг 7: Портфолио-лендинг
- Одностраничный сайт с 2 кейсами
- Форма заявки
- Деплой

## Технические заметки

### Playwright CLI
```bash
HOME=/tmp npx playwright@latest screenshot --full-page "file:///path" output.png
```

### Неиспользуемые CSS-возможности (добавить)
- @keyframes (fade-in, slide-up)
- IntersectionObserver + CSS классы
- box-shadow multi-layer
- CSS gradient (subtle фоны между секциями)
- CSS perspective + rotateY (мокапы)
- backdrop-filter: blur() — только для tech-стилей, НЕ для luxury

### Отменённые идеи
- Glassmorphism — тренд, не премиум. Не подходит для luxury
- Фотореалистичные 3D мокапы — нереалистично без Photoshop
- PDF через page.pdf() с @media print — 3 попытки провалились

## Структура файлов
```
AI-Design-Studio/
├── .mcp.json
├── .gitignore              ← node_modules/ добавлен
├── package.json            ← playwright ^1.58.2
├── CLAUDE.md
├── HANDOFF.md              ← этот файл
├── assets/logos/aurelius-group/
│   ├── logo.svg            ← тёмный
│   └── logo-light.svg      ← светлый
├── templates/
│   ├── brief/brand-brief.html
│   ├── brandbook/starter.html
│   ├── businesscard/starter.html
│   └── letterhead/starter.html
├── scripts/
│   └── export-pdf.js       ← рабочий, качество плохое
├── output/aurelius-group/
│   ├── brandbook.html      ← v2.0 (2052 строк, 18 секций)
│   ├── business-cards.html
│   ├── letterhead.html
│   ├── presentation.html
│   ├── email-signature.html
│   └── print/              ← черновые PDF
└── .claude/
    ├── commands/            ← brandbook, businesscard, letterhead, deliver, new-client
    └── rules/quality-check.md
```
