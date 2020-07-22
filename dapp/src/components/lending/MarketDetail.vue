<template>
  <v-card class="mx-5" outlined>
    <v-list-item three-line>
      <v-list-item-avatar tile size="80">
        <v-img :src="rif"/>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right">
          {{ token.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="headline mb-1 text-right">
          {{ tokenPrice | formatPrice}}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="mx-5"></v-divider>
    <v-list class="transparent">
      <v-list-item>
        <v-list-item-title>
          {{ token.symbol }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-right">
          {{ marketSupplyOf }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider class="mx-5"></v-divider>
    <h3 class="text-center ma-2">Annual Rates</h3>
    <div class="d-flex justify-space-around">
      <v-card width="45%" class="ma-2">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4 text-center">Supplier</div>
            <v-list-item-title class="headline text-center">
              2 %
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card width="45%" class="ma-2">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4 text-center">Taker</div>
            <v-list-item-title class="headline text-center">
              1.5 %
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import rifImage from '@/assets/rif.png';

export default {
  name: 'MarketDetail',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      marketSupplyOf: null,
      token: {
        name: null,
        symbol: null,
        decimals: 0,
      },
      price: 0,
      rif: rifImage,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    tokenPrice() {
      return this.price * (this.marketSupplyOf / (10 ** this.token.decimals));
    },
  },
  created() {
    this.market.token
      .then((tok) => [
        tok.eventualName,
        tok.eventualSymbol,
        tok.eventualDecimals,
      ])
      .then((results) => Promise.all(results))
      .then(([name, symbol, decimals]) => {
        this.token.name = name;
        this.token.symbol = symbol;
        this.token.decimals = decimals;
        return this.market.updatedSupplyOf(this.account);
      })
      .then((supplyOf) => {
        this.marketSupplyOf = supplyOf / (10 ** this.token.decimals);
        return this.$rbank.controller.eventualMarketPrice(this.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
      });
  },
};
</script>
