<template>
  <div>
    <template v-if="!waiting">
      <v-row class="inputBox">
        <v-col cols="10">
          <v-text-field class="inputText" full-width single-line solo flat hide-details
                        type="number" v-model="amount"/>
        </v-col>
        <v-col cols="2">
          <v-btn @click="maxAmount = true" class="pa-0" text color="#008CFF">max</v-btn>
        </v-col>
      </v-row>
      <v-row class="ma-0 my-5 d-flex justify-center">
        <p>Would you like to <a href="https://coinmarketcap.com/">buy more tokens</a></p>
      </v-row>
      <div class="my-5 py-5">
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex justify-end">
            <h3>apr:</h3>
          </v-col>
          <v-col cols="4">
            <v-col cols="8">
              <h1>{{ apr }}%</h1>
            </v-col>
            <v-col cols="4"/>
          </v-col>
          <v-col cols="1"/>
          <v-col cols="2"/>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex justify-end">
            <h3>supply balance:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7">
                <h1>{{ supplied }}</h1>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <span v-if="supplyBalanceInfo">(+{{ supplyBalanceInfo }})</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="1">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="2"/>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex align-end justify-end">
            <h3>borrow limit:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7">
                <h1>{{ maxBorrowAllowed }}</h1>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <span v-if="borrowLimitInfo">(+{{ borrowLimitInfo }})</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="1">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="2"/>
        </v-row>
      </div>
      <v-row class="my-5 d-flex justify-center">
        <v-btn class="button" rounded color="#008CFF" @click="supply">
          Supply tokens
        </v-btn>
      </v-row>
    </template>
    <template v-else>
      <loader/>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Loader from '@/components/common/Loader.vue';

export default {
  name: 'SupplyInput',
  data() {
    return {
      waiting: false,
      maxAmount: false,
      price: 0,
      amount: 0,
      supplyOf: 0,
      borrowRate: 0,
      liquidity: 0,
      cash: 0,
      maxAllowed: 0,
      supplyBalanceInfo: null,
      borrowLimitInfo: null,
      tokenBalance: 0,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    apr() {
      return this.borrowRate.toFixed(2);
    },
    supplied() {
      return this.asDouble(this.supplyOf);
    },
    balanceAsDouble() {
      return this.asDouble(this.tokenBalance);
    },
    maxBorrowAllowed() {
      return this.asDouble(this.maxAllowed);
    },
    contractAmount() {
      return this.amount * (10 ** this.data.token.decimals);
    },
  },
  methods: {
    supply() {
      this.waiting = true;
      this.$emit('wait');
      this.data.market.supply(this.contractAmount, this.account)
        .then((res) => {
          this.waiting = false;
          this.$emit('succeed', {
            hash: res.transactionHash,
            supplied: this.asDouble(this.amount),
            borrowLimitInfo: this.borrowLimitInfo,
            supplyBalanceInfo: this.supplyBalanceInfo,
          });
        });
    },
    asDouble(value) {
      return (value / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
    getMaxAllowed(liquidity, cash) {
      const allowed = this.price > 0 ? Math.floor(liquidity / (this.price * 2)) : 0;
      return allowed >= cash ? cash : allowed;
    },
    getValues() {
      let oldLiquidity;
      this.data.market.updatedSupplyOf(this.account)
        .then((supplyOf) => {
          this.supplyOf = supplyOf + this.contractAmount;
          return this.$rbank.controller.getAccountLiquidity(this.account);
        })
        .then((accountLiquidity) => {
          oldLiquidity = accountLiquidity;
          this.liquidity = accountLiquidity + this.contractAmount;
          return this.data.market.eventualCash;
        })
        .then((oldCash) => {
          this.cash = oldCash + this.contractAmount;
          this.maxAllowed = this.getMaxAllowed(this.liquidity, this.cash);
          this.supplyBalanceInfo = this.asDouble(this.contractAmount);
          this.borrowLimitInfo = this.asDouble(this.maxAllowed - this
            .getMaxAllowed(oldLiquidity, oldCash));
        });
    },
  },
  watch: {
    amount() {
      if (this.maxAmount && this.amount !== this.balanceAsDouble) this.maxAmount = false;
      if (this.amount === this.balanceAsDouble) this.maxAmount = true;
      this.getValues();
    },
    maxAmount() {
      if (this.maxAmount) this.amount = this.balanceAsDouble;
      if (!this.maxAmount && this.amount === this.balanceAsDouble) this.amount = null;
    },
  },
  components: {
    Loader,
  },
  created() {
    this.data.market.updatedSupplyOf(this.account)
      .then((supplyOf) => {
        this.supplyOf = supplyOf;
        return this.$rbank.controller.getAccountLiquidity(this.account);
      })
      .then((accountLiquidity) => {
        this.liquidity = accountLiquidity;
        return this.data.market.eventualCash;
      })
      .then((cash) => {
        this.cash = cash;
        return this.data.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        return this.$rbank.controller.eventualMarketPrice(this.data.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.data.market.eventualToken;
      })
      .then((tok) => tok.eventualBalanceOf(this.account))
      .then((tokenBalance) => {
        this.tokenBalance = tokenBalance;
        this.maxAllowed = this.getMaxAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
