---
description: Создать полный брендбук для клиента
---

Создай брендбук (HTML, один файл) для клиента $ARGUMENTS.

Стандарт качества — дизайн-система v3:
- CSS-переменные для всего (цвета, шрифты, spacing, тени)
- Типографическая шкала (Perfect Fourth 1.333 или Major Third 1.25)
- Модульные отступы 8px grid
- IntersectionObserver — reveal-анимации секций при скролле
- Progress bar (accent color, fixed top)
- Copy HEX по клику на палитре (toast)
- Hover transitions на всех интерактивных элементах
- @media print обязателен
- Responsive (@media max-width: 768px)

Секции по пакету из CLAUDE.md (Старт: 8-12, Бизнес: 17, Премиум: 20+).

Порядок:
1. Прочитай данные клиента из MEMORY.md
2. Логотип из assets/logos/[имя-клиента]/
3. Шрифты из Google Fonts (пара из CLAUDE.md по стилю)
4. Создай output/[имя-клиента]/brandbook.html
5. Проверь визуально через Playwright (force .reveal.visible)
6. Исправь проблемы, пересними
7. Сообщи что готово
