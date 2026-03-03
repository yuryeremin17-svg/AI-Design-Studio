# HANDOFF — AI Design Studio
> Дата: 2026-03-03 | Сессия: #3

## Что сделано в этой сессии
1. Тестовый клиент Aurelius Group (luxury, пакет Бизнес) — полный цикл создания
2. SVG-логотип в 2 вариантах (тёмный + светлый) — assets/logos/aurelius-group/
3. Брендбук 17 секций — output/aurelius-group/brandbook.html (53KB)
4. Визитки 2 варианта — output/aurelius-group/business-cards.html
5. Бланки 2 варианта (стандарт + водяной знак) — output/aurelius-group/letterhead.html
6. Шаблон презентации 5 слайдов — output/aurelius-group/presentation.html
7. Email-подпись с кнопкой Copy — output/aurelius-group/email-signature.html
8. Анализ LH-brand как эталона качества (2454 строки, base64, 40 изображений)
9. Исследование решений для брифа (Web3Forms — победитель, $0/мес)
10. Клиент записан в MEMORY.md

## Ключевые выводы сессии #3
- **Playwright MCP НЕ активен** — .mcp.json есть, но не подхватился в текущей сессии
- Без Playwright студия работает как обычная ручная работа в VS Code — нет преимущества
- Aurelius-брендбук ХУЖЕ LH-эталона: внешние SVG (не base64), меньше вариантов, нет Print Specs
- Бриф-форма работает, но данные уходят только в localStorage — нет отправки на email
- **Главная проблема: нужно сначала запустить Playwright, потом переделывать с визуальной проверкой**

## Сравнение Aurelius vs LH (что подтянуть)
| Аспект | LH (эталон) | Aurelius (текущий) |
|--------|-------------|-------------------|
| Логотипы | base64 встроены — автономный файл | Внешние SVG — зависит от путей |
| Визитки | 3 варианта цвета | 2 варианта |
| Бланки | 3 варианта | 2 варианта |
| Презентация | Мокап браузера для сайта | Только слайды |
| mix-blend-mode | Используется для PNG-логотипов | Нет |
| Print Specs | Отдельная секция | Нет |
| Соцсети | Instagram, LinkedIn, Facebook | Нет |
| Файл | 1.5MB (всё в одном) | 53KB (без картинок) |

## Что НЕ сделано (осталось)
- [ ] **КРИТИЧНО: Запустить Playwright MCP** (перезапуск сессии)
- [ ] Переделать Aurelius до уровня LH с визуальной проверкой через Playwright
- [ ] Подключить Web3Forms к бриф-форме (15 мин работы)
- [ ] Починить баг setLang() в бриф-форме
- [ ] Midjourney не подключён (задача Юрия)
- [ ] Договор/оферта не создан
- [ ] Сайт-портфолио: нет

## Решение по брифу (исследовано)
**Победитель: Web3Forms** — добавить к существующей HTML-форме POST на API.
- $0/мес (250 отправок — достаточно)
- Никакого чужого брендинга
- 15 минут интеграции: заменить submitBrief() на fetch() к Web3Forms
- Опционально: webhook → Google Sheets + Telegram-уведомление

## Следующая сессия → Сессия #4
1. **Перезапустить сессию — проверить Playwright MCP**
2. Если Playwright работает → переделать Aurelius с визуальной проверкой каждой страницы
3. Подключить Web3Forms к брифу
4. Довести качество до уровня выше LH (base64 логотипы, +секции, Print Specs)
5. Если Playwright НЕ работает → диагностика и починка (npx, node, зависимости)

## Структура файлов
```
AI-Design-Studio/
├── .claude/
│   ├── commands/          (brandbook, businesscard, letterhead, deliver, new-client)
│   └── rules/quality-check.md
├── .mcp.json              (Playwright — НАДО ПРОВЕРИТЬ)
├── assets/
│   └── logos/aurelius-group/
│       ├── logo.svg       ← NEW
│       └── logo-light.svg ← NEW
├── output/
│   └── aurelius-group/
│       ├── brandbook.html      ← NEW (17 секций, 53KB)
│       ├── business-cards.html ← NEW (2 варианта)
│       ├── letterhead.html     ← NEW (2 варианта)
│       ├── presentation.html   ← NEW (5 слайдов)
│       └── email-signature.html ← NEW (с Copy кнопкой)
├── templates/
│   ├── brandbook/starter.html
│   ├── brief/brand-brief.html
│   ├── businesscard/starter.html
│   ├── letterhead/starter.html
│   └── presentation/
├── CLAUDE.md
├── HANDOFF.md              ← UPDATED
└── MEMORY.md
```

## Эталон качества
LH-brand (Legacy Harbor) — /Users/apple/Documents/WORK/LH-brand/
- LH_Brand_Guidelines_v15_EN_full.html — 2454 строки, 1.5MB, 40 base64 изображений
- Полный пакет: EN+RU, визитки, бланки, production/, ZIP для клиента
- Использовать как benchmark для всех будущих брендбуков

## Контекст
Юрий — бывший топ-менеджер (30+ лет, банки/лизинг/продажи), Дубай. Строит AI-офис — дизайн-студия один из проектов. Код не пишет — ставит задачи. Сила: бизнес-мышление и продажи. Роль Claude: партнёр + исполнитель.
