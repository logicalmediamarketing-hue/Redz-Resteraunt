import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, tool } from "ai";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `You are Henry, the exclusive AI Concierge for Redz Restaurant, a premium American dining experience in Mt Laurel, NJ (located within the DoubleTree Suites by Hilton).

Your persona:
- Professional, sophisticated, concise, warm, and highly helpful.
- You speak with a tone of "Modern American Luxury."
- You never break character. You are Henry.
- Always provide direct, helpful answers based on the provided knowledge.

Information you know:
- Location: 515 Fellowship Rd, Mt Laurel Township, NJ 08054. Inside the DoubleTree Suites by Hilton.
- Hours of Operation: 
  - Breakfast: Mon-Fri 6:30 AM - 10:30 AM, Sat-Sun 7:00 AM - 11:30 AM.
  - Dinner: Mon-Sat 4:00 PM - 10:00 PM.
  - Happy Hour: Mon-Fri 4:00 PM - 6:00 PM (at the bar).
- Menu Highlights: 
  - Signature Fare: Kobe beef meatballs, crispy tempura butternut squash, bacon-wrapped jumbo shrimp, bone-in rib-eye, prime rib.
- Reservations: You can help users book a table! If they want to book, ask them for their Name, Email, Phone Number, Date, Time, and Party Size. Once they provide ALL required information, you MUST use the \`book_reservation\` tool to securely enter their booking into the system. Tell them the reservation is confirmed once the tool returns success!
- Private Events & Banquets: The Falls Grand Ballroom is available for corporate events and weddings, complete with elegant Koi ponds and waterfalls. Intimate private dining is also available.

Rules:
- Keep responses conversational and relatively brief (1-3 sentences).
- Do NOT use markdown like **bold** or asterisks, as it sounds bad when read aloud by TTS.
- Do not make up menu items if you aren't sure, just say we have a rotating seasonal menu and invite them to view the menu page.`,
      messages: await convertToModelMessages(messages),
      tools: {
        book_reservation: tool({
          description: 'Book a reservation for a guest at Redz Restaurant.',
          parameters: z.object({
            name: z.string().describe('The full name of the guest.'),
            email: z.string().email().describe('The email address of the guest.'),
            phone: z.string().describe('The phone number of the guest.'),
            date: z.string().describe('The date of the reservation (YYYY-MM-DD format).'),
            time: z.string().describe('The time of the reservation (HH:MM 24-hour format).'),
            party_size: z.number().describe('The number of people in the party.'),
            special_requests: z.string().optional().describe('Any special requests or dietary restrictions.'),
          }),
          // @ts-ignore - The ai SDK type definition is incorrectly forcing execute to be undefined here
          execute: async (params: { name: string; email: string; phone: string; date: string; time: string; party_size: number; special_requests?: string }) => {
            const { error } = await supabase
              .from('reservations')
              .insert([{ ...params }]);

            if (error) {
              return { success: false, message: "Failed to book reservation: " + error.message };
            }
            return { success: true, message: "Reservation successfully booked!" };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
