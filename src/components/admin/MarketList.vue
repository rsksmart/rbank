<template>
  <div>
    <v-list>
      <v-list-item>
        <v-row>
          <v-col cols="2">
            <v-list-item-subtitle class="listTitle">Market</v-list-item-subtitle>
          </v-col>
          <v-col cols="2">
            <v-list-item-subtitle class="listTitle">Price</v-list-item-subtitle>
          </v-col>
          <v-col cols="2">
            <v-list-item-subtitle class="listTitle">APR</v-list-item-subtitle>
          </v-col>
          <v-col cols="2">
            <v-list-item-subtitle class="listTitle">Total Supplied</v-list-item-subtitle>
          </v-col>
          <v-col cols="2">
            <v-list-item-subtitle class="listTitle">Total Borrowed</v-list-item-subtitle>
          </v-col>
          <v-col cols="2">
            <v-list-item-subtitle class="listTitle">Current Cash</v-list-item-subtitle>
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider/>
      <market-item v-for="(market, idx) in markets"
                   :key="`market-${idx}`" :market="market"/>
    </v-list>
  </div>
</template>

<script>
import MarketItem from '@/components/admin/MarketItem.vue';

export default {
  name: 'MarketList',
  data() {
    return {
      markets: [],
    };
  },
  components: {
    MarketItem,
  },
  created() {
    this.$rbank.eventualMarkets
      .then((mkts) => {
        this.markets = mkts;
      });
  },
};
</script>
