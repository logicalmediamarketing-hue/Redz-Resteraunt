import { NextResponse } from "next/server";
import Retell from "retell-sdk";

export const maxDuration = 30;

const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { message, chatId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let activeChatId = chatId;

    // 1. Create a new chat session if we don't have one
    if (!activeChatId) {
      const agentId = process.env.NEXT_PUBLIC_RETELL_CHAT_AGENT_ID || "agent_e7981ca5ba10842f9d2545d30d";
      if (!agentId) {
        throw new Error("Retell Agent ID is not configured.");
      }
      const chat = await retell.chat.create({
        agent_id: agentId,
      });
      activeChatId = chat.chat_id;
    }

    // 2. Generate the completion using the Retell agent
    const response = await retell.chat.createChatCompletion({
      chat_id: activeChatId,
      content: message,
    });

    return NextResponse.json({
      chatId: activeChatId,
      messages: response.messages,
    });

  } catch (error: any) {
    console.error("Error in Retell chat completion:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat" },
      { status: 500 }
    );
  }
}
