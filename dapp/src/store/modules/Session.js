import Web3 from 'web3';
import * as constants from '@/store/constants';
import ControllerContract from '@/contracts/Controller.json';
import store from '@/store';

const ControllerAddres = '0x7fD8226865Fa4ea36b861C2Df126A8d9Af364D29';

let web3;
if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
}
if (window.ethereum) {
  window.ethereum.on('accountsChanged', () => {
    store.dispatch(constants.SESSION_CONNECT_WEB3);
  });
}

const state = {
  account: null,
  instance: null,
  isOwner: false,
};

const actions = {
  [constants.SESSION_CONNECT_WEB3]: async ({ commit }) => {
    web3.eth.getAccounts()
      .then(([account]) => {
        commit(constants.SESSION_SET_PROPERTY, {
          property: 'account',
          value: account,
        });
      })
      .catch(console.error);
  },
  // eslint-disable-next-line no-shadow
  [constants.SESSION_INIT_CONTROLLER]: ({ commit, state }) => {
    const controller = new web3.eth.Contract(ControllerContract.abi, ControllerAddres);
    commit(constants.SESSION_SET_PROPERTY, {
      property: 'instance',
      value: controller,
    });
    controller.methods.owner()
      .call({ from: state.account })
      .then((isOwner) => {
        console.log(isOwner);
        commit(constants.SESSION_SET_PROPERTY, {
          property: 'isOwner',
          value: isOwner,
        });
      })
      .catch(() => {
        commit(constants.SESSION_SET_PROPERTY, {
          property: 'isOwner',
          value: false,
        });
      });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.SESSION_SET_PROPERTY]: (state, { property, value }) => {
    state[property] = value;
  },
};

const getters = {
  // eslint-disable-next-line no-shadow
  [constants.SESSION_IS_LOGGED]: (state) => !!state.account,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
