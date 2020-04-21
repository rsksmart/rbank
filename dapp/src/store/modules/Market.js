import * as constants from '@/store/constants';

const state = {};

const actions = {};

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
