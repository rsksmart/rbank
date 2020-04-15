import * as constants from '@/store/constants';

const state = {
  connected: false,
};

const actions = {};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.SESSION_SET_PROPERTY]: (state, { property, value }) => {
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
