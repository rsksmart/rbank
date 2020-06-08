<template>
  <div>
    <h1>Market {{tokenSymbol}}</h1>
    <template v-if="isOwner">
      <price :marketAddress="id" :price="Number(price)"/>
    </template>
    <template v-else>
      <v-card max-width="80%" class="ma-5" dark>
        <v-card-text>
          <v-row align="center">
            <v-col class="display-0">Asset</v-col>
          </v-row>
          <v-row align="center">
            <v-col class="display-2" cols="6">{{ tokenSymbol }}</v-col>
            <v-col cols="6">
              <v-img :src="btc" width="70"></v-img>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="display-0" cols="3">Total supply</v-col>
            <v-col class="display-0" cols="3">Total borrows</v-col>
            <v-col class="display-0" cols="3">Price</v-col>
            <v-col class="display-0" cols="3">Base borrow rate</v-col>
          </v-row>
          <v-row align="center">
            <v-col class="display-1" cols="3">{{ totalSupply }}</v-col>
            <v-col class="display-1" cols="3">{{ totalBorrows }}</v-col>
            <v-col class="display-1" cols="3">{{ price }}</v-col>
            <v-col class="display-1" cols="3">{{ baseBorrowRate }}%</v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card max-width="80%" class="ma-5">
        <v-card-text>
          <p class="display-1 text--primary">
            Balance
          </p>
          <v-row align="center">
            <v-col class="display-0 text-center" cols="4">{{ tokenSymbol }} balance</v-col>
            <v-col class="display-0 text-center" cols="4">Supplied</v-col>
            <v-col class="display-0 text-center" cols="4">Borrowed</v-col>
          </v-row>
          <v-row align="center">
            <v-col class="display-1 text-center" cols="4">{{ tokenBalanceOf }}</v-col>
            <v-col class="display-1 text-center" cols="4">{{ supplyOf }}</v-col>
            <v-col class="display-1 text-center" cols="4">{{ borrowBy }}</v-col>
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
      token: null,
      totalSupply: null,
      totalBorrows: null,
      tokenName: null,
      tokenSymbol: null,
      btc: 'https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png',
      tokenBalanceOf: null,
      supplyOf: null,
      borrowBy: null,
      baseBorrowRate: null,
      actionForm: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
      isOwner: (state) => state.Session.isOwner,
      markets: (state) => state.Controller.markets,
    }),
    pageHeight() {
      return document.body.scrollHeight;
    },
  },
  methods: {
    reset() {
      this.actionForm = null;
      this.loadMarketTotalSupply();
      this.loadMarketTotalBorrows();
      this.loadMarketSupplyOf();
      this.loadMarketBorrowBy();
      this.loadTokenBalanceOf();
    },
    loadTokenBalanceOf() {
      this.token.balanceOf(this.account)
        .then((balanceOf) => {
          this.tokenBalanceOf = balanceOf;
        });
    },
    loadMarketTotalSupply() {
      this.market.eventualTotalSupply
        .then((totalSupply) => {
          this.totalSupply = totalSupply;
        });
    },
    loadMarketTotalBorrows() {
      this.market.eventualTotalBorrows
        .then((totalBorrows) => {
          this.totalBorrows = totalBorrows;
        });
    },
    loadMarketSupplyOf() {
      this.market.getUpdatedSupplyOf(this.account)
        .then((supplyOf) => {
          this.supplyOf = supplyOf;
        });
    },
    loadMarketBorrowBy() {
      this.market.getUpdatedBorrowBy(this.account)
        .then((borrowBy) => {
          this.borrowBy = borrowBy;
        });
    },
    loadMarketBaseBorrowRate() {
      this.market.eventualBaseBorrowRate
        .then((baseBorrowRate) => {
          this.baseBorrowRate = ((baseBorrowRate * 100) / this.controller.FACTOR).toFixed(2);
        });
    },
  },
  components: {
    Price,
  },
  created() {
    this.controller = new Controller();
    this.market = new Market(this.id);
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        this.token = new Token(tokenAddress);
        return [
          this.token.eventualName,
          this.token.eventualSymbol,
        ];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
        this.loadTokenBalanceOf();
      });
    this.controller.getPrice(this.id)
      .then((price) => {
        this.price = price;
      });
    this.loadMarketTotalSupply();
    this.loadMarketTotalBorrows();
    this.loadMarketSupplyOf();
    this.loadMarketBorrowBy();
    this.loadMarketBaseBorrowRate();
  },
};
</script>
