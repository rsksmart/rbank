import Web3 from 'web3';

export const ControllerAddress = '0x6dF43d5EFD4ddE3cC72EDf36F012A5c390b628aC';

// eslint-disable-next-line import/no-mutable-exports
export let web3;
if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
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
 * @param {Object} from Sender's account
 * @return {Promise<txObjectResponse>} Response of the performed transaction
 */
export const send = (signature, from) => new Promise((resolve, reject) => {
  signature.estimateGas(from)
    .then((gas) => signature.send({
      ...from,
      gas,
    }))
    .then(resolve)
    .catch(reject);
});
