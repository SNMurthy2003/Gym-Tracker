import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const WHATSAPP_API_URL = `https://graph.facebook.com/v20.0/${process.env.META_WA_PHONE_NUMBER_ID}/messages`;

export async function sendWhatsAppMessage(phone, message) {
  try {
    const payload = {
      messaging_product: "whatsapp",
      to: `91${phone}`,
      type: "text",
      text: { body: message },
    };

    await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.META_WA_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`📩 WhatsApp message sent to ${phone}`);
  } catch (err) {
    console.error("❌ WhatsApp API error:", err.response?.data || err.message);
  }
}
