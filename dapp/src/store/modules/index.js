/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */
import Web3 from 'web3';

const files = require.context('.', false, /\.js$/);
const modules = {};

export const ControllerAddress = '0x6dF43d5EFD4ddE3cC72EDf36F012A5c390b628aC';

// eslint-disable-next-line import/no-mutable-exports
export let web3;
if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
}

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

files.keys()
  .forEach((key) => {
    if (key === './index.js') return;
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
  });

export default modules;
