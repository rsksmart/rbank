<template>
  <v-card class="BorrowForm ma-5" :lazy-validation="true" max-width="80%">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Borrow from market {{marketAddress}} of token {{tokenSymbol}}</h2>
        </v-row>
        <v-row>
          <v-col class="pb-0">
            <v-text-field
              v-model.number="amount"
              label="Borrow amount"
              :rules="[rules.required, rules.liquidity]"
              type="number"
              required>
            </v-text-field>
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
      rules: {
        required: () => (!!this.amount || 'Required.'),
        liquidity: () => (this.liquidity >= this.marketPrice * 2 * this.amount || 'not enough liquidity'),
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
      isOwner: (state) => state.Session.isOwner,
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
