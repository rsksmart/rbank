<template>
  <div>
    <template v-if="!waiting">
      <v-row class="inputBox">
        <v-col cols="10">
          <v-text-field class="inputText" full-width single-line solo flat
            type="number" v-model="amount" required
            :rules="[rules.required, rules.decimals,
            rules.marketCash, rules.liquidity]"/>
        </v-col>
        <v-col cols="2">
          <v-btn @click="maxAmount = true" class="mb-12" text color="#008CFF">max</v-btn>
        </v-col>
      </v-row>
      <v-row class="ma-0 my-5 d-flex justify-center">
        <p>Would you like to <a target="_blank" href="https://coinmarketcap.com/">buy more tokens</a></p>
      </v-row>
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
        <v-row class="d-flex align-center">
          <v-col cols="2"/>
          <v-col cols="3" class="d-flex justify-end">
            <h3>borrow balance:</h3>
          </v-col>
          <v-col cols="4">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="7" class="d-flex justify-center">
                <template v-if="$options.filters
                 .formatToken(borrowBy, data.token.decimals).toString().length > 6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <h1 v-bind="attrs" v-on="on">
                        {{ borrowBy | formatToken(data.token.decimals) }}
                      </h1>
                    </template>
                    <span>{{ borrowBy | fullToken(data.token.decimals) }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <h1>{{ borrowBy | formatToken(data.token.decimals) }}</h1>
                </template>
              </v-col>
              <v-col cols="5" class="itemInfo">
                <template v-if="$options.filters
                 .formatToken(borrowBalanceInfo, data.token.decimals).toString().length > 6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="text-center" v-if="borrowBalanceInfo"  v-bind="attrs" v-on="on">
                      (+{{ borrowBalanceInfo | formatToken(data.token.decimals) }})
                    </span>
                    </template>
                    <span>{{ borrowBalanceInfo | fullToken(data.token.decimals) }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <span class="text-center" v-if="borrowBalanceInfo">
                      (+{{ borrowBalanceInfo | formatToken(data.token.decimals) }})
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
        <v-btn class="button" rounded color="#008CFF" @click="borrow" :disabled="!validForm">
          Borrow tokens
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
      amount: '0',
      borrowBy: 0,
      borrowRate: 0,
      liquidity: 0,
      cash: 0,
      oldMaxBorrowAllowed: 0,
      maxBorrowAllowed: 0,
      borrowBalanceInfo: null,
      borrowLimitInfo: null,
      tokenBalance: 0,
      collateralFactor: 0,
      mantissa: 0,
      oldCash: 0,
      oldLiquidity: 0,
      rules: {
        required: () => !!Number(this.amount) || 'Required.',
        decimals: () => this.decimalPositions || `Maximum ${this.data.token
          .decimals} decimal places for ${this.data.token.symbol}.`,
        marketCash: () => this.oldCash >= Number(this
          .contractAmount) || `This market doesn't have enough ${this.data.token.symbol}`,
        liquidity: () => this.oldLiquidity >= (this.price * 2 * Number(this
          .contractAmount)) || 'You don\'t have enough liquidity, supply more collateral.',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    contractAmount() {
      return Number(this.amount).toFixed(this.data.token.decimals).replace('.', '');
    },
    validForm() {
      return typeof this.rules.liquidity() !== 'string'
        && typeof this.rules.decimals() !== 'string'
        && typeof this.rules.required() !== 'string'
        && typeof this.rules.marketCash() !== 'string';
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
    borrow() {
      this.waiting = true;
      this.$emit('wait');
      this.data.market.borrow(this.contractAmount, this.account)
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
    getMaxBorrowAllowed(liquidity, cash) {
      const allowed = this.price > 0 ? Math.floor(liquidity / (this.price * 2)) : 0;
      return allowed >= cash ? cash : allowed;
    },
    async getValues() {
      await this.data.market.updatedBorrowBy(this.account)
        .then((borrowBy) => {
          this.borrowBy = borrowBy + Number(this.contractAmount);
          return this.$rbank.controller.getAccountLiquidity(this.account);
        })
        .then((accountLiquidity) => {
          this.oldLiquidity = accountLiquidity;
          return this.data.market.eventualCash;
        })
        .then((cash) => {
          this.oldCash = cash;
          this.cash = cash - Number(this.contractAmount);
          return this.$rbank.controller.getAccountValues(this.account);
        })
        .then(({ supplyValue, borrowValue }) => {
          const newBorrowValue = ((borrowValue + (Number(this.contractAmount) * this.price)) * (this
            .collateralFactor + this.mantissa)) / this.mantissa;
          const newSupplyValue = supplyValue;
          this.liquidity = newBorrowValue < newSupplyValue ? newSupplyValue - newBorrowValue : 0;
          this.maxBorrowAllowed = this.getMaxBorrowAllowed(this.liquidity, this.cash);
          this.borrowBalanceInfo = Number(this.contractAmount);
          this.borrowLimitInfo = Number(this
            .getMaxBorrowAllowed(this.oldLiquidity, this.oldCash) - this.maxBorrowAllowed);
        });
    },
  },
  watch: {
    amount() {
      this.getValues();
      if (this.maxAmount && this.amount !== this.oldMaxBorrowAllowed) this.maxAmount = false;
      if (this.amount === this.oldMaxBorrowAllowed) this.maxAmount = true;
    },
    maxAmount() {
      if (this.maxAmount) this.amount = this.oldMaxBorrowAllowed;
      if (!this.maxAmount && this.amount === this.oldMaxBorrowAllowed) this.amount = null;
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
        this.oldLiquidity = accountLiquidity;
        this.liquidity = accountLiquidity;
        return this.data.market.eventualCash;
      })
      .then((cash) => {
        this.oldCash = cash;
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
        return this.$rbank.controller.eventualMantissa;
      })
      .then((mantissa) => {
        this.mantissa = mantissa;
        return this.$rbank.controller.eventualCollateralFactor;
      })
      .then((collateralFactor) => {
        this.collateralFactor = collateralFactor * this.mantissa;
        this.oldMaxBorrowAllowed = this.asDouble(this
          .getMaxBorrowAllowed(this.liquidity, this.cash));
        this.maxBorrowAllowed = this.getMaxBorrowAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
