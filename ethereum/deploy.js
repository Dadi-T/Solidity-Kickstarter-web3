const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const provider = new HDWalletProvider({
  mnemonic:
    "ribbon fantasy amount combine steel huge mean spread faith wonder wheel brisk",
  providerOrUrl:
    "https://rinkeby.infura.io/v3/4a917d78d0aa477a8d9408b8e75691ca",
});
const web3 = new Web3(provider);
const compiledFactory = require("./build/Factory.json");

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Using the account with address :", accounts[0]);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed at :", result.options.address);
};
deploy();
