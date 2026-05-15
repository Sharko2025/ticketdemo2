import { NextResponse } from 'next/server';
import { parseTicketFromText } from '@/lib/gemini';
import { createTicket } from '@/lib/tickets';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * Sends a message back to the user on Telegram.
 */
async function sendTelegramMessage(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is missing');
    return;
  }

  const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
    
    if (!res.ok) {
      const error = await res.text();
      console.error('Failed to send Telegram message:', error);
    }
  } catch (err) {
    console.error('Error in sendTelegramMessage:', err);
  }
}

/**
 * Processes the incoming Telegram message.
 * Fetches ticket info via Gemini and saves to Supabase.
 */
async function processMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text;
  const firstName = message.from.first_name || 'Telegram User';

  if (!text) return;

  console.log(`[Telegram] Processing message from ${firstName}: ${text}`);

  try {
    // 1. Analyze with Gemini
    const analyzed = await parseTicketFromText(text);
    
    // 2. Create ticket in Supabase
    await createTicket({
      title: analyzed.title,
      description: analyzed.description,
      priority: analyzed.priority,
      reporter: firstName,
      status: 'New',
      source: 'Telegram',
    });

    console.log(`[Telegram] Ticket created successfully for ${firstName}`);

    // 3. Send feedback back to Telegram
    const replyText = `✅ *Ticket Created!*
    
*Tiêu đề:* ${analyzed.title}
*Mức độ:* ${analyzed.priority}
*Phân loại:* ${analyzed.category}

Đội ngũ IT sẽ xử lý yêu cầu của bạn sớm nhất có thể.`;

    await sendTelegramMessage(chatId, replyText);
    
  } catch (error) {
    console.error('[Telegram] Error processing message:', error);
    await sendTelegramMessage(chatId, '❌ Có lỗi xảy ra khi tạo ticket. Vui lòng thử lại sau.');
  }
}

export async function POST(request: Request) {
  // 1. Log the raw request for Vercel debugging
  const body = await request.json();
  console.log('[Telegram Webhook Received]:', JSON.stringify(body, null, 2));

  // 2. Extract message object
  const message = body.message;

  if (message && message.text) {
    // 3. GOLDEN RULE: Must await all processing before responding in serverless
    await processMessage(message);
  }

  // 4. Return 200 OK immediately after processing
  return NextResponse.json({ ok: true });
}
