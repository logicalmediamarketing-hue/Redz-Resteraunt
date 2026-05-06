import Retell from 'retell-sdk';
import fs from 'fs';

const retell = new Retell({
  apiKey: 'key_38a2f5a9305b5f117df2e3b55754',
});

async function main() {
  try {
    // 1. Create a Retell LLM (Optional, but good for standalone agent)
    // Actually, Retell recommends using an existing LLM or creating one.
    // For simplicity, we can create an agent that uses a default or provided LLM.
    // Let's create an LLM first.
    console.log("Creating LLM...");
    const llm = await retell.llm.create({
      model: "gpt-4o", // We use GPT-4o because Retell supports it natively and we have the OpenAI key if needed. But wait, Retell provides its own LLMs without needing OpenAI keys if using their 'retell-ai' models!
      // Wait, we can specify 'model' as 'gpt-4o' and let Retell handle it, but it requires our own OpenAI key if we use custom LLM endpoint.
      // Let's use Retell's native LLM. 
      // Retell LLM creation requires a system prompt.
      general_prompt: "You are Henry, the exclusive AI Concierge for Redz Restaurant in Mt Laurel, NJ. You are a highly professional, male Maître D'. Keep responses very brief (1-2 sentences). You can help book reservations.",
    });

    console.log("LLM created:", llm.llm_id);

    // 2. Create Agent with a Male Voice
    // '11labs-Adam' is a common male voice in ElevenLabs.
    console.log("Creating Agent...");
    const agent = await retell.agent.create({
      response_engine: {
        type: "retell-llm",
        llm_id: llm.llm_id,
      },
      voice_id: "11labs-Brian", // Deep, professional male voice
      agent_name: "Henry (Redz)",
      language: "en-US",
    });

    console.log("Agent created:", agent.agent_id);

    // 3. Update .env.local
    const envPath = '/Users/joshtrinity/Downloads/claude code/redz-restaurant/.env.local';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Append keys
    envContent += `\nRETELL_API_KEY=key_38a2f5a9305b5f117df2e3b55754\n`;
    envContent += `NEXT_PUBLIC_RETELL_AGENT_ID=${agent.agent_id}\n`;
    // We will also append the OPENAI key so the text chat works, since we don't have Gemini key
    envContent += `OPENAI_API_KEY=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\n`;

    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env.local with new Agent ID and API keys.");

  } catch (error) {
    console.error("Error creating agent:", error);
  }
}

main();
