import ControllerContract from '@/contracts/Controller.json';
import MarketContract from '@/contracts/Market.json';
import * as constants from '@/store/constants';
import { ControllerAddress, send, web3 } from '@/store/modules';

const state = {
  controller: null,
  markets: [],
};

const actions = {
  [constants.CONTROLLER_INIT]: ({ commit }) => {
    const controller = new web3.eth.Contract(ControllerContract.abi, ControllerAddress);
    commit(constants.CONTROLLER_SET_PROPERTY, { controller });
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_LOAD_MARKETS]: async ({ commit, state }) => {
    let control = 1;
    const markets = [];
    try {
      while (control) {
        // eslint-disable-next-line no-await-in-loop
        const marketAddress = await state.controller.methods.marketList(control - 1)
          .call();
        markets.push(marketAddress);
        commit(constants.CONTROLLER_SET_PROPERTY, { markets });
        control += 1;
      }
    } catch (e) {
      control = 0;
    }
  },
  [constants.CONTROLLER_CREATE_MARKET]: (
    // eslint-disable-next-line no-shadow
    { dispatch, rootState, state },
    { tokenAddress, marketBaseBorrowRate },
  ) => {
    const from = { from: rootState.Session.account };
    const market = new web3.eth.Contract(MarketContract.abi);
    const deploy = market.deploy({
      data: MarketContract.bytecode,
      arguments: [tokenAddress, marketBaseBorrowRate],
    });
    send(deploy, from)
      .then((instance) => instance.options.address)
      .then((contractAddress) => state.controller.methods.addMarket(contractAddress))
      .then((signature) => send(signature, from))
      .then(() => {
        dispatch(constants.CONTROLLER_LOAD_MARKETS);
      });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_PROPERTY]: (state, value) => {
    const property = Object.entries(value)[0][0];
    state[property] = value[property];
  },
};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
