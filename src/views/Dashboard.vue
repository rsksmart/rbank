<template>
  <div class="dashboard">
    <markets-list :marketAddresses="marketAddresses"/>
    <v-divider class="ma-5"/>
    <markets-balance :marketAddresses="marketAddresses"/>
  </div>
</template>

<script>
import MarketsList from '@/components/settings/MarketsList.vue';
import MarketsBalance from '@/components/dashboard/MarketsBalance.vue';

export default {
  name: 'Dashboard',
  data() {
    return {
      marketAddresses: [],
    };
  },
  methods: {
    loadMarkets() {
      this.$rbank.eventualMarkets
        .then((markets) => {
          this.marketAddresses = markets.map((market) => market.address);
        });
    },
  },
  components: {
    MarketsList,
    MarketsBalance,
  },
  created() {
    this.loadMarkets();
  },
};
</script>
