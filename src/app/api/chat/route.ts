import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import {
  createReservation,
  getAvailability,
  MAX_PARTY_ONLINE,
  RESTAURANT_PHONE,
  normalizeTime,
} from "@/lib/booking";
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from "@/lib/security";

export const maxDuration = 30;

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://redz-restaurant.vercel.app",
    "X-Title": "Redz Restaurant",
    "X-OpenRouter-Title": "Redz Restaurant",
  },
});

const CHAT_MODEL = process.env.CHAT_MODEL || "openai/gpt-4o-mini";

const chatBodySchema = z.object({
  messages: z
    .array(
      z
        .object({
          id: z.string().optional(),
          role: z.enum(["system", "user", "assistant"]),
          parts: z.array(z.unknown()).optional(),
          content: z.unknown().optional(),
        })
        .passthrough()
    )
    .min(1)
    .max(40),
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({ error: "Chat concierge is not configured" }, { status: 503 });
    }

    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, "chat", 30)) return rateLimitedResponse();

    const parsed = chatBodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    const messages = parsed.data.messages as UIMessage[];

    const result = streamText({
      model: openrouter.chat(CHAT_MODEL),
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(6),
      system: `You are Henry, the exclusive AI Concierge for Redz Restaurant in Mt Laurel, NJ. You are a highly professional, polite, and sophisticated Maître D'.
Your primary goals are to answer questions about the restaurant and to book reservations into the live CRM.

You communicate only via text chat — there is no voice mode.

Reservation workflow (follow strictly):
1. Gather: Name, Email, Phone, Date (yyyy-mm-dd), preferred Time, Party Size (1–${MAX_PARTY_ONLINE} online). Special requests are optional.
2. Before booking, call check_availability with the date and party size. Offer only available slots.
3. Once the guest confirms a specific available time and you have all required fields, call book_reservation.
4. After a successful book_reservation, confirm the request was received and that the restaurant will finalize it. Do not invent confirmation numbers.
5. Parties of 13–20: direct them to /private-dining. Parties larger than 20: direct them to /banquets (DoubleTree Events) or call ${RESTAURANT_PHONE}.
6. If a tool fails, apologize and give the phone number ${RESTAURANT_PHONE}.

Keep turns concise and high-status. Dates must be yyyy-mm-dd. Times may be conversational; the tools normalize them.

Restaurant Info:
- Phone: ${RESTAURANT_PHONE}
- Address: 515 Fellowship Road, Mt Laurel, NJ 08054 (DoubleTree Suites by Hilton)
- Breakfast: Mon-Fri 6:30am–10:30am, Sat-Sun 7:00am–11:30am
- Dinner: Mon-Sat 4:00pm–10:00pm, Sun 5:00pm–9:00pm
- Happy Hour: Mon-Fri 4:00pm–6:00pm
- Guests may also book themselves at /reservations on the website.`,
      tools: {
        check_availability: tool({
          description:
            "Checks open reservation time slots for a date and party size. Call this before booking.",
          inputSchema: z.object({
            date: z.string().describe("Reservation date in yyyy-mm-dd format"),
            party_size: z
              .number()
              .int()
              .min(1)
              .max(20)
              .describe("Number of guests"),
          }),
          execute: async ({ date, party_size }) => {
            const result = await getAvailability(date, party_size);
            if (result.error && result.slots.length === 0) {
              return { success: false, error: result.error, available_slots: [] };
            }
            const available = result.slots
              .filter((s) => s.available)
              .map((s) => ({ time: s.time, label: s.label, remaining: s.remaining }));
            return {
              success: true,
              date,
              party_size,
              available_slots: available,
              message:
                available.length > 0
                  ? `Found ${available.length} open slot(s). Offer these to the guest.`
                  : `No open slots for that date/party size. Suggest another date or call ${RESTAURANT_PHONE}.`,
            };
          },
        }),
        book_reservation: tool({
          description:
            "Books a reservation into the Redz CRM (Supabase). Only call after collecting all required fields and confirming an available time.",
          inputSchema: z.object({
            name: z.string().describe("The guest's full name"),
            email: z.string().email().describe("The guest's email address"),
            phone: z.string().describe("The guest's phone number"),
            date: z.string().describe("The reservation date in yyyy-mm-dd format"),
            time: z.string().describe("The reservation time (e.g. 18:00 or 6:00 PM)"),
            party_size: z.number().int().min(1).max(20).describe("Number of guests"),
            special_requests: z
              .string()
              .optional()
              .describe("Special requests or dietary restrictions"),
          }),
          execute: async ({ name, email, phone, date, time, party_size, special_requests }) => {
            const normalized = normalizeTime(time) || time;
            const booked = await createReservation(
              {
                name,
                email,
                phone,
                date,
                time: normalized,
                party_size,
                special_requests,
                source: "henry",
                status: "pending",
              },
              { notify: true }
            );

            if (!booked.success) {
              return { success: false, error: booked.error };
            }

            return {
              success: true,
              reservation: booked.reservation,
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat completion error:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
