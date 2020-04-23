import MarketContract from '@/contracts/Market.json';
import { send, web3 } from '@/handlers';

export default class Market {
  constructor(marketAddress) {
    this.address = marketAddress;
    this.instance = new web3.eth.Contract(MarketContract.abi, marketAddress);
  }

  static deploy(from, tokenAddress, marketBaseBorrowRate) {
    return new Promise((resolve, reject) => {
      const args = [tokenAddress, marketBaseBorrowRate];
      const newMarket = new web3.eth.Contract(MarketContract.abi);
      const deploy = newMarket.deploy({
        data: MarketContract.bytecode,
        arguments: args,
      });
      send(deploy, from)
        .then((market) => market.options.address)
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualTotalSupply() {
    return new Promise((resolve, reject) => {
      this.instance.methods.totalSupply()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualTotalBorrows() {
    return new Promise((resolve, reject) => {
      this.instance.methods.totalBorrows()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualControllerAddress() {
    return new Promise((resolve, reject) => {
      this.instance.methods.controller()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualBaseBorrowRate() {
    return new Promise((resolve, reject) => {
      this.instance.methods.baseBorrowRate()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualTokenAddress() {
    return new Promise((resolve, reject) => {
      this.instance.methods.token()
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

  getSupplyOf(accountAddress) {
    return new Promise((resolve, reject) => {
      this.instance.methods.supplyOf(accountAddress)
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  getBorrowBy(accountAddress) {
    return new Promise((resolve, reject) => {
      this.instance.methods.borrowBy(accountAddress)
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  setController(from, controllerAddress) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.setController(controllerAddress), from)
        .then(resolve)
        .catch(reject);
    });
  }

  supply(from, amount) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.supply(amount), from)
        .then(resolve)
        .catch(reject);
    });
  }

  borrow(from, amount) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.borrow(amount), from)
        .then(resolve)
        .catch(reject);
    });
  }

  redeem(from, amount) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.redeem(amount), from)
        .then(resolve)
        .catch(reject);
    });
  }

  payBorrow(from, amount) {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.payBorrow(amount), from)
        .then(resolve)
        .catch(reject);
    });
  }
}
