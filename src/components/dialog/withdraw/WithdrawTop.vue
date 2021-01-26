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
        <h2>apr:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        {{ apr }}%
      </v-row>
    </v-col>
    <v-col cols="2">
      <v-row>
        <h2>earnings:</h2>
      </v-row>
      <v-row class="item greenish d-flex justify-start">
        <template v-if="$options.filters
          .formatToken(earnings, data.token.decimals).toString().length > 6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ earnings | formatToken(tokenDecimals) }}
              </span>
            </template>
            <span>{{ earnings | fullToken(tokenDecimals) }}</span>
          </v-tooltip>
        </template>
        <template v-else>
          <span>
            {{ earnings | formatToken(tokenDecimals) }}
          </span>
        </template>
        <span class="ml-2 itemInfo">{{ data.token.symbol }}</span>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'WithdrawTop',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      earnings: 0,
      price: 0,
      borrowRate: 0,
      tokenAddress: 0,
      tokenDecimals: 0,
    };
  },
  computed: {
    apr() {
      return this.borrowRate.toFixed(2);
    },
    rskExplorerUrl() {
      return `https://explorer.testnet.rsk.co/address/${this.tokenAddress}`;
    },
  },
  created() {
    this.data.market.eventualToken
      .then((tok) => {
        this.tokenAddress = tok.address;
        return tok.eventualDecimals;
      })
      .then((tokDecimals) => {
        this.tokenDecimals = tokDecimals;
        return this.data.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        return this.$rbank.controller.eventualMarketPrice(this.data.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.data.market.eventualAccountEarnings(this.account);
      })
      .then((accountEarnings) => {
        this.earnings = accountEarnings;
      });
  },
};
</script>
