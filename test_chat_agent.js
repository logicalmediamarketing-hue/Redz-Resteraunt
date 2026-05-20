import Retell from "retell-sdk";
const retell = new Retell({ apiKey: "key_38a2f5a9305b5f117df2e3b55754" });
async function test() {
  try {
    const chat = await retell.chat.create({ agent_id: "agent_e7981ca5ba10842f9d2545d30d" });
    console.log("Chat created:", chat);
  } catch (e) {
    console.error("Error creating chat:", e.message);
  }
}
test();
