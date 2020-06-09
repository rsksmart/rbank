<template>
  <component :is="currentComponent">
    <router-view/>
  </component>
</template>

<script>
import BaseLayout from '@/components/layouts/base/Index.vue';
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';
import Controller from '@/handlers/controller';
import MarketEvents from '@/handlers/MarketEvents';

export default {
  name: 'App',
  data() {
    return {
      layout: 'Base',
      layouts: [
        'Base',
      ],
      controller: null,
      marketInstances: [],
    };
  },
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
    currentComponent() {
      return `${this.layout.toLowerCase()}-layout`;
    },
  },
  methods: {
    ...mapActions({
      loadControllerAtSession: constants.SESSION_INIT_CONTROLLER,
      getMarkets: constants.CONTROLLER_GET_MARKETS,
    }),
    handleErrorEvent(error) {
      if (error) {
        console.error(`Event error: ${error}`);
      }
    },
    instantiateMarkets() {
      this.controller.eventualMarketAddresses
        .then((marketAddresses) => {
          // eslint-disable-next-line max-len
          this.marketInstances = marketAddresses.map((marketAddr) => new MarketEvents(marketAddr));
          this.createSubscription();
        });
    },
    createSubscription() {
      this.marketInstances.forEach((market, idx) => {
        market.subscribeSupply((err, event) => {
          this.handleErrorEvent(err);
          console.log(`Supply: ${JSON.stringify(event.returnValues)} Market: ${idx}`);
        });
        market.subscribeBorrow((err, event) => {
          this.handleErrorEvent(err);
          console.log(`Borrow: ${JSON.stringify(event.returnValues)} Market: ${idx}`);
        });
        market.subscribePayBorrow((err, event) => {
          this.handleErrorEvent(err);
          console.log(`PayBorrow: ${JSON.stringify(event.returnValues)} Market: ${idx}`);
        });
        market.subscribeRedeem((err, event) => {
          this.handleErrorEvent(err);
          console.log(`Redeem: ${JSON.stringify(event.returnValues)} Market: ${idx}`);
        });
      });
    },
  },
  components: {
    BaseLayout,
  },
  created() {
    this.controller = new Controller();
    this.loadControllerAtSession();
    this.getMarkets();
    this.instantiateMarkets();
  },
};
</script>
