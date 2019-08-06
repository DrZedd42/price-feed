const fs = require("fs");
const Web3 = require('web3');
const request = require("request-promise");
let web3 = new Web3('http://localhost:8545');

async function startOracleScheduler() {
  try {
    const response = await request.get('https://api.binance.com/api/v1/ticker/24hr?symbol=ETHUSDT');
    const data = JSON.parse(response);

    const priceOracleContent = fs.readFileSync("./build/contracts/PriceOracle.json");
    const priceOracleJSON = JSON.parse(priceOracleContent);

    const price = web3.utils.toWei(data.lastPrice, "ether");
    const time = parseInt((new Date()).getTime().toString().substring(0, 10), 10);

    const priceOracle = new web3.eth.Contract(priceOracleJSON.abi, '0x90C5E982A3d72B0d9a045AB7653B035efb5E0c56');

    const now = await priceOracle.methods.getTime().call();
    console.log(now);

    const nowPrice = await priceOracle.methods.getPrice().call();
    console.log(nowPrice);
    // data.lastPrice

    //https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#id38
  } catch (err) {
    console.log(err);
  }
}

// Call startEventListener function to watch for events in PriceOracle contract
startOracleScheduler();