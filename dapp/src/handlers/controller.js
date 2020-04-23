import ControllerContract from '@/contracts/Controller.json';
import { ControllerAddress, send, web3 } from '@/handlers';

export default class Controller {
  constructor() {
    this.address = ControllerAddress;
    this.instance = new web3.eth.Contract(ControllerContract.abi, ControllerAddress);
  }

  get eventualCollateralFactor() {
    return new Promise((resolve, reject) => {
      this.instance.methods.collateralFactor()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualLiquidationFactor() {
    return new Promise((resolve, reject) => {
      this.instance.methods.liquidationFactor()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualMarketAddresses() {
    let control = 1;
    const markets = [];
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        while (control) {
          // eslint-disable-next-line no-await-in-loop
          const marketAddress = await this.instance.methods.marketList(control - 1)
            .call();
          markets.push(marketAddress);
          control += 1;
        }
      } catch {
        resolve(markets);
      }
    });
  }

  getPrice(marketAddress) {
    return new Promise((resolve, reject) => {
      this.instance.methods.prices(marketAddress)
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  setCollateralFactor(from, collateralFactor) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.setCollateralFactor(collateralFactor), from)
        .then(resolve)
        .catch(reject);
    });
  }

  setLiquidationFactor(from, liquidationFactor) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.setLiquidationFactor(liquidationFactor), from)
        .then(resolve)
        .catch(reject);
    });
  }

  setPrice(from, marketAddress, price) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.setPrice(marketAddress, price), from)
        .then(resolve)
        .catch(reject);
    });
  }

  addMarket(from, marketAddress) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.addMarket(marketAddress), from)
        .then(resolve)
        .catch(reject);
    });
  }
}
