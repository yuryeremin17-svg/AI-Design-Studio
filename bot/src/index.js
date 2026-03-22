/**
 * AI Design Studio — Telegram Bot
 * Cloudflare Worker — v2 (2026-03-22)
 */

const BOT_API = 'https://api.telegram.org/bot';
const ADMIN_ID = 367991548;

// OG-image как баннер при /start
const BANNER_URL = 'https://yuryeremin17-svg.github.io/AI-Design-Studio/assets/og/og-image.png';

// --- Telegram API helpers ---

async function sendMessage(env, chatId, text, keyboard, parseMode) {
  const body = { chat_id: chatId, text };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };
  if (parseMode) body.parse_mode = parseMode;

  const res = await fetch(`${BOT_API}${env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!json.ok) console.error('sendMessage failed:', JSON.stringify(json));
  return json;
}

async function sendPhoto(env, chatId, photoUrl, caption, keyboard) {
  const body = { chat_id: chatId, photo: photoUrl, caption };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };

  const res = await fetch(`${BOT_API}${env.BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!json.ok) console.error('sendPhoto failed:', JSON.stringify(json));
  return json;
}

async function editMessage(env, chatId, messageId, text, keyboard) {
  const body = { chat_id: chatId, message_id: messageId, text };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };

  const res = await fetch(`${BOT_API}${env.BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!json.ok) console.error('editMessage failed:', JSON.stringify(json));
}

async function answerCallback(env, callbackId) {
  await fetch(`${BOT_API}${env.BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackId })
  });
}

