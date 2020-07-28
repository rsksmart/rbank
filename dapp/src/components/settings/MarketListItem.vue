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
      {{ price | formatPrice }}
    </v-list-item-title>
    <v-list-item-title class="text-center">
      {{ marketCash }}
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
      price: 0,
      cash: 0,
      borrowRate: 0,
      totalSupply: 0,
      totalBorrows: 0,
    };
  },
  computed: {
    ...mapState({
      factor: (state) => state.Controller.factor,
    }),
    apr() {
      return this.borrowRate.toFixed(3);
    },
    borrows() {
      return (this.totalBorrows / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
    },
    supplies() {
      return (this.totalSupply / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
    },
    marketCash() {
      return (this.cash / (10 ** this.token.decimals))
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
        return this.$rbank.controller.eventualMarketPrice(this.marketAddress);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.market.eventualCash;
      })
      .then((cash) => {
        this.cash = cash;
        return this.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        return this.market.eventualUpdatedTotalSupply;
      })
      .then((updatedTotalSupply) => {
        this.totalSupply = updatedTotalSupply;
        return this.market.eventualUpdatedTotalBorrows;
      })
      .then((updatedTotalBorrows) => {
        this.totalBorrows = updatedTotalBorrows;
      });
    const self = this;
    this.market.events.supply()
      .on('data', () => {
        self.market.eventualUpdatedTotalSupply
          .then((updatedTotalSupply) => {
            self.totalSupply = updatedTotalSupply;
          });
      });
    this.market.events.borrow()
      .on('data', () => {
        self.market.eventualUpdatedTotalBorrows
          .then((UpdatedTotalBorrows) => {
            self.totalBorrows = UpdatedTotalBorrows;
          });
      });
    this.market.events.redeem()
      .on('data', () => {
        self.market.eventualUpdatedTotalSupply
          .then((updatedTotalSupply) => {
            self.totalSupply = updatedTotalSupply;
          });
      });
    this.market.events.payBorrow()
      .on('data', () => {
        self.market.eventualUpdatedTotalBorrows
          .then((UpdatedTotalBorrows) => {
            self.totalBorrows = UpdatedTotalBorrows;
          });
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
