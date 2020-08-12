<template>
  <div>
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">
          You have successfully withdrawn <br>
          <span class="greenish">
            {{ data.supplyBalanceInfo }} {{ data.token.symbol }}
          </span>
           from this Market
        </div>
      </v-row>
    </div>
    <div class="my-5 py-5">
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3 class="greenish">earnings:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="greenish text-center">{{ earnings }}</h1>
        </v-col>
        <v-col cols="2">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>supply balance:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ supplied }}</h1>
        </v-col>
        <v-col cols="2">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex align-end justify-end">
          <h3>borrow limit:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ maxBorrowAllowedAsDouble }}</h1>
        </v-col>
        <v-col cols="2">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
    </div>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="2"/>
      <v-col class="itemInfo">
        transaction hash: {{ hashCutOff }}
      </v-col>
      <v-col class="ml-1">
        <v-icon small>content_copy</v-icon>
        <a class="listTitle" target="_blank" :href="rskExplorerUrl">View on RSKExplorer</a>
      </v-col>
      <v-col cols="1"/>
    </v-row>
    <v-row class="my-5 d-flex justify-center">
      <v-btn class="button" rounded color="#008CFF" @click="closeDialog">
        Back to Supply / Borrow
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SupplySuccess',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      earnings: 0,
      liquidity: 0,
      cash: 0,
      price: 0,
      maxBorrowAllowed: 0,
      supplyOf: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    hashCutOff() {
      return `${this.data.hash.substring(0, 4)}...${this.data.hash
        .substring(this.data.hash.length - 4, this.data.hash.length)}`;
    },
    rskExplorerUrl() {
      return `https://explorer.rsk.co/tx/${this.data.hash}`;
    },
    maxBorrowAllowedAsDouble() {
      return (this.maxBorrowAllowed / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
    supplied() {
      return (this.supplyOf / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    getMaxAllowed(liquidity, cash) {
      const allowed = this.price > 0 ? Math.floor(liquidity / (this.price * 2)) : 0;
      return allowed >= cash ? cash : allowed;
    },
  },
  created() {
    this.$rbank.controller.getAccountLiquidity(this.account)
      .then((accountLiquidity) => {
        this.liquidity = accountLiquidity;
        return this.data.market.eventualCash;
      })
      .then((cash) => {
        this.cash = cash;
        return this.$rbank.controller.eventualMarketPrice(this.data.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.data.market.updatedSupplyOf(this.account);
      })
      .then((supplyOf) => {
        this.supplyOf = supplyOf;
        this.maxBorrowAllowed = this.getMaxAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
