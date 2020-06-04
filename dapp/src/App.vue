<template>
  <component :is="currentComponent">
    <router-view/>
  </component>
</template>

<script>
import BaseLayout from '@/components/layouts/base/Index.vue';
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';
import { web3WS } from '@/handlers';
import Controller from '@/handlers/controller';
import MarketContract from '@/contracts/Market.json';

export default {
  name: 'App',
  data() {
    return {
      layout: 'Base',
      layouts: [
        'Base',
      ],
      controller: null,
      blockSubscription: null,
      supplySubscription: null,
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
    instantiateMarkets() {
      this.controller.eventualMarketAddresses
        .then((marketAddresses) => {
          // eslint-disable-next-line max-len
          this.marketInstances = marketAddresses.map((marketAddr) => new web3WS.eth.Contract(MarketContract.abi, marketAddr));
          this.createSubscription();
        });
    },
    createSubscription() {
      this.blockSubscription = web3WS.eth.subscribe(
        'newBlockHeaders',
        // eslint-disable-next-line no-unused-vars
        (error, block) => {
          if (!error) {
            // console.log(`New Block: number ${block.number} - Hash ${block.hash}`);
            return;
          }
          console.error(error);
        },
      );
      this.marketInstances.forEach((market, idx) => {
        market.events.Supply({
          fromBlock: 0,
        }, (error, event) => {
          if (error) {
            console.error(error);
          }
          console.log(`Supply: ${JSON.stringify(event.returnValues)} Market ${idx}`);
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
