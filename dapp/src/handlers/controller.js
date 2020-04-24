import _ from 'lodash';
import ControllerContract from '@/contracts/Controller.json';
import { ControllerAddress, send, web3 } from '@/handlers';

export default class Controller {
  constructor() {
    this.address = ControllerAddress;
    this.instance = new web3.eth.Contract(ControllerContract.abi, ControllerAddress);
    this.MANTISSA = 1000000;
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
    return new Promise((resolve, reject) => {
      this.instance.methods.marketListSize()
        .call()
        .then((marketListSize) => _.range(marketListSize))
        .then((indices) => indices.map((index) => this.instance.methods.marketList(index)
          .call()))
        .then((promises) => Promise.all(promises))
        .then(resolve)
        .catch(reject);
    });
  }

  getLiquidity(account) {
    return new Promise((resolve, reject) => {
      this.instance.methods.getAccountLiquidity(account)
        .call()
        .then(resolve)
        .catch(reject);
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

  getAccountValues(account) {
    return new Promise((resolve, reject) => {
      this.instance.methods.getAccountValues(account)
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
