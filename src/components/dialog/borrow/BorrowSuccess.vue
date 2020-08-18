<template>
  <div>
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">
          You have successfully borrowed <br>
          <span class="greenish">
            {{ data.borrowBalanceInfo }} {{ data.token.symbol }}
          </span>
           from this Market.
        </div>
      </v-row>
    </div>
    <div class="my-5 py-5">
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>borrow balance:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ borrowed }}</h1>
        </v-col>
        <v-col cols="2">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>in your wallet:</h3>
        </v-col>
        <v-col cols="3">
          <h1 class="text-center">{{ balanceAsDouble }}</h1>
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
    <transaction-hash :hash="data.hash"/>
    <v-row class="my-5 d-flex justify-center">
      <v-btn class="button" rounded color="#008CFF" @click="closeDialog">
        Back to Supply / Borrow
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TransactionHash from '@/components/common/TransactionHash.vue';

export default {
  name: 'BorrowSuccess',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tokenBalance: 0,
      liquidity: 0,
      cash: 0,
      price: 0,
      maxBorrowAllowed: 0,
      borrowBy: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    balanceAsDouble() {
      return (this.tokenBalance / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
    maxBorrowAllowedAsDouble() {
      return (this.maxBorrowAllowed / (10 ** this.data.token.decimals))
        .toFixed(this.data.token.decimals);
    },
    borrowed() {
      return (this.borrowBy / (10 ** this.data.token.decimals))
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
  components: {
    TransactionHash,
  },
  created() {
    this.data.market.eventualToken
      .then((tok) => tok.eventualBalanceOf(this.account))
      .then((tokenBalance) => {
        this.tokenBalance = tokenBalance;
        return this.$rbank.controller.getAccountLiquidity(this.account);
      })
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
        return this.data.market.updatedBorrowBy(this.account);
      })
      .then((borrowBy) => {
        this.borrowBy = borrowBy;
        this.maxBorrowAllowed = this.getMaxAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
