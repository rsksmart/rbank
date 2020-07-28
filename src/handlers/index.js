import Web3 from 'web3';

export const ControllerAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';

// eslint-disable-next-line import/no-mutable-exports
export let web3;
// eslint-disable-next-line import/no-mutable-exports
export let web3WS;
if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
  web3WS = new Web3('ws://127.0.0.1:8545');
}

/**
 * Provider session account address
 * @typedef {Object} from
 */

/**
 * Blockchain response object from performed transaction
 * @typedef {Object} txObjectResponse
 */

/**
 * Sends a transaction to the blockchain
 * @param {Object} signature Encoded signature of the method to be performed
 * @param {Object} account Sender's account
 * @return {Promise<txObjectResponse>} Response of the performed transaction
 */
export const send = (signature, account) => new Promise((resolve, reject) => {
  const from = { from: account };
  signature.estimateGas(from)
    .then((gas) => signature.send({
      ...from,
      gas,
    }))
    .then(resolve)
    .catch(reject);
});
