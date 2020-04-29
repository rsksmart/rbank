<template>
  <div class="dashboard">
    <markets-list :marketAddresses="marketAddresses"/>
    <v-divider class="ma-5"></v-divider>
    <markets-balance :marketAddresses="marketAddresses"/>
  </div>
</template>

<script>
import Controller from '@/handlers/controller';
import MarketsList from '@/components/settings/MarketsList.vue';
import MarketsBalance from '@/components/dashboard/MarketsBalance.vue';

export default {
  name: 'Dashboard',
  data() {
    return {
      controller: null,
      marketAddresses: [],
    };
  },
  methods: {
    loadMarkets() {
      this.controller.eventualMarketAddresses
        .then((marketAddresses) => {
          this.marketAddresses = marketAddresses;
        });
    },
  },
  components: {
    MarketsList,
    MarketsBalance,
  },
  created() {
    this.controller = new Controller();
    this.loadMarkets();
  },
};
</script>
