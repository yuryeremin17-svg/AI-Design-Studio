# AI Design Studio — Telegram Bot

## Статус: РАБОТАЕТ (сессия #20, 2026-03-22)

- Worker: `https://ai-design-studio-bot.yuryeremin17.workers.dev`
- Webhook установлен, бот отвечает на /start, кнопки, ключевые слова
- Код: чистый Bot API (без grammY), Cloudflare Workers
- **Фикс:** секрет BOT_TOKEN был повреждён — пересоздан через `wrangler secret put`

## Дорожная карта

| Шаг | Что | Срок | Статус |
|-----|-----|------|--------|
| 0 | CF Workers + grammY + webhook + миграция | 0.5 дня | блокер: npm cache |
| 1 | /start + приветствие + fallback | 0.5 дня | — |
| 3 | Квалификация кнопками + портфолио | 1 день | — |
| 2 | Привязка chat_id + авто-ответ "Бриф принят" | 1 день | — |
| 2б | Напоминания (Cron Trigger) | 0.5 дня | — |
| 4 | Статусы + превью (admin-команды) | 1 день | — |
| 5 | Мини-бриф в боте (conversations) | 2 дня | — |
| 6 | Доставка + отзыв | 0.5 дня | — |

## Стек
- Cloudflare Workers (free)
- grammY (bot framework)
- Cloudflare KV (state)
- Webhook (не long polling)

## Текущий бот
- @ai_designYE_studio_bot
- Token: в brand-brief.html CONFIG (НЕБЕЗОПАСНО — в клиентском JS)
- Chat ID: 367991548
- Функция: только sendMessage при отправке брифа
- Нет webhook, нет обработки входящих

## Безопасность (приоритет)
- [ ] Убрать token из клиентского JS (спрятать в Worker)
- [ ] Webhook secret_token
- [ ] Admin check по chat_id
