<template>
  <div>
    <template v-if="!waiting">
      <v-row class="inputBox">
        <v-col cols="10">
          <v-text-field class="inputText" full-width single-line solo flat
                        type="number" v-model="amount" required
                        :rules="[rules.required, rules.decimals, rules.debtExists,
                        rules.notBiggerThanDebt, rules.hasEnoughTokens]"/>
        </v-col>
        <v-col cols="2">
          <v-btn @click="maxAmount = true" class="mb-12" text color="#008CFF">max</v-btn>
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
                <h1>{{ borrowBy | formatToken(data.token.decimals) }}</h1>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <span class="text-center" v-if="borrowBalanceInfo">
                  (-{{ borrowBalanceInfo | formatToken(data.token.decimals) }})
                </span>
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
                <h1>{{ maxBorrowAllowed | formatToken(data.token.decimals) }}</h1>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <span class="text-center" v-if="borrowLimitInfo">
                  (+{{ borrowLimitInfo | formatToken(data.token.decimals) }})
                </span>
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
        <v-btn class="button" rounded color="#008CFF" @click="repay" :disabled="!validForm">
          Repay tokens
        </v-btn>
      </v-row>
    </template>
    <template v-else>
      <loader class="my-15"/>
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
      amount: '0',
      oldBorrowBy: 0,
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
      collateralFactor: 0,
      mantissa: 0,
      rules: {
        required: () => !!Number(this.amount) || 'Required.',
        decimals: () => this.decimalPositions || `Maximum ${this
          .data.token.decimals} decimal places for ${this.data.token.symbol}.`,
        debtExists: () => (this.oldBorrowBy > 0 && !!this.contractAmount)
          || 'You do not have a debt on this market.',
        hasEnoughTokens: () => this.tokenBalance >= this.contractAmount
          || `You do not have enough ${this.data.token.symbol}`,
        notBiggerThanDebt: () => this.oldBorrowBy >= this.contractAmount
          || 'You do not owe that much.',
      },
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
      return Number(this.amount).toFixed(this.data.token.decimals).replace('.', '');
    },
    validForm() {
      return typeof this.rules.required() !== 'string'
        && typeof this.rules.decimals() !== 'string'
        && typeof this.rules.debtExists() !== 'string'
        && typeof this.rules.hasEnoughTokens() !== 'string'
        && typeof this.rules.notBiggerThanDebt() !== 'string';
    },
    hasDecimals() {
      return !!Number(this.data.token.decimals);
    },
    numberOfDecimals() {
      const amount = this.amount.toString();
      return amount.includes('.') ? (amount.substring(amount.indexOf('.') + 1, amount.length)
        .length <= this.data.token.decimals) : true;
    },
    decimalPositions() {
      const amount = this.amount.toString();
      return this.hasDecimals ? this.numberOfDecimals : !amount.includes('.');
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
        })
        .catch(() => {
          this.waiting = false;
          this.$emit('error');
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
      let oldCash;
      await this.data.market.updatedBorrowBy(this.account)
        .then((borrowBy) => {
          this.oldBorrowBy = borrowBy;
          this.borrowBy = borrowBy - Number(this.contractAmount);
          return this.$rbank.controller.getAccountLiquidity(this.account);
        })
        .then((accountLiquidity) => {
          oldLiquidity = accountLiquidity;
          return this.data.market.eventualCash;
        })
        .then((cash) => {
          oldCash = cash;
          this.cash = cash + Number(this.contractAmount);
          return this.$rbank.controller.getAccountValues(this.account);
        })
        .then(({ supplyValue, borrowValue }) => {
          const newBorrowValue = ((borrowValue - (Number(this.contractAmount) * this.price)) * (this
            .collateralFactor + this.mantissa)) / this.mantissa;
          const newSupplyValue = supplyValue;
          this.liquidity = newBorrowValue < newSupplyValue ? newSupplyValue - newBorrowValue : 0;
          this.maxRepayAllowed = this.getMaxRepayAllowed(this.oldBorrowBy, this.tokenBalance);
          this.maxBorrowAllowed = this.getMaxBorrowAllowed(this.liquidity, this.cash);
          this.borrowBalanceInfo = Number(this.contractAmount);
          this.borrowLimitInfo = Number(this.maxBorrowAllowed - this
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
        this.oldBorrowBy = borrowBy;
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
        return this.$rbank.controller.eventualMantissa;
      })
      .then((mantissa) => {
        this.mantissa = mantissa;
        return this.$rbank.controller.eventualCollateralFactor;
      })
      .then((collateralFactor) => {
        this.collateralFactor = collateralFactor * this.mantissa;
        this.maxRepayAllowed = this.getMaxRepayAllowed(this.borrowBy, this.tokenBalance);
        this.maxBorrowAllowed = this.getMaxBorrowAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
