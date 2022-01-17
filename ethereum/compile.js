const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
//delete build folder if exists
fs.removeSync(buildPath);
//get contract path
const contractPath = path.resolve(__dirname, "contracts", "Campaign.sol");
//read contract
const source = fs.readFileSync(contractPath, "utf8");

//compile
const output = solc.compile(source, 1).contracts;

//create the build directory
fs.ensureDirSync(buildPath);
//write the ouput to seperate files
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
