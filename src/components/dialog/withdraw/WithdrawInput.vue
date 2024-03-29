<template>
  <div>
    <template v-if="!waiting">
      <v-row class="inputBox">
        <v-col cols="10">
          <v-text-field class="inputText" full-width single-line solo flat
                        type="number" v-model="amount" required
                        :rules="[rules.required, rules.decimals,
                        rules.marketSupply, rules.userSupply, rules.userDebts]"/>
        </v-col>
        <v-col cols="2">
          <v-btn @click="maxAmount = true" class="mb-12" text color="#008CFF">max</v-btn>
        </v-col>
      </v-row>
      <v-row class="my-5"/>
      <div class="my-5 py-5">
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex justify-end">
            <h3>current cash:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <template v-if="$options.filters
                  .formatToken(cash, data.token.decimals).toString().length > 6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <h1 v-bind="attrs" v-on="on">
                        {{ cash | formatToken(data.token.decimals) }}
                      </h1>
                    </template>
                    <span>{{ cash | fullToken(data.token.decimals) }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <h1>{{ cash | formatToken(data.token.decimals) }}</h1>
                </template>
              </v-col>
              <v-col cols="5"/>
            </v-row>
          </v-col>
          <v-col cols="2">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="1"/>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex justify-end">
            <h3>supply balance:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <template v-if="$options.filters
                  .formatToken(supplyOf, data.token.decimals).toString().length > 6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <h1 v-bind="attrs" v-on="on">
                        {{ supplyOf | formatToken(data.token.decimals)}}
                      </h1>
                    </template>
                    <span>{{ supplyOf | fullToken(data.token.decimals) }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <h1>{{ supplyOf | formatToken(data.token.decimals)}}</h1>
                </template>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <template v-if="$options.filters
                  .formatToken(supplyBalanceInfo, data.token.decimals).toString().length > 6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="text-center" v-if="supplyBalanceInfo" v-bind="attrs" v-on="on">
                        (-{{ supplyBalanceInfo | formatToken(data.token.decimals) }})
                      </span>
                    </template>
                    <span>{{ supplyBalanceInfo | fullToken(data.token.decimals) }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <span class="text-center" v-if="supplyBalanceInfo">
                    (-{{ supplyBalanceInfo | formatToken(data.token.decimals) }})
                  </span>
                </template>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="1"/>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex align-end justify-end">
            <h3>borrow limit:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <template v-if="$options.filters
                  .formatToken(maxBorrowAllowed, data.token.decimals).toString().length > 6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <h1 v-bind="attrs" v-on="on">
                        {{ maxBorrowAllowed | formatToken(data.token.decimals) }}
                      </h1>
                    </template>
                    <span>{{ maxBorrowAllowed | fullToken(data.token.decimals) }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <h1>{{ maxBorrowAllowed | formatToken(data.token.decimals) }}</h1>
                </template>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <template v-if="$options.filters
                  .formatToken(borrowLimitInfo, data.token.decimals).toString().length > 6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="text-center" v-if="borrowLimitInfo" v-bind="attrs" v-on="on">
                        (-{{ borrowLimitInfo | formatToken(data.token.decimals) }})
                      </span>
                    </template>
                    <span>{{ borrowLimitInfo | fullToken(data.token.decimals) }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <span class="text-center" v-if="borrowLimitInfo">
                    (-{{ borrowLimitInfo | formatToken(data.token.decimals) }})
                  </span>
                </template>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2">
            <span class="itemInfo">{{ data.token.symbol }}</span>
          </v-col>
          <v-col cols="1"/>
        </v-row>
      </div>
      <v-row class="my-5 d-flex justify-center">
        <v-btn class="button" rounded color="#008CFF" @click="withdraw" :disabled="!validForm">
          Withdraw my tokens
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
  name: 'WithdrawInput',
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
      amount: '0',
      supplyOf: 0,
      liquidity: 0,
      cash: 0,
      price: 0,
      maxBorrowAllowed: 0,
      maxWithdrawAllowed: 0,
      supplyBalanceInfo: null,
      borrowLimitInfo: null,
      tokenBalance: 0,
      collateralFactor: 0,
      mantissa: 0,
      oldCash: 0,
      oldSupplyOf: 0,
      supplyValue: 0,
      borrowValue: 0,
      debt: 0,
      rules: {
        required: () => !!Number(this.amount) || 'Required.',
        decimals: () => this.decimalPositions || `Maximum ${this.data.token
          .decimals} decimal places for ${this.data.token.symbol}.`,
        marketSupply: () => this.oldCash >= Number(this.contractAmount)
          || 'Market does not have enough funds',
        userSupply: () => this.oldSupplyOf >= Number(this.contractAmount)
          || 'You do not have enough funds on this market',
        userDebts: () => (this.oldSupplyOf - this.debt) >= Number(this.contractAmount)
          || 'You can not withdraw that much, because is compromised as collateral in a debt',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    maxBorrowAllowedAsDouble() {
      return this.asDouble(this.maxBorrowAllowed);
    },
    contractAmount() {
      return Number(this.amount).toFixed(this.data.token.decimals).replace('.', '');
    },
    validForm() {
      return typeof this.rules.required() !== 'string'
        && typeof this.rules.decimals() !== 'string'
        && typeof this.rules.marketSupply() !== 'string'
        && typeof this.rules.userDebts() !== 'string'
        && typeof this.rules.userSupply() !== 'string';
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
    withdraw() {
      this.waiting = true;
      this.$emit('wait');
      this.data.market.redeem(this.contractAmount, this.account)
        .then((res) => {
          this.waiting = false;
          this.$emit('succeed', {
            hash: res.transactionHash,
            borrowLimitInfo: this.borrowLimitInfo,
            supplyBalanceInfo: this.supplyBalanceInfo,
          });
        })
        .catch(() => {
          this.waiting = false;
          this.$emit('error');
        });
    },
    asDouble(value) {
      return (Number(value) / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
    getMaxWithdrawAllowed(supplyOf, cash) {
      const allowed = cash > (supplyOf - this.debt) ? (supplyOf - this.debt) : cash;
      return this.asDouble(allowed);
    },
    getMaxBorrowAllowed(liquidity, cash) {
      const allowed = this.price > 0 ? Math.floor(liquidity / (this.price * 2)) : 0;
      return allowed >= cash ? cash : allowed;
    },
    async getValues() {
      let oldLiquidity;
      await this.data.market.updatedSupplyOf(this.account)
        .then((supplyOf) => {
          this.oldSupplyOf = supplyOf;
          this.supplyOf = supplyOf - Number(this.contractAmount);
          return this.$rbank.controller.getAccountLiquidity(this.account);
        })
        .then((accountLiquidity) => {
          oldLiquidity = accountLiquidity;
          return this.data.market.eventualCash;
        })
        .then((cash) => {
          this.oldCash = cash;
          this.cash = cash - Number(this.contractAmount);
          return this.$rbank.controller.getAccountValues(this.account);
        })
        .then(({ supplyValue, borrowValue }) => {
          const newBorrowValue = (borrowValue * (this
            .collateralFactor + this.mantissa)) / this.mantissa;
          const newSupplyValue = supplyValue - (Number(this.contractAmount) * this.price);
          this.liquidity = newBorrowValue < newSupplyValue ? newSupplyValue - newBorrowValue : 0;
          this.maxWithdrawAllowed = this.getMaxWithdrawAllowed(this.oldSupplyOf, this.oldCash);
          this.maxBorrowAllowed = this.getMaxBorrowAllowed(this.liquidity, this.cash);
          this.supplyBalanceInfo = Number(this.contractAmount);
          this.borrowLimitInfo = Number(this
            .getMaxBorrowAllowed(oldLiquidity, this.oldCash) - this.maxBorrowAllowed);
        });
    },
  },
  watch: {
    amount() {
      this.getValues();
      if (this.maxAmount && this.amount !== this.maxWithdrawAllowed) this.maxAmount = false;
      if (this.amount === this.maxWithdrawAllowed) this.maxAmount = true;
    },
    maxAmount() {
      this.getValues();
      if (this.maxAmount) this.amount = this.maxWithdrawAllowed;
      if (!this.maxAmount && this.amount === this.maxWithdrawAllowed) this.amount = null;
    },
  },
  components: {
    Loader,
  },
  created() {
    this.data.market.updatedSupplyOf(this.account)
      .then((supplyOf) => {
        this.oldSupplyOf = supplyOf;
        this.supplyOf = supplyOf;
        return this.$rbank.controller.getAccountValues(this.account);
      })
      .then(({ supplyValue, borrowValue }) => {
        this.supplyValue = supplyValue;
        this.borrowValue = borrowValue;
        return this.data.market.eventualCash;
      })
      .then((cash) => {
        this.oldCash = cash;
        this.cash = cash;
        return this.$rbank.controller.eventualMarketPrice(this.data.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.$rbank.controller.getAccountLiquidity(this.account);
      })
      .then((accountLiquidity) => {
        this.liquidity = accountLiquidity;
        return this.$rbank.controller.eventualMantissa;
      })
      .then((mantissa) => {
        this.mantissa = mantissa;
        return this.$rbank.controller.eventualCollateralFactor;
      })
      .then((collateralFactor) => {
        this.collateralFactor = collateralFactor * this.mantissa;
        this.debt = ((this.borrowValue * (this.mantissa + this.collateralFactor)) / this
          .mantissa) / this.price;
        this.maxWithdrawAllowed = this.getMaxWithdrawAllowed(this.supplyOf, this.cash);
        this.maxBorrowAllowed = this.getMaxBorrowAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
