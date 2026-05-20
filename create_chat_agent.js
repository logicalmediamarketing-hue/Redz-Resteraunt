import Retell from "retell-sdk";
const retell = new Retell({ apiKey: "key_38a2f5a9305b5f117df2e3b55754" });
async function test() {
  try {
    const agent = await retell.agent.create({
      agent_name: "Henry (Redz) Chat",
      channel: "chat",
      voice_id: "openai-Echo",
      response_engine: {
        type: "retell-llm",
        llm_id: "llm_da48c8384b1f87aaf915da95709c"
      },
      language: "en-US",
      data_storage_setting: "everything"
    });
    console.log("Created Chat Agent ID:", agent.agent_id);
  } catch (e) {
    console.error(e.message);
  }
}
test();
