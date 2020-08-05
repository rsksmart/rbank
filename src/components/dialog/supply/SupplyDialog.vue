<template>
  <v-dialog v-model="data.flag" width="45%">
    <v-card class="dialog container">
      <template v-if="!succeed">
        <supply-top :data="topObject"/>
        <template v-if="!waiting">
          <v-row class="d-flex justify-center">
            <div class="toggle my-5">
              <v-btn :class="[ currentComponent === 'SupplyList' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'SupplyList'">
                <span>Supply</span>
              </v-btn>
              <v-btn :class="[ currentComponent === 'BorrowList' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'BorrowList'">
                <span>Withdraw</span>
              </v-btn>
            </div>
          </v-row>
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
      </template>
      <template v-else>
        <success-top :data="successTopObject"/>
        <supply-success :data="supplySuccessObject" @closeDialog="close"/>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import Loader from '@/components/dialog/Loader.vue';
import SupplyTop from '@/components/dialog/supply/SupplyTop.vue';
import SuccessTop from '@/components/dialog/SuccessTop.vue';
import SupplySuccess from '@/components/dialog/supply/SupplySuccess.vue';

export default {
  name: 'Top',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentComponent: 'SupplyList',
      supplyOf: 0,
      earnings: 0,
      amount: 0,
      liquidity: 0,
      cash: 0,
      waiting: false,
      succeed: false,
      maxAmount: false,
      maxAllowed: 0,
      supplyBalanceInfo: null,
      borrowLimitInfo: null,
      hash: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    supplied() {
      return this.asDouble(this.supplyOf);
    },
    apr() {
      return this.data.borrowRate.toFixed(2);
    },
    balanceAsDouble() {
      return this.asDouble(this.data.tokenBalance);
    },
    maxBorrowAllowed() {
      return this.asDouble(this.maxAllowed);
    },
    contractAmount() {
      return this.amount * (10 ** this.data.token.decimals);
    },
    topObject() {
      return {
        balanceAsDouble: this.balanceAsDouble,
        token: this.data.token,
        price: this.data.price,
      };
    },
    successTopObject() {
      return {
        token: this.data.token,
        price: this.data.price,
        apr: this.apr,
      };
    },
    supplySuccessObject() {
      return {
        amount: this.amount,
        token: this.data.token,
        balanceAsDouble: this.balanceAsDouble,
        supplyBalanceInfo: this.supplyBalanceInfo,
        supplied: this.supplied,
        maxBorrowAllowed: this.maxBorrowAllowed,
        borrowLimitInfo: this.borrowLimitInfo,
        hash: this.hash,
      };
    },
  },
  methods: {
    asDouble(value) {
      return (value / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
    supply() {
      this.waiting = true;
      this.data.market.supply(this.contractAmount, this.account)
        .then((res) => {
          console.log(`Hash: ${res.transactionHash}`);
          this.waiting = false;
          this.succeed = true;
          this.hash = res.transactionHash;
        });
    },
    close() {
      console.log('Close dialog');
      this.data.flag = false;
    },
    getMaxAllowed(liquidity, cash) {
      const allowed = this.data.price > 0 ? Math.floor(liquidity / (this.data.price * 2)) : 0;
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
    SupplyTop,
    SuccessTop,
    SupplySuccess,
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
        this.maxAllowed = this.getMaxAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
