import Retell from "retell-sdk";
const retell = new Retell({ apiKey: "key_38a2f5a9305b5f117df2e3b55754" });
async function test() {
  try {
    const agent = await retell.agent.retrieve("agent_e7981ca5ba10842f9d2545d30d");
    console.log(JSON.stringify(agent, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}
test();
