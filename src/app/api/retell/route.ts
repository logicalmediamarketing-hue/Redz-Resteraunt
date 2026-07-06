import { NextResponse } from "next/server";
import Retell from "retell-sdk";
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from "@/lib/security";

// Initialize the Retell SDK with the API key from environment variables
const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    // Each token consumes billable Retell minutes — gate token minting
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, 'retell', 10)) return rateLimitedResponse();

    // Agent ID is resolved server-side only — clients cannot mint calls for arbitrary agents
    const agentId = process.env.RETELL_AGENT_ID || process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

    if (!process.env.RETELL_API_KEY || !agentId) {
      return NextResponse.json(
        { error: "Voice concierge is not configured" },
        { status: 503 }
      );
    }

    // Create a new WebRTC call
    const callResponse = await retell.call.createWebCall({
      agent_id: agentId,
    });

    // Return the access token to the client
    return NextResponse.json({
      accessToken: callResponse.access_token,
    });
  } catch (error) {
    console.error("Error creating Retell WebRTC call:", error);
    return NextResponse.json(
      { error: "Failed to initialize call" },
      { status: 500 }
    );
  }
}
