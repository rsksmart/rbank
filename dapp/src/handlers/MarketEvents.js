import MarketContract from '@/contracts/Market.json';
// eslint-disable-next-line no-unused-vars
import { send, web3WS } from '@/handlers';

export default class MarketEvents {
  constructor(marketAddress) {
    this.address = marketAddress;
    this.instance = new web3WS.eth.Contract(MarketContract.abi, marketAddress);
  }

  static subscribeNewBlockHeaders(callback) {
    return web3WS.eth.subscribe(
      'newBlockHeaders',
      callback,
    );
  }

  subscribeSupply(callback) {
    return this.instance.events.Supply({
      fromBlock: 'latest',
    }, callback);
  }

  subscribeBorrow(callback) {
    return this.instance.events.Borrow({
      fromBlock: 'latest',
    }, callback);
  }

  subscribePayBorrow(callback) {
    return this.instance.events.PayBorrow({
      fromBlock: 'latest',
    }, callback);
  }

  subscribeRedeem(callback) {
    return this.instance.events.Redeem({
      fromBlock: 'latest',
    }, callback);
  }
}
