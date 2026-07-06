import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendNotifications } from "@/lib/notify";
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from "@/lib/security";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Each request is a billable LLM call — gate to our own pages and cap per-IP volume
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, 'chat', 100)) return rateLimitedResponse();

    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: await convertToModelMessages(messages),
      // Budget for tool call + retry + closing assistant text; the loop exits early
      // on any step that produces no tool calls
      stopWhen: stepCountIs(5),
      system: `You are Henry, the exclusive AI Concierge for Redz Restaurant in Mt Laurel, NJ. You are a highly professional, polite, and sophisticated Maître D'.
Your primary goal is to answer questions about the restaurant (menus, hours, location) and autonomously book reservations.

If a customer wants to make a reservation:
1. You MUST gather the following details sequentially:
   - Guest's Name
   - Email Address
   - Phone Number
   - Date of reservation
   - Time of reservation
   - Party Size (number of guests)
   - Special Requests (optional)
2. Once you have gathered Name, Email, Phone, Date, Time, and Party Size, you MUST invoke the 'book_reservation' tool to lock in the reservation.
3. Keep your conversational turns concise, helpful, and high-status.

Restaurant Info:
- Phone: 856-380-6045 (Fallback phone to provide if database error occurs)
- Address: 515 Fellowship Road, Mt Laurel, NJ 08054 (Located in the DoubleTree Suites by Hilton)
- Breakfast: Mon-Fri 6:30am - 10:30am, Sat-Sun 7:00am - 11:30am
- Dinner: Mon-Sat 4:00pm - 10:00pm, Sun 5:00pm - 9:00pm
- Happy Hour: Mon-Fri 4:00pm - 6:00pm`,
      tools: {
        book_reservation: tool({
          description: "Books a reservation directly into the restaurant's Supabase database.",
          inputSchema: z.object({
            name: z.string().describe("The guest's full name"),
            email: z.string().email().describe("The guest's email address"),
            phone: z.string().describe("The guest's phone number"),
            date: z.string().describe("The reservation date in yyyy-mm-dd format"),
            time: z.string().describe("The reservation time in hh:mm format (24-hour or 12-hour)"),
            party_size: z.number().describe("The number of guests in the party"),
            special_requests: z.string().optional().describe("Any special requests or dietary restrictions")
          }),
          execute: async ({ name, email, phone, date, time, party_size, special_requests }) => {
            try {
              // 1. Insert into Supabase 'reservations' table.
              // No .select() after insert: the anon role has INSERT but not SELECT under RLS,
              // so a RETURNING clause would be rejected.
              const { error } = await supabase
                .from("reservations")
                .insert([
                  {
                    name,
                    email,
                    phone,
                    date,
                    time,
                    party_size,
                    special_requests: special_requests || "",
                    status: "confirmed" // Automatically confirm reservations made by AI Concierge
                  }
                ]);

              if (error) {
                console.error("Database insert error:", error);
                return { success: false, error: "The reservation could not be saved. Please call 856-380-6045 to book." };
              }

              // 2. Trigger notifications (email/SMS) directly
              try {
                await sendNotifications("reservation", {
                  name,
                  email,
                  phone,
                  date,
                  time,
                  party_size,
                  special_requests
                });
              } catch (notifyErr) {
                console.error("Failed to trigger reservation notifications:", notifyErr);
              }

              // Echo the confirmed details back from the validated tool input
              return { success: true, reservation: { name, date, time, party_size, special_requests } };
            } catch (err) {
              console.error("Failed to book reservation:", err);
              return { success: false, error: "The reservation could not be saved. Please call 856-380-6045 to book." };
            }
          }
        })
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat completion error:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
