/**
 * AI Design Studio — Telegram Bot
 * Cloudflare Worker — minimal test (no grammY)
 */

const BOT_API = 'https://api.telegram.org/bot';

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

async function sendMessage(env, chatId, text, keyboard) {
  const body = {
    chat_id: chatId,
    text: text
  };
  if (keyboard) {
    body.reply_markup = { inline_keyboard: keyboard };
  }

  const res = await fetch(`${BOT_API}${env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!json.ok) {
    console.error('sendMessage failed:', JSON.stringify(json));
  }
}

async function editMessage(env, chatId, messageId, text, keyboard) {
  const body = {
    chat_id: chatId,
    message_id: messageId,
    text: text
  };
  if (keyboard) {
    body.reply_markup = { inline_keyboard: keyboard };
  }

  const res = await fetch(`${BOT_API}${env.BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!json.ok) {
    console.error('editMessage failed:', JSON.stringify(json));
  }
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

const ADMIN_ID = 367991548;

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = (message.text || '').trim();
  const from = message.from || {};
  const name = from.first_name || '';
  const username = from.username ? `@${from.username}` : '';

  // /start
  if (text === '/start' || text.startsWith('/start ')) {
    await sendMessage(env, chatId,
      'Добро пожаловать в AI Design Studio.\n\n' +
      'Создаём бренды для компаний в ОАЭ и СНГ — ' +
      'логотипы, брендбуки, фирменный стиль.\n\n' +
      'Расскажите о вашем проекте — подберём решение.',
      [
        [{ text: 'Хочу бренд для бизнеса', callback_data: 'want_brand' }],
        [{ text: 'Посмотреть работы', callback_data: 'view_portfolio' }]
      ]
    );

    // Уведомить админа
    if (chatId !== ADMIN_ID) {
      await sendMessage(env, ADMIN_ID,
        `👤 Новый пользователь: ${name} ${username} (ID: ${chatId})`
      );
    }
    return;
  }

  // /clients (admin only)
  if (text === '/clients' && chatId === ADMIN_ID) {
    await sendMessage(env, chatId, 'Команда /clients — будет в шаге 4.');
    return;
  }

  // Если от админа — не отвечать
  if (chatId === ADMIN_ID) return;

  // Ключевые слова
  const lower = text.toLowerCase();

  if (lower.includes('цена') || lower.includes('стоимость') || lower.includes('сколько')) {
    await sendMessage(env, chatId,
      'Стоимость зависит от пакета:\n\n' +
      '• Старт — от 5,000 AED (логотип + мини-брендбук)\n' +
      '• Бизнес — от 10,000 AED (полный брендбук + визитки)\n' +
      '• Премиум — от 18,000 AED (всё + соцсети + иконки)\n\n' +
      'Для точной цены заполните бриф — подготовим КП за 24 часа.',
      [[{ text: 'Хочу бренд для бизнеса', callback_data: 'want_brand' }]]
    );
    return;
  }

  if (lower.includes('портфолио') || lower.includes('работы') || lower.includes('примеры')) {
    await sendMessage(env, chatId, 'Наши работы:',
      [[{ text: 'Открыть портфолио', url: env.PORTFOLIO_URL }]]
    );
    return;
  }

  // Fallback
  await sendMessage(env, chatId,
    'Спасибо за сообщение! Я бот AI Design Studio.\n\nВот что я могу:',
    [
      [{ text: 'Хочу бренд', callback_data: 'want_brand' },
       { text: 'Посмотреть работы', callback_data: 'view_portfolio' }]
    ]
  );

  // Переслать админу
  await sendMessage(env, ADMIN_ID,
    `💬 Сообщение от ${name} ${username} (ID: ${chatId}):\n\n${text}`
  );
}

async function handleCallback(callback, env) {
  const chatId = callback.message.chat.id;
  const messageId = callback.message.message_id;
  const data = callback.data;

  await answerCallback(env, callback.id);

  if (data === 'want_brand') {
    await editMessage(env, chatId, messageId,
      'Отлично! Чтобы подготовить точное предложение, ' +
      'нам нужно узнать о вашем проекте.\n\n' +
      'Заполните короткий бриф — это займёт 5 минут.',
      [
        [{ text: 'Заполнить бриф (5 мин)', url: env.BRIEF_URL }],
        [{ text: 'Написать менеджеру', callback_data: 'contact_manager' }]
      ]
    );
  }

  else if (data === 'view_portfolio') {
    await editMessage(env, chatId, messageId,
      'Наши последние работы — брендбуки, логотипы, фирменный стиль:\n\n' +
      '4 кейса: Aurelius Group, РубИИльник, Birca Kolet, Bloshka Deluxe.\n\n' +
      'Нажмите «Открыть портфолио» — лучше смотреть с компьютера.',
      [
        [{ text: 'Открыть портфолио', url: env.PORTFOLIO_URL }],
        [{ text: 'Хочу так же', callback_data: 'want_brand' }]
      ]
    );
  }

  else if (data === 'contact_manager') {
    await editMessage(env, chatId, messageId,
      'Напишите ваш вопрос прямо здесь — ' +
      'я передам менеджеру, он ответит в течение часа.\n\n' +
      'Или свяжитесь напрямую: @Jaros17'
    );
  }
}
