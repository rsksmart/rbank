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
            <h3>current cash:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7">
                <h1>{{ cashAsDouble }}</h1>
              </v-col>
              <v-col cols="5"/>
            </v-row>
          </v-col>
          <v-col cols="1">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="2"/>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex justify-end">
            <h3>borrow balance:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7">
                <h1>{{ borrowed }}</h1>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <span v-if="borrowBalanceInfo">(+{{ borrowBalanceInfo }})</span>
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
                <span v-if="borrowLimitInfo">(-{{ borrowLimitInfo }})</span>
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
        <v-btn class="button" rounded color="#008CFF" @click="borrow">
          Borrow tokens
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
  name: 'BorrowInput',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      waiting: false,
      maxAmount: false,
      price: 0,
      amount: 0,
      borrowBy: 0,
      borrowRate: 0,
      liquidity: 0,
      cash: 0,
      maxAllowed: 0,
      borrowBalanceInfo: null,
      borrowLimitInfo: null,
      tokenBalance: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    cashAsDouble() {
      return this.asDouble(this.cash);
    },
    borrowed() {
      return this.asDouble(this.borrowBy);
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
    borrow() {
      this.waiting = true;
      this.$emit('wait');
      this.data.market.borrow(this.contractAmount, this.account)
        .then((res) => {
          this.waiting = false;
          this.$emit('succeed', {
            hash: res.transactionHash,
            supplied: this.asDouble(this.amount),
            borrowLimitInfo: this.borrowLimitInfo,
            borrowBalanceInfo: this.borrowBalanceInfo,
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
    async getValues() {
      let oldLiquidity;
      await this.data.market.updatedBorrowBy(this.account)
        .then((borrowBy) => {
          this.borrowBy = borrowBy + this.contractAmount;
          return this.$rbank.controller.getAccountLiquidity(this.account);
        })
        .then((accountLiquidity) => {
          oldLiquidity = accountLiquidity;
          this.liquidity = accountLiquidity - this.contractAmount;
          return this.data.market.eventualCash;
        })
        .then((oldCash) => {
          this.cash = oldCash - this.contractAmount;
          this.maxAllowed = this.getMaxAllowed(this.liquidity, this.cash);
          this.borrowBalanceInfo = this.asDouble(this.contractAmount);
          this.borrowLimitInfo = this.asDouble(this
            .getMaxAllowed(oldLiquidity, oldCash) - this.maxAllowed);
        });
    },
  },
  watch: {
    amount() {
      this.getValues();
      if (this.maxAmount && this.amount !== this.maxBorrowAllowed) this.maxAmount = false;
      if (this.amount === this.maxBorrowAllowed) this.maxAmount = true;
    },
    maxAmount() {
      if (this.maxAmount) this.amount = this.maxBorrowAllowed;
      if (!this.maxAmount && this.amount === this.maxBorrowAllowed) this.amount = null;
    },
  },
  components: {
    Loader,
  },
  created() {
    this.data.market.updatedBorrowBy(this.account)
      .then((borrowBy) => {
        this.borrowBy = borrowBy;
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
