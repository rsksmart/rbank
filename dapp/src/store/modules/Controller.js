import * as constants from '@/store/constants';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

const state = {
  markets: [],
};

const actions = {
  [constants.CONTROLLER_GET_MARKETS]: ({ commit, dispatch }) => {
    console.log('Calling getMarkets');
    const controller = new Controller();
    controller.eventualMarketAddresses
      .then((marketAddresses) => {
        const markets = marketAddresses.map((marketAddress) => ({
          address: marketAddress,
          token: {
            address: null,
            name: null,
            symbol: null,
          },
          borrowRate: null,
          price: null,
          cash: null,
          supplied: null,
          borrowed: null,
        }));
        commit(constants.CONTROLLER_SET_PROPERTY, { markets });
        dispatch(constants.CONTROLLER_GET_MARKETS_TOKENS, { marketAddresses });
        dispatch(constants.CONTROLLER_GET_MARKETS_CASH, { marketAddresses });
        dispatch(constants.CONTROLLER_GET_MARKETS_PRICE, { marketAddresses });
        dispatch(constants.CONTROLLER_GET_MARKETS_BORROW_RATE, { marketAddresses });
        dispatch(constants.CONTROLLER_GET_MARKETS_TOTAL_BORROWS, { marketAddresses });
        dispatch(constants.CONTROLLER_GET_MARKETS_TOTAL_SUPPLIES, { marketAddresses });
      });
  },
  [constants.CONTROLLER_GET_MARKETS_TOKENS]: ({ commit }, { marketAddresses }) => {
    const marketIntances = marketAddresses.map((marketAddress) => new Market(marketAddress));
    marketIntances.forEach((marketInstance, idx) => {
      marketInstance.eventualTokenAddress
        .then((tokenAddress) => {
          const token = new Token(tokenAddress);
          commit(constants.CONTROLLER_SET_MARKET_TOKEN_ADDRESS, { marketIndex: idx, tokenAddress });
          return [token.eventualName, token.eventualSymbol];
        })
        .then((tokenPromises) => Promise.all(tokenPromises))
        .then(([tokenName, tokenSymbol]) => {
          commit(constants.CONTROLLER_SET_MARKET_TOKEN_NAME, { marketIndex: idx, tokenName });
          commit(constants.CONTROLLER_SET_MARKET_TOKEN_SYMBOL, { marketIndex: idx, tokenSymbol });
        });
    });
  },
  [constants.CONTROLLER_GET_MARKETS_CASH]: ({ commit }, { marketAddresses }) => {
    const marketsCashPromeses = marketAddresses
      .map((marketAddress) => new Market(marketAddress).eventualCash);
    Promise.all(marketsCashPromeses)
      .then((marketsCash) => {
        marketsCash.forEach((marketCash, idx) => {
          commit(constants.CONTROLLER_SET_MARKET_CASH, { marketIndex: idx, marketCash });
        });
      });
  },
  [constants.CONTROLLER_GET_MARKETS_PRICE]: ({ commit }, { marketAddresses }) => {
    const marketsPricePromeses = marketAddresses
      .map((marketAddress) => new Controller().getPrice(marketAddress));
    Promise.all(marketsPricePromeses)
      .then((marketsPrice) => {
        marketsPrice.forEach((marketPrice, idx) => {
          commit(constants.CONTROLLER_SET_MARKET_PRICE, { marketIndex: idx, marketPrice });
        });
      });
  },
  [constants.CONTROLLER_GET_MARKETS_BORROW_RATE]: ({ commit }, { marketAddresses }) => {
    const marketsBorrowRatePromeses = marketAddresses
      .map((marketAddress) => new Market(marketAddress).getBorrowRate());
    Promise.all(marketsBorrowRatePromeses)
      .then((marketsBorrowRate) => {
        marketsBorrowRate.forEach((marketBorrowRate, idx) => {
          commit(constants.CONTROLLER_SET_MARKET_BORROW_RATE,
            { marketIndex: idx, marketBorrowRate });
        });
      });
  },
  [constants.CONTROLLER_GET_MARKETS_TOTAL_BORROWS]: ({ commit }, { marketAddresses }) => {
    const marketsTotalBorrowsPromeses = marketAddresses
      .map((marketAddress) => new Market(marketAddress).getUpdatedTotalBorrows());
    Promise.all(marketsTotalBorrowsPromeses)
      .then((marketsTotalBorrows) => {
        marketsTotalBorrows.forEach((marketBorrows, idx) => {
          commit(constants.CONTROLLER_SET_MARKET_TOTAL_BORROWS,
            { marketIndex: idx, marketBorrows });
        });
      });
  },
  [constants.CONTROLLER_GET_MARKETS_TOTAL_SUPPLIES]: ({ commit }, { marketAddresses }) => {
    const marketsTotalSuppliesPromeses = marketAddresses
      .map((marketAddress) => new Market(marketAddress).getUpdatedTotalSupply());
    Promise.all(marketsTotalSuppliesPromeses)
      .then((marketsTotalSupplies) => {
        marketsTotalSupplies.forEach((marketSupplies, idx) => {
          commit(constants.CONTROLLER_SET_MARKET_TOTAL_SUPPLIES,
            { marketIndex: idx, marketSupplies });
        });
      });
  },
  [constants.CONTROLLER_MARKET_UPDATE_BORROW_RATE]: (
    { commit },
    { marketIndex, marketBorrowRate },
  ) => {
    commit(constants.CONTROLLER_SET_MARKET_BORROW_RATE, { marketIndex, marketBorrowRate });
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
