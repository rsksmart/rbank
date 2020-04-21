<template>
  <div>
    <h1>Market {{tokenSymbol}}</h1>
    <template v-if="isOwner">
      <price :marketAddress="id" :price="Number(price)"/>
    </template>
    <template v-else>
      <v-card my-5>
        <v-card-text>
          <v-row align="center">
            <v-col class="display-0">Asset</v-col>
          </v-row>
          <v-row align="center">
            <v-col class="display-4" cols="6">{{ tokenSymbol }}</v-col>
            <v-col cols="6">
              <v-img :src="btc" width="90"></v-img>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="display-0" cols="3">Supply</v-col>
            <v-col class="display-0" cols="3">Borrows</v-col>
            <v-col class="display-0" cols="3">Price</v-col>
            <v-col class="display-0" cols="3">APY</v-col>
          </v-row>
          <v-row align="center">
            <v-col class="display-1" cols="3">{{ totalSupply }}</v-col>
            <v-col class="display-1" cols="3">{{ totalBorrows }}</v-col>
            <v-col class="display-1" cols="3">{{ price }}</v-col>
            <v-col class="display-1" cols="3">0.05 %</v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card my-5>
        <v-card-text>
          <p class="display-1 text--primary">
            Balance
          </p>
          <v-row align="center">
            <v-col class="display-0" cols="4">Supply balance</v-col>
            <v-col class="display-0" cols="4">Borrow balance</v-col>
            <v-col class="display-0" cols="4">Collateral interest</v-col>
          </v-row>
          <v-row align="center">
            <v-col class="display-1" cols="4">{{ supplyOf }}</v-col>
            <v-col class="display-1" cols="4">{{ borrowOf }}</v-col>
            <v-col class="display-1" cols="4">{{ collateralRate }}</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';
import Token from '@/handlers/token';
import Price from '@/components/market/Price.vue';

export default {
  name: 'Market',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      controller: null,
      price: null,
      market: null,
      totalSupply: null,
      totalBorrows: null,
      tokenName: null,
      tokenSymbol: null,
      btc: 'https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png',
      supplyOf: null,
      borrowOf: null,
      collateralRate: null,
    };
  },
  computed: {
    ...mapState({
      from: (state) => ({ from: state.Session.account }),
      isOwner: (state) => state.Session.isOwner,
    }),
  },
  components: {
    Price,
  },
  created() {
    this.controller = new Controller();
    this.market = new Market(this.id);
    this.controller.getPrice(this.id)
      .then((price) => {
        this.price = price;
      });
    this.market.eventualTotalSupply
      .then((totalSupply) => {
        this.totalSupply = totalSupply;
      });
    this.market.eventualTotalBorrows
      .then((totalBorrows) => {
        this.totalBorrows = totalBorrows;
      });
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
  },
};
</script>
