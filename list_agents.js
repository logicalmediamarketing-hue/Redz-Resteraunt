import Retell from "retell-sdk";
const retell = new Retell({ apiKey: "key_38a2f5a9305b5f117df2e3b55754" });
async function test() {
  try {
    const agents = await retell.agent.list();
    console.log(JSON.stringify(agents, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}
test();
