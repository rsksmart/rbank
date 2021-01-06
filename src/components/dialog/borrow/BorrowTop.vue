<template>
  <v-row class="ma-0 d-flex align-center">
    <v-col cols="1" class="d-flex justify-center">
      <v-img class="ml-5" src="../../../assets/rif.png" height="50" contain/>
    </v-col>
    <v-col cols="3">
      <v-row class="item">
        <h1 class="ma-0">{{ data.token.symbol }}</h1>
      </v-row>
      <v-row class="d-flex justify-center">
        <a class="ml-2 listTitle" target="_blank" :href="rskExplorerUrl">
          {{ data.token.symbol }} Addr
        </a>
      </v-row>
    </v-col>
    <v-col cols="3">
      <v-row>
        <h2>price:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        <span>{{ price | formatPrice }}</span><span class="ml-2 itemInfo">usd</span>
      </v-row>
    </v-col>
    <v-col cols="3">
      <v-row>
        <h2>in your wallet:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        <template v-if="$options.filters
          .formatToken(tokenBalance, data.token.decimals).toString().length > 6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ tokenBalance | formatToken(data.token.decimals) }}
              </span>
            </template>
            <span>{{ tokenBalance | fullToken(data.token.decimals) }}</span>
          </v-tooltip>
        </template>
        <template v-else>
          <span>
            {{ tokenBalance | formatToken(data.token.decimals) }}
          </span>
        </template>
        <span class="ml-2 itemInfo">usd</span>
      </v-row>
    </v-col>
    <v-col cols="2">
      <v-row>
        <h2>apr:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        {{ apr }}%
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'BorrowTop',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      price: 0,
      tokenBalance: 0,
      borrowRate: 0,
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
    rskExplorerUrl() {
      return `https://explorer.testnet.rsk.co/address/${this.tokenAddress}`;
    },
  },
  created() {
    this.$rbank.controller.eventualMarketPrice(this.data.market.address)
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.data.market.eventualToken;
      })
      .then((tok) => Promise.all([tok.eventualBalanceOf(this.account), tok.address]))
      .then(([tokenBalance, tokenAddress]) => {
        this.tokenAddress = tokenAddress;
        this.tokenBalance = tokenBalance;
        return this.data.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
      });
  },
};
</script>
