import MarketContract from '@/contracts/Market.json';
import * as constants from '@/store/constants';
import { send, web3 } from '@/store/modules';

const state = {
  market: null,
  price: null,
  marketAddress: null,
};

const actions = {
  // eslint-disable-next-line no-shadow
  [constants.MARKET_INIT]: ({ commit, dispatch, state }) => {
    const market = new web3.eth.Contract(MarketContract.abi, state.marketAddress);
    commit(constants.MARKET_SET_PROPERTY, { market });
    dispatch(constants.MARKET_LOAD_PRICE);
  },
  // eslint-disable-next-line no-shadow
  [constants.MARKET_LOAD_PRICE]: ({ commit, rootState, state }) => {
    rootState.Controller.controller.methods.prices(state.marketAddress)
      .call()
      .then((price) => {
        commit(constants.MARKET_SET_PROPERTY, { price });
      });
  },
  // eslint-disable-next-line no-shadow
  [constants.MARKET_SET_PRICE]: ({ dispatch, rootState, state }, price) => {
    send(
      rootState.Controller.controller.methods.setPrice(state.marketAddress, price),
      { from: rootState.Session.account },
    )
      .then(() => {
        dispatch(constants.MARKET_LOAD_PRICE);
      })
      .catch((e) => {
        console.error(JSON.stringify(e));
      });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.MARKET_SET_PROPERTY]: (state, value) => {
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
