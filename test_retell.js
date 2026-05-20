import Retell from "retell-sdk";
const retell = new Retell({ apiKey: "key_38a2f5a9305b5f117df2e3b55754" });
async function test() {
  try {
    const chat = await retell.chat.create({ agent_id: "agent_38c3cc715a92b4ba4dbb54779e" });
    console.log("Chat created:", chat);
  } catch (e) {
    console.error("Error creating chat:", e.message);
  }
}
test();
