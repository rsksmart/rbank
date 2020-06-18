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
import { mapState } from 'vuex';

export default {
  name: 'MarketDetailList',
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
  },
  components: {
    MarketDetail,
  },
};
</script>
