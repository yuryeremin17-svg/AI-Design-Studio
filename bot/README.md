# AI Design Studio — Telegram Bot

## Статус: Шаг 0+1 задеплоен, бот НЕ отвечает

### Диагностика (куда вернуться)
- Worker задеплоен на `https://ai-design-studio-bot.yuryeremin17.workers.dev`
- Webhook установлен, Telegram доставляет updates (pending=0, нет ошибок)
- Прямой Bot API (curl sendMessage) — РАБОТАЕТ
- Worker получает POST, отвечает 200 — но sendMessage внутри Worker молча не срабатывает
- **Гипотеза:** `env.BOT_TOKEN` (wrangler secret) недоступен внутри fetch handler
- **Следующий шаг:** добавить GET `/debug` endpoint который вызовет sendMessage через env.BOT_TOKEN → если не отправит — пересоздать secret
- Код: без grammY, чистый Bot API (grammy не работал на Workers)
- Webhook secret убран (сначала починить основное)

## Блокер
npm cache сломан (права доступа). Нужно:
```bash
sudo rm -rf ~/.npm/_cacache
npm cache verify
```
После этого: `npm install -g wrangler` или `npx wrangler`

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
