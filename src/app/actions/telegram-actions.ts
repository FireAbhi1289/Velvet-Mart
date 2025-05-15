
'use server';

import { z } from 'zod'; // Added Zod import

// Define a schema for the data parts we expect for the Telegram message.
// This should align with what's passed from purchase-form.tsx
const OrderDetailsSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  socialMedia: z.string().optional().or(z.literal('')),
  pinCode: z.string(),
  state: z.string(),
  query: z.string().optional().or(z.literal('')),
  productName: z.string(),
  productId: z.string(),
  timestamp: z.string(), // ISO string from new Date().toISOString()
});

export type OrderDetailsForTelegram = z.infer<typeof OrderDetailsSchema>;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7844488242:AAH0Cd-SzmsLtLTxkiQ_OTuhxPK8hil3kaM";
// IMPORTANT: Replace "YOUR_ACTUAL_TELEGRAM_CHAT_ID" with your actual Telegram User ID or Group ID.
// You can get your User ID by messaging @userinfobot on Telegram.
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002570299435";

// Function to escape characters for MarkdownV2
function escapeMarkdownV2(text: string | undefined | null): string {
  if (text === undefined || text === null) {
    return '';
  }
  const escapeChars = /[_*[\]()~`>#+\-=|{}.!]/g;
  return text.replace(escapeChars, '\\$&');
}

function formatOrderDetailsForTelegram(details: OrderDetailsForTelegram): string {
  const submissionTime = new Date(details.timestamp).toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata', // Example: Indian Standard Time
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  let message = `*New Order Request* ✨\n\n`;
  message += `🛍️ *Product:* ${escapeMarkdownV2(details.productName)}\n`;
  message += `🆔 *Product ID:* ${escapeMarkdownV2(details.productId)}\n\n`;
  message += `👤 *Customer Details:*\n`;
  message += `  *Name:* ${escapeMarkdownV2(details.name)}\n`;
  message += `  *Address:* ${escapeMarkdownV2(details.address)}\n`;
  message += `  *Phone:* ${escapeMarkdownV2(details.phone)}\n`;
  message += `  *Email:* ${escapeMarkdownV2(details.email)}\n`;
  if (details.socialMedia && details.socialMedia.trim() !== '') {
    message += `  *Social Media:* ${escapeMarkdownV2(details.socialMedia)}\n`;
  }
  message += `  *PIN Code:* ${escapeMarkdownV2(details.pinCode)}\n`;
  message += `  *State:* ${escapeMarkdownV2(details.state)}\n`;
  if (details.query && details.query.trim() !== '') {
    message += `\n📝 *Query:*\n${escapeMarkdownV2(details.query)}\n`;
  }
  message += `\n⏰ *Submitted At:* ${escapeMarkdownV2(submissionTime)}`;
  return message;
}

export async function notifyOrderViaTelegram(
  orderDetails: OrderDetailsForTelegram
): Promise<{ success: boolean; message: string; error?: string }> {
  if (!BOT_TOKEN || BOT_TOKEN === "YOUR_TELEGRAM_BOT_TOKEN") {
    const errorMessage = "Telegram Bot Token is not configured.";
    console.error(errorMessage);
    return { success: false, message: errorMessage, error: "BOT_TOKEN_MISSING" };
  }
  if (!CHAT_ID || CHAT_ID === "YOUR_ACTUAL_TELEGRAM_CHAT_ID") {
    const errorMessage = "Telegram Chat ID is not configured. Please set it in telegram-actions.ts or as an environment variable (TELEGRAM_CHAT_ID).";
    console.error(errorMessage);
    return { success: false, message: errorMessage, error: "CHAT_ID_MISSING" };
  }

  const validation = OrderDetailsSchema.safeParse(orderDetails);
  if (!validation.success) {
    const errorMessage = "Invalid order details provided for Telegram notification.";
    console.error(errorMessage, validation.error.flatten());
    return { success: false, message: errorMessage, error: "VALIDATION_ERROR" };
  }

  const messageText = formatOrderDetailsForTelegram(validation.data);
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageText,
        parse_mode: 'MarkdownV2',
      }),
    });

    const result = await response.json();

    if (result.ok) {
      return { success: true, message: 'Order notification sent successfully via Telegram.' };
    } else {
      const apiError = `Telegram API Error: ${result.description || 'Unknown error'} (Code: ${result.error_code || 'N/A'})`;
      console.error(apiError, result);
      return {
        success: false,
        message: `Failed to send Telegram notification. ${result.description || 'Please check server logs.'}`,
        error: apiError
      };
    }
  } catch (error: any) {
    const networkError = `Network or unexpected error sending Telegram message: ${error.message || 'Unknown error'}`;
    console.error(networkError, error);
    return {
      success: false,
      message: 'Failed to send Telegram notification due to a network or server issue.',
      error: networkError,
    };
  }
}
