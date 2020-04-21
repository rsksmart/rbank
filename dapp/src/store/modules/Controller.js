import * as constants from '@/store/constants';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';

const controller = new Controller();

const state = {
  collateralFactor: null,
  liquidationFactor: null,
  markets: [],
};

const actions = {
  [constants.CONTROLLER_LOAD_COLLATERAL_FACTOR]: ({ commit }) => {
    controller.collateralFactor
      .then((collateralFactor) => {
        commit(constants.CONTROLLER_SET_PROPERTY, {
          property: 'collateralFactor',
          value: collateralFactor,
        });
      })
      .catch((e) => {
        console.log(e);
        commit(constants.CONTROLLER_SET_PROPERTY, {
          property: 'collateralFactor',
          value: -1,
        });
      });
  },
  [constants.CONTROLLER_LOAD_LIQUIDATION_FACTOR]: ({ commit }) => {
    controller.liquidationFactor
      .then((liquidationFactor) => {
        commit(constants.CONTROLLER_SET_PROPERTY, {
          property: 'liquidationFactor',
          value: liquidationFactor,
        });
      })
      .catch(() => {
        commit(constants.CONTROLLER_SET_PROPERTY, {
          property: 'liquidationFactor',
          value: -1,
        });
      });
  },
  [constants.CONTROLLER_LOAD_MARKETS]: ({ commit }) => {
    controller.markets
      .then((markets) => {
        commit(constants.CONTROLLER_SET_PROPERTY, {
          property: 'markets',
          value: markets,
        });
      });
  },
  [constants.CONTROLLER_CREATE_MARKET]: (
    { dispatch, rootState },
    { tokenAddress, marketBaseBorrowRate },
  ) => {
    const from = { from: rootState.Session.account };
    Market.deploy(
      from,
      tokenAddress,
      marketBaseBorrowRate,
    )
      .then((marketAddress) => {
        const market = new Market(marketAddress);
        market.setController(
          from,
          controller.address,
        );
        return marketAddress;
      })
      .then((marketAddress) => controller.addMarket(from, marketAddress))
      .then(() => {
        dispatch(constants.CONTROLLER_LOAD_MARKETS);
      });
  },
  [constants.CONTROLLER_SET_COLLATERAL_FACTOR]: ({ dispatch, rootState }, collateralFactor) => {
    controller.setCollateralFactor(
      { from: rootState.Session.account },
      collateralFactor,
    )
      .then(() => {
        dispatch(constants.CONTROLLER_LOAD_COLLATERAL_FACTOR);
      });
  },
  [constants.CONTROLLER_SET_LIQUIDATION_FACTOR]: ({ dispatch, rootState }, liquidationFactor) => {
    controller.setLiquidationFactor(
      { from: rootState.Session.account },
      liquidationFactor,
    )
      .then(() => {
        dispatch(constants.CONTROLLER_LOAD_LIQUIDATION_FACTOR);
      });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_SET_PROPERTY]: (state, { property, value }) => {
    state[property] = value;
  },
};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
