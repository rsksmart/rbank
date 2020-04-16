import Web3 from 'web3';
import * as constants from '@/store/constants';
import ControllerContract from '@/contracts/Controller.json';
import store from '@/store';

const ControllerAddres = '0x548980D2A5408261a57C4dc393f4345842c7Bcc2';

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
  // eslint-disable-next-line no-shadow
  [constants.SESSION_CONNECT_WEB3]: ({ commit, state }) => {
    web3.eth.getAccounts()
      .then(([account]) => {
        commit(constants.SESSION_SET_PROPERTY, {
          property: 'account',
          value: account,
        });
        return account;
      })
      .then((from) => state.instance.methods.owner()
        .call({ from }))
      .then((owner) => {
        console.log(owner);
        commit(constants.SESSION_SET_PROPERTY, {
          property: 'isOwner',
          value: owner === state.account,
        });
      })
      .catch((e) => {
        console.error(e);
        commit(constants.SESSION_SET_PROPERTY, {
          property: 'isOwner',
          value: false,
        });
      });
  },
  // eslint-disable-next-line no-shadow
  [constants.SESSION_INIT_CONTROLLER]: ({ commit }) => {
    const instance = new web3.eth.Contract(ControllerContract.abi, ControllerAddres);
    commit(constants.SESSION_SET_PROPERTY, {
      property: 'instance',
      value: instance,
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
