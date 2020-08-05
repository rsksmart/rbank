<template>
  <div class="Liquidated">
    <liquidated-list v-for="(market, idx) in marketAddresses"
                     :key="`market-item-${market}-${idx}`" :marketAddress="market"/>
  </div>
</template>

<script>
import _ from 'lodash';
import LiquidatedList from '@/components/liquidate/LiquidatedList.vue';

export default {
  name: 'Liquidated',
  data() {
    return {
      marketAddresses: [],
    };
  },
  components: {
    LiquidatedList,
  },
  methods: {
    loadMarkets() {
      this.$rbank.controller.eventualMarketListSize
        .then((marketListSize) => _.range(marketListSize))
        .then((marketIndices) => marketIndices
          .map((idx) => this.$rbank.controller.getEventualMarketAddress(idx)))
        .then((marketAddressesPromises) => Promise.all(marketAddressesPromises))
        .then((marketAddresses) => {
          this.marketAddresses = marketAddresses;
        });
    },
  },
  created() {
    this.loadMarkets();
  },
};
</script>
