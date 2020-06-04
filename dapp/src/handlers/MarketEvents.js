import Controller from '@/handlers/controller';
// eslint-disable-next-line no-unused-vars
import { send, web3WS } from '@/handlers';

export default class MarketEvents {
  constructor() {
    this.controller = new Controller();
    this.subscription = web3WS.eth.subscribe(
      'newBlockHeaders',
      (error, result) => {
        if (!error) {
          console.log(result);
          return;
        }
        console.error(error);
      },
    );
  }
}
