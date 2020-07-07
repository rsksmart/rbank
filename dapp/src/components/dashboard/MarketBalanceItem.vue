<template>
  <v-card class="ma-5" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          {{ token.name }} ({{ token.symbol }})
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ marketSupplyOf }}
        </v-list-item-subtitle>
        <v-list-item-title>
          $ {{ updatedSupplyCash }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-avatar tile size="80">
        <v-img :src="rif"/>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import rifImage from '@/assets/rif.png';

export default {
  name: 'MarketBalanceItem',
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
        name: null,
        decimals: 0,
        symbol: null,
      },
      price: 0,
      supplyOf: null,
      rif: rifImage,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    updatedSupplyCash() {
      return ((this.price * this.supplyOf) / 10 ** this.token.decimals)
        .toFixed(this.token.decimals);
    },
    marketSupplyOf() {
      return (this.supplyOf / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
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
    this.$rbank.controller.eventualMarketPrice(this.marketAddress)
      .then((marketPrice) => {
        this.price = marketPrice;
      });
    this.market.updatedSupplyOf(this.account)
      .then((supplyOf) => {
        this.supplyOf = supplyOf;
      });
  },
};
</script>
