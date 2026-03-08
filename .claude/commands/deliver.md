---
description: Собрать и отправить финал клиенту
---

Подготовь финальную доставку для клиента $ARGUMENTS.

1. Запусти `node scripts/deliver.js <client-name>` — он соберёт ZIP с:
   - Все HTML файлы из output/<client-name>/
   - Логотипы SVG + PNG (@1x, @2x, @4x) из assets/logos/<client-name>/
   - colors.json с палитрой и шрифтами
   - README.txt с инструкциями

2. Проверь содержимое ZIP: все файлы на месте, PNG не пустые

3. Покажи итог: что внутри, размер ZIP, путь к архиву

4. Спроси: "Отправить клиенту? Варианты: email, WhatsApp, или скачать ZIP"

Результат лежит в: delivery/<client-name>/
