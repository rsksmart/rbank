<template>
  <div>
    <div class="d-flex justify-center">
      <h1>Balance</h1>
    </div>
    <v-container fluid>
      <v-row>
        <v-col v-for="market in markets" :key="market.address" cols="4">
          <market-balance-item :market="market"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MarketBalanceItem from '@/components/dashboard/MarketBalanceItem.vue';
import { mapState } from 'vuex';

export default {
  name: 'MarketsBalance',
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
  },
  components: {
    MarketBalanceItem,
  },
};
</script>
