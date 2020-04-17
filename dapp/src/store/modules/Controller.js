import ControllerContract from '@/contracts/Controller.json';
import MarketContract from '@/contracts/Market.json';
import * as constants from '@/store/constants';
import { ControllerAddress, send, web3 } from '@/store/modules';

const state = {
  controller: null,
  collateralFactor: null,
  liquidationFactor: null,
  markets: [],
};

const actions = {
  [constants.CONTROLLER_INIT]: ({ commit }) => {
    const controller = new web3.eth.Contract(ControllerContract.abi, ControllerAddress);
    commit(constants.CONTROLLER_SET_PROPERTY, {
      property: 'controller',
      value: controller,
    });
  },
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_LOAD_COLLATERAL_FACTOR]: ({ commit, state }) => {
    state.controller.methods.collateralFactor()
      .call()
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
  // eslint-disable-next-line no-shadow
  [constants.CONTROLLER_LOAD_LIQUIDATION_FACTOR]: ({ commit, state }) => {
    state.controller.methods.liquidationFactor()
      .call()
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
        commit(constants.CONTROLLER_SET_PROPERTY, {
          property: 'markets',
          value: markets,
        });
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
    const deploySignature = market.deploy({
      data: MarketContract.bytecode,
      arguments: [tokenAddress, marketBaseBorrowRate],
    });
    send(deploySignature, from)
      .then((marketInstance) => {
        const setControllerSignature = marketInstance.methods.setController(
          state.controller.options.address,
        );
        send(setControllerSignature, from);
        return marketInstance.options.address;
      })
      .then((marketAddress) => state.controller.methods.addMarket(marketAddress))
      .then((signature) => send(signature, from))
      .then(() => {
        dispatch(constants.CONTROLLER_LOAD_MARKETS);
      });
  },
  [constants.CONTROLLER_SET_COLLATERAL_FACTOR]: (
    // eslint-disable-next-line no-shadow
    { dispatch, rootState, state },
    collateralFactor,
  ) => {
    console.log(collateralFactor);
    send(
      state.controller.methods.setCollateralFactor(collateralFactor),
      { from: rootState.Session.account },
    )
      .then(() => {
        dispatch(constants.CONTROLLER_LOAD_COLLATERAL_FACTOR);
      });
  },
  [constants.CONTROLLER_SET_LIQUIDATION_FACTOR]: (
    // eslint-disable-next-line no-shadow
    { dispatch, rootState, state },
    liquidationFactor,
  ) => {
    send(
      state.controller.methods.setLiquidationFactor(liquidationFactor),
      { from: rootState.Session.account },
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
