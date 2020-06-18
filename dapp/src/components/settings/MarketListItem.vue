<template>
  <v-list-item @click="setMarket(market.address)">
    <v-list-item-title class="text-left">
      <v-list-item-action>
        <v-icon>local_convenience_store</v-icon>
      </v-list-item-action>
      {{ token.symbol }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ token.name }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ borrows }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ supplies }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ market.price }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ market.cash | formatPrice }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ apr }} %
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MarketListItem',
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      market: new this.$rbank.Market(this.marketAddress),
      token: {
        name: '',
        symbol: '',
        decimals: 0,
      },
    };
  },
  computed: {
    ...mapState({
      factor: (state) => state.Controller.factor,
    }),
    apr() {
      return ((this.market.borrowRate * 100) / this.factor).toFixed(2);
    },
    borrows() {
      return (this.market.borrowed / (10 ** this.market.token.decimals))
        .toFixed(this.market.token.decimals);
    },
    supplies() {
      return (this.market.supplied / (10 ** this.market.token.decimals))
        .toFixed(this.market.token.decimals);
    },
  },
  created() {
    this.market.token
      .then((tok) => [tok.eventualName, tok.eventualSymbol, tok.eventualDecimals])
      .then((results) => Promise.all(results))
      .then(([name, symbol, decimals]) => {
        this.token.name = name;
        this.token.symbol = symbol;
        this.token.decimals = decimals;
      });
  },
  methods: {
    setMarket(marketAddress) {
      this.$router.push({
        name: 'Market',
        params: { id: marketAddress },
      });
    },
  },
};
</script>
