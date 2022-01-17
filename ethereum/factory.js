import web3 from "./web3";
const campaignFactory = require("./build/Factory.json");

const instance = new web3.eth.Contract(
  JSON.parse(campaignFactory.interface),
  "0x600a8f109914A8E8f642e74eab251458d21DB1CF"
);

export default instance;
