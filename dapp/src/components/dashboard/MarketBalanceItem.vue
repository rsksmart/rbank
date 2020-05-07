<template>
  <v-card class="ma-5" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          {{ tokenName }} ({{ tokenSymbol }})
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ updatedSupplyCash | formatPrice }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-avatar tile size="80">
        <v-img :src="btc"></v-img>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

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
      controller: null,
      market: null,
      tokenName: null,
      tokenSymbol: null,
      price: null,
      marketSupplyOf: null,
      marketCash: null,
      btc: 'https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png',
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    updatedSupplyCash() {
      return this.price * this.marketSupplyOf;
    },
  },
  created() {
    this.controller = new Controller();
    this.market = new Market(this.marketAddress);
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        const token = new Token(tokenAddress);
        return [token.eventualName, token.eventualSymbol];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
      });
    this.controller.getPrice(this.marketAddress)
      .then((price) => {
        this.price = Number(price);
      });
    this.market.getUpdatedSupplyOf(this.account)
      .then((supplyOf) => {
        this.marketSupplyOf = Number(supplyOf);
      });
  },
};
</script>
