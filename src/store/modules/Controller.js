import * as constants from '@/store/constants';

const state = {
  markets: [],
  factor: 1e16,
  mantissa: 1e6,
};

const actions = {
  [constants.CONTROLLER_MARKET_UPDATE_BORROW_RATE]:
    ({ commit }, { marketIndex, marketBorrowRate }) => {
      commit(constants.CONTROLLER_SET_MARKET_BORROW_RATE, { marketIndex, marketBorrowRate });
    },
  [constants.CONTROLLER_MARKET_UPDATE]: ({ dispatch }, marketIndex) => {
    dispatch(constants.CONTROLLER_MARKET_GET_CASH, { marketIndex });
    dispatch(constants.CONTROLLER_MARKET_GET_BORROW_RATE, { marketIndex });
    dispatch(constants.CONTROLLER_MARKET_GET_TOTAL_BORROWS, { marketIndex });
    dispatch(constants.CONTROLLER_MARKET_GET_TOTAL_SUPPLIES, { marketIndex });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_PROPERTY]: (state, data) => {
    const [[property, value]] = Object.entries(data);
    state[property] = value;
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_TOKEN_ADDRESS]: (state, { marketIndex, tokenAddress }) => {
    state.markets[marketIndex].token.address = tokenAddress;
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_TOKEN_NAME]: (state, { marketIndex, tokenName }) => {
    state.markets[marketIndex].token.name = tokenName;
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_TOKEN_SYMBOL]: (state, { marketIndex, tokenSymbol }) => {
    state.markets[marketIndex].token.symbol = tokenSymbol;
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_TOKEN_DECIMALS]: (state, { marketIndex, tokenDecimals }) => {
    state.markets[marketIndex].token.decimals = Number(tokenDecimals);
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_CASH]: (state, { marketIndex, marketCash }) => {
    state.markets[marketIndex].cash = Number(marketCash);
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_PRICE]: (state, { marketIndex, marketPrice }) => {
    state.markets[marketIndex].price = Number(marketPrice);
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_BORROW_RATE]: (state, { marketIndex, marketBorrowRate }) => {
    state.markets[marketIndex].borrowRate = Number(marketBorrowRate);
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_TOTAL_BORROWS]: (state, { marketIndex, marketBorrows }) => {
    state.markets[marketIndex].borrowed = Number(marketBorrows);
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_MARKET_TOTAL_SUPPLIES]: (state, { marketIndex, marketSupplies }) => {
    state.markets[marketIndex].supplied = Number(marketSupplies);
  },
};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
