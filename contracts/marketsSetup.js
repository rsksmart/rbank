const { tokenAddresses } = require('./tokenAddresses.json');
const Controller = require('../build/contracts/Controller.json');
const Market = require('../build/contracts/Market.json');

const controllerAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
const owner = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';

setMarkets = (callback) => {
  const controller = new web3.eth.Contract(Controller.abi, controllerAddress);
  tokenAddresses.forEach(async(tokenAddress, idx) => {
    let m = new web3.eth.Contract(Market.abi);
    let ms = m.deploy({data: Market.bytecode,arguments: [tokenAddress, (idx+1)*100000000000000 ]});
    await ms.estimateGas({from: owner})
      .then((gas) => ms.send({ from: owner, gas }))
      .then((market)=> {
        console.log(`Market ${idx + 1} address: ${market._address}.`);
        return [market, market.methods.setController(controller._address).estimateGas({ from: owner })];
      })
      .then((marketPromises) => Promise.all(marketPromises))
      .then(([market, gas]) => {
        return [market,market.methods.setController(controller._address).send({ from: owner, gas })]
      })
      .then((marketPromises) => Promise.all(marketPromises))
      .then(([market, tx]) => {
        // console.log(`Success transaction ${tx.transactionHash}.`)
        console.log(`Controller configured for market ${idx + 1}.`)
        return [market, controller.methods.addMarket(market._address).estimateGas({ from: owner })];
      })
      .then((marketPromises) => Promise.all(marketPromises))
      .then(([market, gas]) => {
        return [market, controller.methods.addMarket(market._address).send({from: owner, gas})];
      })
      .then((marketPromises) => Promise.all(marketPromises))
      .then(([market, tx]) => {
        // console.log(`Success transaction ${tx.transactionHash}.`)
        console.log(`Market ${idx + 1} added to controller.`)
        return [market, controller.methods.setPrice(market._address, ((idx + 1) * 10))
          .estimateGas({ from: owner })];
      })
      .then((marketPromises) => Promise.all(marketPromises))
      .then(([market, gas]) => {
        return controller.methods.setPrice(market._address, ((idx + 1) * 10)).send({from: owner, gas})
      })
      .then((tx) => {
        // console.log(`Success transaction ${tx.transactionHash}.`);
        console.log(`Market ${idx + 1} price: ${(idx + 1) * 10}.`);
        if((idx + 1) === tokenAddresses.length) {
          callback();
          return market;
        }
      })
      .catch((e) => e);
  });
};

module.exports = setMarkets;