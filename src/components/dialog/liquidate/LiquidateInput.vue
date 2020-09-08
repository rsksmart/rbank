<template>
  <div class="liquidate-input">
    <template v-if="!waiting">
      <liquidate-list
        v-if="!accountSelected"
        :data="data"
        @selected="setLiquidationAccount"
      />
      <div v-else>
        <v-row class="mx-6 px-6 mb-3">
          <h1>
            Collateral Available to liquidate:
          </h1>
        </v-row>
        <v-row class="mx-6 px-6">
          <p class="text-justify">
            As collaterals are not necessarily expressed in the same token as the market,
            you may need to liquidate them in other tokens.
          </p>
        </v-row>
        <v-row class="my-4 d-flex align-center">
          <v-col cols="3">
            <v-row class="d-flex justify-center">
              <h2>Collateral</h2>
            </v-row>
            <v-row class="d-flex justify-center">
              <h3>
                {{maxToLiquidate | formatToken(data.token.decimals)}}
              </h3>
              <span>
                {{data.token.symbol}}
              </span>
            </v-row>
          </v-col>
          <v-divider vertical inset/>
          <v-col cols="8" class="input-col">
            <v-row class="inputBox mb-4">
              <v-col cols="10">
                <v-text-field class="inputText" full-width single-line solo flat
                              type="number" v-model="amount" required
                              :rules="[rules.required, rules.decimals,
                              rules.funds, rules.maxAvailable]"/>
              </v-col>
              <v-col cols="2" class="mb-6 ml-0">
                <v-btn @click="max = true" text color="#008CFF">max</v-btn>
              </v-col>
            </v-row>
            <v-row class="mx-0 px-1 d-flex align-center">
              <v-col cols="2">
                <h4>
                  You pay:
                </h4>
              </v-col>
              <v-col cols="8" class="summary-num d-flex justify-center">
                {{collateralAmount}}
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span>{{borrowMarketSymbol}}</span>
              </v-col>
            </v-row>
            <v-row class="mx-0 px-1 pt-1 d-flex align-center">
              <v-col cols="2" />
              <v-col cols="8" class="d-flex justify-center">
                <span>
                 {{usdAmount | formatPrice}}
                </span>
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span>
                 USD
                </span>
              </v-col>
            </v-row>
            <v-row class="mx-0 mt-4 px-1 d-flex align-center">
              <v-col cols="2">
                <h4>
                  You get:
                </h4>
              </v-col>
              <v-col cols="8" class="summary-num d-flex justify-center">
                {{liquidationAmount | formatToken(data.token.decimals)}}
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span>{{data.token.symbol}}</span>
              </v-col>
            </v-row>
            <v-row class="mx-0 px-1 pt-1 d-flex align-center">
              <v-col cols="2" />
              <v-col cols="8" class="d-flex justify-center">
                <span>
                 {{usdAmount | formatPrice}}
                </span>
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span>
                 USD
                </span>
              </v-col>
            </v-row>
            <v-row class="px-1 mt-6 d-flex justify-center">
              <h5>
                Would you like to
                <a href="">buy more tokens?</a>
              </h5>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="my-6 d-flex justify-center">
          <v-btn class="button" rounded color="#008CFF" @click="liquidate" :disabled="!validForm">
            Liquidate account
          </v-btn>
        </v-row>
      </div>
    </template>
    <template v-else>
      <loader/>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LiquidateList from '@/components/dialog/liquidate/LiquidateList.vue';
import Loader from '@/components/common/Loader.vue';

export default {
  name: 'LiquidateInput',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      waiting: false,
      liquidationAccount: '',
      accountSelected: false,
      accountDebt: 0,
      borrowMarketAddress: '',
      borrowMarketPrice: 0,
      currentMarketPrice: 0,
      borrowMarketTokenDecimals: 0,
      maxCollateralSupplied: 0,
      borrowMarketSymbol: '',
      amount: '0',
      funds: 0,
      max: false,
      rules: {
        required: () => !!Number(this.amount) || 'Required.',
        decimals: () => this.decimalPositions || `Maximum ${this.data.token
          .decimals} decimal places for ${this.data.token.symbol}.`,
        funds: () => this.funds >= (this.usdAmount / (this.borrowMarketPrice)) || 'Not enough funds',
        maxAvailable: () => this.amount <= this.maxToLiquidate
          || 'There is not enough collateral to liquidate',
      },
    };
  },
  watch: {
    max() {
      if (this.max) this.amount = this.maxToLiquidate;
    },
  },
  methods: {
    liquidate() {
      this.waiting = true;
      this.$emit('wait');
      const market = new this.$rbank.Market(this.borrowMarketAddress);
      market.liquidateBorrow(
        this.liquidationAccount,
        this.collateralAmount * (10 ** this.borrowMarketTokenDecimals),
        this.data.market.address,
        this.account,
      )
        .then((res) => {
          this.waiting = false;
          this.$emit('succeed', {
            hash: res.transactionHash,
            liquidateValue: this.liquidationAmount,
            costValue: this.collateralAmount * (10 ** this.borrowMarketTokenDecimals),
            collateral: {
              decimals: this.borrowMarketTokenDecimals,
              symbol: this.borrowMarketSymbol,
            },
          });
        })
        .catch(() => {
          this.waiting = false;
          this.$emit('error');
        });
    },
    setLiquidationAccount(accountObject) {
      this.borrowMarketAddress = accountObject.borrowMarketAddress;
      this.getCollateralToken()
        .then(() => this.$rbank.controller.eventualMarketPrice(this.borrowMarketAddress))
        .then((price) => {
          this.borrowMarketPrice = price;
          this.accountDebt = accountObject.debt * price;
          return this.$rbank.controller.eventualMarketPrice(this.data.market.address);
        })
        .then((price) => {
          this.currentMarketPrice = price;
          this.maxCollateralSupplied = accountObject.maxToLiquidate * price;
          this.accountSelected = true;
        });
      this.liquidationAccount = accountObject.borrower;
    },
    actionSucceed(succeedObj) {
      this.emit('succeed', succeedObj);
    },
    getCollateralToken() {
      return new Promise((resolve, reject) => {
        new this.$rbank.Market(this.borrowMarketAddress).eventualToken
          .then((token) => Promise.all([token.eventualSymbol, token.eventualDecimals,
            token.eventualBalanceOf(this.account)]))
          .then(([symbol, decimals, balance]) => {
            this.borrowMarketSymbol = symbol;
            this.borrowMarketTokenDecimals = decimals;
            this.funds = balance;
            resolve();
          }).catch(reject);
      });
    },
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    validForm() {
      return typeof this.rules.funds() !== 'string'
        && typeof this.rules.decimals() !== 'string'
        && typeof this.rules.required() !== 'string'
        && typeof this.rules.maxAvailable() !== 'string';
    },
    maxToLiquidate() {
      return Math.min(this.maxCollateralSupplied, this.accountDebt) / this.currentMarketPrice;
    },
    usdAmount() {
      return (this.amount * this.currentMarketPrice);
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
    contractAmount() {
      return this.borrowMarketTokenDecimals
        ? this.amount / 10 ** this.borrowMarketTokenDecimals : this.amount;
    },
    collateralAmount() {
      return ((this.amount * this.currentMarketPrice)
        / (this.borrowMarketPrice * (10 ** this.borrowMarketTokenDecimals)))
        .toFixed(this.borrowMarketTokenDecimals);
    },
    liquidationAmount() {
      return Number(Number(this.amount).toFixed(this.data.token.decimals));
    },
  },
  components: {
    Loader,
    LiquidateList,
  },
};
</script>
