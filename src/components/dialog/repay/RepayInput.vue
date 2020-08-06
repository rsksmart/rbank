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
      <div class="my-5 py-5">
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex justify-end">
            <h3>health factor:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1>{{ healthFactor }}%</h1>
              </v-col>
              <v-col cols="5"/>
            </v-row>
          </v-col>
          <v-col cols="1"/>
          <v-col cols="2"/>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex justify-end">
            <h3>borrow balance:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <h1>{{ borrowed }}</h1>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <span class="text-center" v-if="borrowBalanceInfo">(-{{ borrowBalanceInfo }})</span>
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
              <v-col cols="7" class="d-flex justify-center">
                <h1>{{ maxBorrowAllowedAsDouble }}</h1>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <span class="text-center" v-if="borrowLimitInfo">(+{{ borrowLimitInfo }})</span>
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
        <v-btn class="button" rounded color="#008CFF" @click="repay">
          Repay tokens
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
  name: 'RepayInput',
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
      maxRepayAllowed: 0,
      maxBorrowAllowed: 0,
      borrowBalanceInfo: null,
      borrowLimitInfo: null,
      tokenBalance: 0,
      accountHealth: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    healthFactor() {
      return this.accountHealth >= 1 ? 100 : (this.accountHealth * 100).toFixed(2);
    },
    borrowed() {
      return this.asDouble(this.borrowBy);
    },
    balanceAsDouble() {
      return this.asDouble(this.tokenBalance);
    },
    maxBorrowAllowedAsDouble() {
      return this.asDouble(this.maxBorrowAllowed);
    },
    contractAmount() {
      return this.amount * (10 ** this.data.token.decimals);
    },
  },
  methods: {
    repay() {
      this.waiting = true;
      this.$emit('wait');
      this.data.market.payBorrow(this.contractAmount, this.account)
        .then((res) => {
          this.waiting = false;
          this.$emit('succeed', {
            hash: res.transactionHash,
            borrowLimitInfo: this.borrowLimitInfo,
            borrowBalanceInfo: this.borrowBalanceInfo,
          });
        });
    },
    asDouble(value) {
      return (value / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
    getMaxRepayAllowed(borrowBy, tokenBalance) {
      const allowed = borrowBy > tokenBalance ? tokenBalance : borrowBy;
      return this.asDouble(allowed);
    },
    getMaxBorrowAllowed(liquidity, cash) {
      const allowed = this.price > 0 ? Math.floor(liquidity / (this.price * 2)) : 0;
      return allowed >= cash ? cash : allowed;
    },
    async getValues() {
      let oldLiquidity;
      let oldBorrowBy;
      await this.data.market.updatedBorrowBy(this.account)
        .then((borrowBy) => {
          oldBorrowBy = borrowBy;
          this.borrowBy = borrowBy - this.contractAmount;
          return this.$rbank.controller.getAccountLiquidity(this.account);
        })
        .then((accountLiquidity) => {
          oldLiquidity = accountLiquidity;
          this.liquidity = accountLiquidity + this.contractAmount;
          return this.data.market.eventualCash;
        })
        .then((oldCash) => {
          this.cash = oldCash + this.contractAmount;
          this.maxRepayAllowed = this.getMaxRepayAllowed(oldBorrowBy, this.tokenBalance);
          this.maxBorrowAllowed = this.getMaxBorrowAllowed(this.liquidity, this.cash);
          this.borrowBalanceInfo = this.asDouble(this.contractAmount);
          this.borrowLimitInfo = this.asDouble(this.maxBorrowAllowed - this
            .getMaxBorrowAllowed(oldLiquidity, oldCash));
        });
    },
  },
  watch: {
    amount() {
      this.getValues();
      if (this.maxAmount && this.amount !== this.maxRepayAllowed) this.maxAmount = false;
      if (this.amount === this.maxRepayAllowed) this.maxAmount = true;
    },
    maxAmount() {
      if (this.maxAmount) this.amount = this.maxRepayAllowed;
      if (!this.maxAmount && this.amount === this.maxRepayAllowed) this.amount = null;
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
        return this.$rbank.controller.getAccountHealth(this.account);
      })
      .then((accountHealth) => {
        this.accountHealth = accountHealth;
        this.maxRepayAllowed = this.getMaxRepayAllowed(this.borrowBy, this.tokenBalance);
        this.maxBorrowAllowed = this.getMaxBorrowAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
