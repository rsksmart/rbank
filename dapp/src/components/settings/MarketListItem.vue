<template>
  <v-list-item @click="setMarket(marketAddress)">
    <v-list-item-title class="text-left">
      <v-list-item-action>
        <v-icon>local_convenience_store</v-icon>
      </v-list-item-action>
      {{ tokenSymbol }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ tokenName }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ marketTotalBorrows }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ marketTotalSupply }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ price }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ cash }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ apr.toFixed(2) }} %
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

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
      controller: null,
      market: null,
      marketTotalSupply: null,
      marketTotalBorrows: null,
      tokenName: null,
      tokenSymbol: null,
      price: null,
      cash: null,
      baseBorrowRate: null,
      apr: 0,
    };
  },
  methods: {
    setMarket(marketAddress) {
      this.$router.push({
        name: 'Market',
        params: { id: marketAddress },
      });
    },
  },
  watch: {
    baseBorrowRate() {
      this.apr = (this.baseBorrowRate * 100) / this.controller.FACTOR;
    },
  },
  created() {
    this.controller = new Controller();
    this.market = new Market(this.marketAddress);
    this.market.eventualTotalSupply
      .then((totalSupply) => {
        this.marketTotalSupply = totalSupply;
      });
    this.market.eventualTotalBorrows
      .then((totalBorrows) => {
        this.marketTotalBorrows = totalBorrows;
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
    this.market.eventualCash
      .then((cash) => {
        this.cash = cash;
      });
    this.market.eventualBaseBorrowRate
      .then((rate) => {
        this.baseBorrowRate = rate;
      });
    this.controller.getPrice(this.marketAddress)
      .then((price) => {
        this.price = price;
      });
  },
};
</script>
