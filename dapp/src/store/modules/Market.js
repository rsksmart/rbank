import * as constants from '@/store/constants';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';

const state = {
  price: null,
  address: null,
  tokenAddress: null,
  totalSupply: null,
  totalBorrows: null,
};

const actions = {
  [constants.MARKET_INIT]: ({ commit, dispatch }, address) => {
    commit(constants.MARKET_SET_PROPERTY, { address });
    dispatch(constants.MARKET_LOAD_PRICE);
    dispatch(constants.MARKET_LOAD_TOKEN_ADDRESS);
    dispatch(constants.MARKET_LOAD_TOTAL_SUPPLY);
    dispatch(constants.MARKET_LOAD_TOTAL_BORROWS);
  },
  // eslint-disable-next-line no-shadow
  [constants.MARKET_LOAD_PRICE]: ({ commit, state }) => {
    const ctrl = new Controller();
    ctrl.getPrice(state.address)
      .then((price) => {
        commit(constants.MARKET_SET_PROPERTY, { price });
      });
  },
  // eslint-disable-next-line no-shadow
  [constants.MARKET_LOAD_TOKEN_ADDRESS]: ({ commit, state }) => {
    const market = new Market(state.address);
    market.token
      .then((tokenAddress) => {
        commit(constants.MARKET_SET_PROPERTY, { tokenAddress });
      });
  },
  // eslint-disable-next-line no-shadow
  [constants.MARKET_LOAD_TOTAL_SUPPLY]: ({ commit, state }) => {
    const market = new Market(state.address);
    market.totalSupply
      .then((totalSupply) => {
        commit(constants.MARKET_SET_PROPERTY, { totalSupply });
      });
  },
  // eslint-disable-next-line no-shadow
  [constants.MARKET_LOAD_TOTAL_BORROWS]: ({ commit, state }) => {
    const market = new Market(state.address);
    market.totalBorrows
      .then((totalBorrows) => {
        commit(constants.MARKET_SET_PROPERTY, { totalBorrows });
      });
  },
  // eslint-disable-next-line no-shadow
  [constants.MARKET_SET_PRICE]: ({ dispatch, rootState, state }, price) => {
    const ctrl = new Controller();
    ctrl.setPrice(
      { from: rootState.Session.account },
      state.address,
      price,
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
  [constants.MARKET_SET_PROPERTY]: (state, prop) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [property, value] of Object.entries(prop)) {
      state[property] = value;
    }
  },
};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