async function forwardMessage(env, chatId, fromChatId, messageId) {
  await fetch(`${BOT_API}${env.BOT_TOKEN}/forwardMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, from_chat_id: fromChatId, message_id: messageId })
  });
}

// --- Shared texts & keyboards ---

const START_TEXT =
  'Добро пожаловать в AI Design Studio!\n\n' +
  'Создаём бренды для компаний в ОАЭ и СНГ — ' +
  'логотипы, брендбуки, фирменный стиль.\n\n' +
  'Выберите что вас интересует:';

const START_KB = [
  [{ text: 'Хочу бренд для бизнеса', callback_data: 'want_brand' }],
  [{ text: 'Цены и сроки', callback_data: 'prices' }],
  [{ text: 'Посмотреть работы', callback_data: 'view_portfolio' }]
];

const PRICES_TEXT =
  'Стоимость зависит от задач:\n\n' +
  '• Старт — от 5,000 AED (~$1,350)\n' +
  '  Логотип + мини-брендбук, 5-7 дней\n\n' +
  '• Бизнес — от 10,000 AED (~$2,700)\n' +
  '  Полный брендбук + визитки + бланк, 10-14 дней\n\n' +
  '• Премиум — от 18,000 AED (~$4,900)\n' +
  '  Всё + соцсети + иконки + RTL, 14-21 день\n\n' +
  'Точную цену подготовим после брифа — за 24 часа.';

const PRICES_KB = [
  [{ text: 'Заполнить бриф', callback_data: 'want_brand' }],
  [{ text: '← В начало', callback_data: 'go_start' }]
];

// --- Main handler ---

export default {
  async fetch(request, env) {
    if (request.method === 'GET') {
      return new Response('Bot running', { status: 200 });
    }
    if (request.method !== 'POST') {
      return new Response('', { status: 405 });
    }

    try {
      const update = await request.json();
      const message = update.message || update.edited_message;
      const callback = update.callback_query;

      if (message) {
        await handleMessage(message, env);
      } else if (callback) {
        await handleCallback(callback, env);
      }
    } catch (err) {
      console.error('Error:', err);
    }

    return new Response('OK', { status: 200 });
  }
};

// --- Message handler ---

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = (message.text || '').trim();
  const from = message.from || {};
  const name = from.first_name || '';
  const username = from.username ? `@${from.username}` : '';

  // /start — баннер + приветствие
  if (text === '/start' || text.startsWith('/start ')) {
    await sendPhoto(env, chatId, BANNER_URL, START_TEXT, START_KB);

    if (chatId !== ADMIN_ID) {
      await sendMessage(env, ADMIN_ID,
        `\u{1F464} Новый пользователь: ${name} ${username} (ID: ${chatId})`
      );
    }
    return;
  }

  // /clients (admin only)
  if (text === '/clients' && chatId === ADMIN_ID) {
    await sendMessage(env, chatId, 'Команда /clients — будет в следующем обновлении.');
    return;
  }

  // Если от админа — не отвечать на обычные сообщения
  if (chatId === ADMIN_ID) return;

  // --- Ключевые слова ---
  const lower = text.toLowerCase();

  // Цены
  if (lower.includes('цена') || lower.includes('стоимость') || lower.includes('сколько') || lower.includes('прайс') || lower.includes('price')) {
    await sendMessage(env, chatId, PRICES_TEXT, PRICES_KB);
    return;
  }

  // Сроки
  if (lower.includes('срок') || lower.includes('время') || lower.includes('когда') || lower.includes('долго') || lower.includes('быстро')) {
    await sendMessage(env, chatId,
      'Сроки зависят от пакета:\n\n' +
      '• Старт — 5-7 рабочих дней\n' +
      '• Бизнес — 10-14 рабочих дней\n' +
      '• Премиум — 14-21 рабочий день\n\n' +
      'Отсчёт с момента утверждения брифа. Правки — 2-3 раунда в зависимости от пакета.',
      [
        [{ text: 'Цены', callback_data: 'prices' }],
        [{ text: 'Заполнить бриф', callback_data: 'want_brand' }],
        [{ text: '← В начало', callback_data: 'go_start' }]
      ]
    );
    return;
  }

  // Портфолио
  if (lower.includes('портфолио') || lower.includes('работы') || lower.includes('примеры') || lower.includes('кейс')) {
    await sendMessage(env, chatId,
      'Наши работы — 4 кейса:',
      [
        [{ text: 'Открыть портфолио', url: env.PORTFOLIO_URL }],
        [{ text: '← В начало', callback_data: 'go_start' }]
      ]
    );
    return;
  }

  // --- Фото, документы, стикеры — переслать админу ---
  if (!text && (message.photo || message.document || message.sticker || message.voice || message.video)) {
    await forwardMessage(env, ADMIN_ID, chatId, message.message_id);
    await sendMessage(env, ADMIN_ID,
      `\u{1F4CE} Файл от ${name} ${username} (ID: ${chatId})`
    );
    await sendMessage(env, chatId,
      'Спасибо! Передали вашу информацию дизайн-команде. Ответим в течение часа.',
      [[{ text: '← В начало', callback_data: 'go_start' }]]
    );
    return;
  }

  // --- Fallback: любой текст ---
  await sendMessage(env, chatId,
    'Спасибо за сообщение! Передали дизайн-команде — ответим в течение часа.\n\n' +
    'А пока можете посмотреть:',
    [
      [{ text: 'Цены и сроки', callback_data: 'prices' }],
      [{ text: 'Наши работы', callback_data: 'view_portfolio' }],
      [{ text: '← В начало', callback_data: 'go_start' }]
    ]
  );

  // Переслать админу
  await forwardMessage(env, ADMIN_ID, chatId, message.message_id);
  await sendMessage(env, ADMIN_ID,
    `\u{1F4AC} от ${name} ${username} (ID: ${chatId})`
  );
}

// --- Callback handler ---

async function handleCallback(callback, env) {
  const chatId = callback.message.chat.id;
  const data = callback.data;

  await answerCallback(env, callback.id);

  if (data === 'want_brand') {
    await sendMessage(env, chatId,
      'Отлично! Чтобы подготовить точное предложение, ' +
      'нам нужно узнать о вашем проекте.\n\n' +
      'Заполните короткий бриф — это займёт 5 минут.',
      [
        [{ text: 'Заполнить бриф (5 мин)', url: env.BRIEF_URL }],
        [{ text: 'Написать нам', callback_data: 'contact_us' }],
        [{ text: '← В начало', callback_data: 'go_start' }]
      ]
    );
  }

  else if (data === 'prices') {
    await sendMessage(env, chatId, PRICES_TEXT, PRICES_KB);
  }

  else if (data === 'view_portfolio') {
    await sendMessage(env, chatId,
      'Наши работы — брендбуки, логотипы, фирменный стиль:\n\n' +
      '4 кейса: Aurelius Group, РубИИльник, Birca Kolet, Bloshka Deluxe.\n\n' +
      'Лучше смотреть с компьютера.',
      [
        [{ text: 'Открыть портфолио', url: env.PORTFOLIO_URL }],
        [{ text: 'Хочу так же', callback_data: 'want_brand' }],
        [{ text: '← В начало', callback_data: 'go_start' }]
      ]
    );
  }

  else if (data === 'contact_us') {
    await sendMessage(env, chatId,
      'Напишите ваш вопрос прямо здесь — ' +
      'передадим дизайн-команде, ответим в течение часа.\n\n' +
      'Или напишите напрямую: @Jaros17',
      [[{ text: '← В начало', callback_data: 'go_start' }]]
    );
  }

  else if (data === 'go_start') {
    await sendMessage(env, chatId, START_TEXT, START_KB);
  }
}
