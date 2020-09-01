<template>
  <v-dialog v-model="data.flag" width="800">
    <v-card class="dialog container">
      <div class="container">
        <v-row class="ma-0 d-flex align-center">
          <v-col cols="1" class="d-flex justify-center">
            <v-img class="ml-5" src="../../../assets/rif.png"/>
          </v-col>
          <v-col cols="2">
            <v-row class="ml-5 item d-flex justify-start">
              <h1 class="ma-0">{{ data.token.symbol }}</h1>
            </v-row>
            <v-row class="ml-5 d-flex justify-start">
              <a class="listTitle" target="_blank" :href="rskExplorerUrl">
                {{ data.token.symbol }} Addr
              </a>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row>
              <h2>price:</h2>
            </v-row>
            <v-row class="item d-flex justify-start">
              <span>{{ price | formatPrice }}</span><span class="ml-2 itemInfo">usd</span>
            </v-row>
          </v-col>
          <v-col cols="2">
            <v-row>
              <h2>APR:</h2>
            </v-row>
            <v-row class="item d-flex justify-start">
              {{ apr }} %
            </v-row>
          </v-col>
          <v-col/>
          <v-col cols="2" class="mr-1">
            <v-row class="ma-0 pr-1 d-flex justify-end">
              <h2 class="grayish">original APR:</h2>
            </v-row>
            <v-row class="grayish item d-flex justify-end mr-1">
              {{ baseApr }} %
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div class="container">
        <v-row class="ma-2 d-flex align-center justify-space-between">
          <v-col cols="2">
            <h3>total supplied:</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ updatedTotalSupply }}</span>
          </v-col>
          <v-col cols="1">
            <span class="ml-2 itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="2"/>
          <v-col cols="2" class="d-flex justify-end">
            <h3>current cash:</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ cash }}</span>
          </v-col>
          <v-col cols="1" class="d-flex justify-end">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
        </v-row>
        <v-row class="ma-2 d-flex align-center">
          <v-col cols="2">
            <h3>total borrow:</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ updatedTotalBorrow }}</span>
          </v-col>
          <v-col cols="1">
            <span class="ml-2 itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="2"/>
          <v-col cols="2" class="d-flex justify-end">
            <h3>apr growth:</h3>
          </v-col>
          <v-col cols="2" class="item">
            <span>{{ growth }} %</span>
          </v-col>
          <v-col cols="1"/>
        </v-row>
      </div>
      <transactions-graph/>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import TransactionsGraph from '@/components/admin/TransactionsGraph.vue';

export default {
  name: 'MarketDialog',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      succeed: false,
      waiting: false,
      borrowRate: 0,
      baseBorrowRate: 0,
      price: 0,
      updatedTotalSupply: 0,
      updatedTotalBorrow: 0,
      cash: 0,
      growth: 0,
      tokenAddress: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    apr() {
      return this.borrowRate.toFixed(2);
    },
    baseApr() {
      return this.baseBorrowRate.toFixed(2);
    },
    rskExplorerUrl() {
      return `https://explorer.testnet.rsk.co/address/${this.tokenAddress}`;
    },
  },
  methods: {
    asDouble(value) {
      return (value / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
  },
  components: {
    TransactionsGraph,
  },
  created() {
    this.data.market.eventualToken
      .then((tok) => {
        this.tokenAddress = tok.address;
        return this.$rbank.controller.eventualMarketPrice(this.data.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.data.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        return this.data.market.eventualBaseBorrowRate;
      })
      .then((baseBorrowRate) => {
        this.baseBorrowRate = baseBorrowRate;
        return this.data.market.eventualUpdatedTotalSupply;
      })
      .then((updatedTotalSupply) => {
        this.updatedTotalSupply = this.asDouble(updatedTotalSupply);
        return this.data.market.eventualUpdatedTotalBorrows;
      })
      .then((updatedTotalBorrows) => {
        this.updatedTotalBorrow = this.asDouble(updatedTotalBorrows);
        return this.data.market.eventualCash;
      })
      .then((cash) => {
        this.cash = this.asDouble(cash);
        this.growth = (this.borrowRate - this.baseBorrowRate).toFixed(2);
      });
  },
};
</script>
