<template>
  <div class="container">
    <h2 class="mb-2">Summary</h2>
    <v-divider color="#008CFF"/>
    <v-card flat width="50%" class="container pa-0">
      <v-row class="ma-0 pt-5 d-flex align-center">
        <v-col>
          <h3 class="text-right mr-2">Market name:</h3>
        </v-col>
        <v-col cols="6" class="d-flex align-center">
          {{ tokenSymbol }}
        </v-col>
      </v-row>
      <v-row class="ma-0 pt-3 d-flex align-center">
        <v-col>
          <h3 class="text-right mr-2">Market address:</h3>
        </v-col>
        <v-col cols="6" class="d-flex align-center">
          <a class="mr-3 blueish" target="_blank" :href="rskExplorerUrl">{{ addressCutOff }}</a>
          <v-icon @click="copyHash" small>
            content_copy
          </v-icon>
        </v-col>
      </v-row>
      <v-row class="ma-0 pt-3 d-flex align-center">
        <v-col cols="6">
          <h3 class="text-right mr-2">Market price:</h3>
        </v-col>
        <v-col cols="6" class="d-flex align-center">
          {{ price | formatPrice }} USD
        </v-col>
      </v-row>
      <v-row class="ma-0 py-3 d-flex align-center">
        <v-col>
          <h3 class="text-right mr-2">Base borrow APR:</h3>
        </v-col>
        <v-col cols="6" class="d-flex align-center">
          {{ apr }} %
        </v-col>
      </v-row>
    </v-card>
    <v-row class="my-5 d-flex justify-center">
      <v-btn class="button" rounded color="#008CFF" @click="closeDialog">
        Back to dashboard
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'MarketCreateSuccess',
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tokenSymbol: null,
      price: 0,
      borrowRate: 0,
    };
  },
  computed: {
    apr() {
      return this.borrowRate.toFixed(2);
    },
    addressCutOff() {
      return `${this.marketAddress.substring(0, 4)}...${this.marketAddress
        .substring(this.marketAddress.length - 4, this.marketAddress.length)}`;
    },
    rskExplorerUrl() {
      return `https://explorer.testnet.rsk.co/address/${this.marketAddress}`;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    copyHash() {
      navigator.clipboard.writeText(this.marketAddress);
    },
  },
  created() {
    const market = new this.$rbank.Market(this.marketAddress);
    market.eventualToken
      .then((token) => token.eventualSymbol)
      .then((tokenSymbol) => {
        this.tokenSymbol = tokenSymbol;
        return market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        return this.$rbank.controller.eventualMarketPrice(this.marketAddress);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
      });
  },
};
</script>
