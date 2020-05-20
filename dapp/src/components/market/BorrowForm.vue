<template>
  <v-card class="BorrowForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Borrow from market {{marketAddress}} of token {{tokenSymbol}}</h2>
        </v-row>
        <v-row>
          <v-col cols="10" class="pb-0">
            <v-text-field
              v-model.number="amount"
              label="Borrow amount"
              :rules="[rules.required, rules.liquidity]"
              type="number"
              required>
            </v-text-field>
          </v-col>
          <v-col cols="2">
            <v-switch color="success" v-model="maxAmount" label="Máximo"/>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="pl-6 pb-4 pt-0">
      <v-btn :disabled="!validForm" color="success" @click="borrow">
        Borrow
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Market from '@/handlers/market';
import Token from '@/handlers/token';
import Controller from '@/handlers/controller';

export default {
  name: 'BorrowForm',
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
    maxAmountAllowed: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      controller: null,
      market: null,
      marketPrice: null,
      amount: null,
      tokenName: null,
      tokenSymbol: null,
      liquidity: null,
      validForm: false,
      maxAmount: false,
      rules: {
        required: () => (!!this.amount || 'Required.'),
        liquidity: () => (this.liquidity >= this.marketPrice * 2 * this.amount || 'not enough liquidity'),
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    borrow() {
      this.market.borrow(this.account, this.amount)
        .then(() => {
          this.$emit('formSucceed');
        });
    },
    getLiquidity() {
      this.controller.getLiquidity(this.account)
        .then((liquidity) => {
          this.liquidity = Number(liquidity);
        });
    },
  },
  watch: {
    amount() {
      this.validForm = typeof this.rules.liquidity() !== 'string'
        && typeof this.rules.required() !== 'string';
    },
    maxAmount() {
      if (this.maxAmount) {
        this.amount = Math.floor(this.maxAmountAllowed);
      } else {
        this.amount = null;
      }
    },
  },
  created() {
    this.market = new Market(this.marketAddress);
    this.controller = new Controller();
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        const token = new Token(tokenAddress);
        return [token.eventualName, token.eventualSymbol];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
      });
    this.getLiquidity();
    this.controller.getPrice(this.marketAddress)
      .then((price) => {
        this.marketPrice = Number(price);
      });
  },
};
</script>
