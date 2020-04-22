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
      <v-card max-width="80%"  class="ma-5">
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

        <v-card-actions class="d-flex justify-space-around">
          <v-btn x-large raise color="green" dark class="my-2"
            @click="setSupplyForm()">
            Supply
          </v-btn>
          <v-btn x-large depressed color="blue" dark class="my-2">Borrow</v-btn>
          <v-btn x-large depressed color="teal" dark class="my-2">Redeem</v-btn>
          <v-btn x-large depressed color="indigo lighten-1" dark class="my-2">Pay debt</v-btn>
        </v-card-actions>
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
      tokenBalanceOf: null,
      supplyOf: null,
      borrowBy: null,
      baseBorrowRate: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
      from: (state) => ({ from: state.Session.account }),
      isOwner: (state) => state.Session.isOwner,
    }),
  },
  methods: {
    setSupplyForm() {
      this.$router.push({
        name: 'MarketSupply',
        params: { marketAddress: this.id },
      });
    },
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
    this.market.eventualBaseBorrowRate
      .then((baseBorrowRate) => {
        this.baseBorrowRate = baseBorrowRate;
      });
    this.market.getSupplyOf(this.account)
      .then((supplyOf) => {
        this.supplyOf = supplyOf;
      });
    this.market.getBorrowBy(this.account)
      .then((borrowBy) => {
        this.borrowBy = borrowBy;
      });
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        const token = new Token(tokenAddress);
        return [token.eventualName, token.eventualSymbol, token.balanceOf(this.account)];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol, tokenBalanceOf]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
        this.tokenBalanceOf = tokenBalanceOf;
      });
  },
};
</script>
