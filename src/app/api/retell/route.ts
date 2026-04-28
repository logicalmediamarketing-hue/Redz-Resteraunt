import { NextResponse } from "next/server";
import Retell from "retell-sdk";

// Initialize the Retell SDK with the API key from environment variables
const retell = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { agentId } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
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
  } catch (error: any) {
    console.error("Error creating Retell WebRTC call:", error);
    return NextResponse.json(
      { error: "Failed to initialize call" },
      { status: 500 }
    );
  }
}
