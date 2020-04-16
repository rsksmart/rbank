<template>
  <div class="MarketsList">
    <h2>Current Markets</h2>
    {{markets}}
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'MarketsList',
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
  },
  methods: {
    ...mapActions({
      loadMarkets: constants.CONTROLLER_LOAD_MARKETS,
    }),
  },
  created() {
    this.loadMarkets();
  },
};
</script>
