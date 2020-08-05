<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col v-for="market in markets" :key="market.address" cols="4">
          <market-detail :market="market"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MarketDetail from '@/components/lending/MarketDetail.vue';

export default {
  name: 'MarketDetailList',
  data() {
    return {
      markets: [],
    };
  },
  components: {
    MarketDetail,
  },
  created() {
    this.$rbank.eventualMarkets
      .then((mkts) => {
        this.markets = mkts;
      });
  },
};
</script>
