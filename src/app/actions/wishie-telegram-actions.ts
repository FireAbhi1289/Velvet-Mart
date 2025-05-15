
'use server';

import { z } from 'zod';

// Define a schema for the data parts we expect for the Wishie Telegram message.
const WishieDetailsSchema = z.object({
  category: z.string().optional().nullable(),
  itemDescription: z.string(),
  imageProvided: z.boolean(),
  fullName: z.string(),
  contactNumber: z.string(),
  timestamp: z.string(), // ISO string from new Date().toISOString()
});

export type WishieDetailsForTelegram = z.infer<typeof WishieDetailsSchema>;

// Use environment variables if available, otherwise fallback to the hardcoded values.
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7844488242:AAH0Cd-SzmsLtLTxkiQ_OTuhxPK8hil3kaM";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1002570299435"; // Ensure this is your correct User or Group ID

// Function to escape characters for MarkdownV2
function escapeMarkdownV2(text: string | undefined | null): string {
  if (text === undefined || text === null) {
    return '';
  }
  const escapeChars = /[_*[\]()~`>#+\-=|{}.!]/g;
  return text.replace(escapeChars, '\\$&');
}

function formatWishieDetailsForTelegram(details: WishieDetailsForTelegram): string {
  const submissionTime = new Date(details.timestamp).toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata', // Example: Indian Standard Time
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  let message = `*New Wish* ✨🧞‍♀️\n\n`;
  if (details.category) {
    message += `🛒 *Category:* ${escapeMarkdownV2(details.category)}\n`;
  }
  message += `📝 *Item Description:*\n${escapeMarkdownV2(details.itemDescription)}\n\n`;
  message += `🖼️ *Image Provided:* ${details.imageProvided ? 'Yes' : 'No'}\n\n`;
  message += `👤 *User Details:*\n`;
  message += `  *Name:* ${escapeMarkdownV2(details.fullName)}\n`;
  message += `  *Contact:* ${escapeMarkdownV2(details.contactNumber)}\n`;
  message += `\n⏰ *Submitted At:* ${escapeMarkdownV2(submissionTime)}`;
  return message;
}

export async function notifyWishViaTelegram(
  wishDetails: WishieDetailsForTelegram
): Promise<{ success: boolean; message: string; error?: string }> {
  if (!BOT_TOKEN || BOT_TOKEN === "YOUR_TELEGRAM_BOT_TOKEN") {
    const errorMessage = "Telegram Bot Token is not configured for Wishie.";
    console.error(errorMessage);
    return { success: false, message: errorMessage, error: "BOT_TOKEN_MISSING" };
  }
  if (!CHAT_ID || CHAT_ID === "YOUR_ACTUAL_TELEGRAM_CHAT_ID") {
    const errorMessage = "Telegram Chat ID is not configured for Wishie. Please set it or use an environment variable (TELEGRAM_CHAT_ID).";
    console.error(errorMessage);
    return { success: false, message: errorMessage, error: "CHAT_ID_MISSING" };
  }

  const validation = WishieDetailsSchema.safeParse(wishDetails);
  if (!validation.success) {
    const errorMessage = "Invalid wish details provided for Telegram notification.";
    console.error(errorMessage, validation.error.flatten());
    return { success: false, message: errorMessage, error: "VALIDATION_ERROR" };
  }

  const messageText = formatWishieDetailsForTelegram(validation.data);
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
      return { success: true, message: 'Wish notification sent successfully via Telegram.' };
    } else {
      const apiError = `Telegram API Error (Wishie): ${result.description || 'Unknown error'} (Code: ${result.error_code || 'N/A'})`;
      console.error(apiError, result);
      return {
        success: false,
        message: `Failed to send Wishie Telegram notification. ${result.description || 'Please check server logs.'}`,
        error: apiError
      };
    }
  } catch (error: any) {
    const networkError = `Network or unexpected error sending Wishie Telegram message: ${error.message || 'Unknown error'}`;
    console.error(networkError, error);
    return {
      success: false,
      message: 'Failed to send Wishie Telegram notification due to a network or server issue.',
      error: networkError,
    };
  }
}
