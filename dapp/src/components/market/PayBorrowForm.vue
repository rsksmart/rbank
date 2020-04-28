<template>
  <v-card class="PayBorrowForm ma-5" :lazy-validation="true" max-width="80%">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>PayBorrow of market {{marketAddress}} of token {{tokenSymbol}}</h2>
        </v-row>
        <v-row>
          <v-col class="pb-0">
            <v-text-field
              v-model.number="amount"
              label="Debt amount"
              type="number"
              :rules="[
                rules.required,
                rules.debtExists,
                rules.notBiggerThanDebt,
                rules.hasEnoughTokens,
              ]"
              required>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="pl-6 pb-4 pt-0">
      <v-btn color="success" @click="payBorrow" :disabled="!validForm">
        Pay Debt
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'PayBorrowForm',
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      market: null,
      amount: null,
      token: null,
      tokenName: null,
      tokenSymbol: null,
      borrowByUser: null,
      balanceOfUser: null,
      validForm: false,
      rules: {
        required: () => !!this.amount || 'Required.',
        debtExists: () => (this.borrowByUser > 0 && !!this.amount)
          || 'You do not have a debt on this market.',
        hasEnoughTokens: () => this.balanceOfUser >= this.amount
          || `You do not have enough ${this.tokenSymbol}s`,
        notBiggerThanDebt: () => this.borrowByUser >= this.amount
          || 'You do not owe that much.',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    payBorrow() {
      this.token.approve(this.account, this.marketAddress, this.amount)
        .then(() => this.market.payBorrow(this.account, this.amount))
        .then(() => {
          this.$emit('formSucceed');
        });
    },
  },
  watch: {
    amount() {
      this.validForm = typeof this.rules.required() !== 'string'
        && typeof this.rules.debtExists() !== 'string'
        && typeof this.rules.hasEnoughTokens() !== 'string'
        && typeof this.rules.notBiggerThanDebt() !== 'string';
    },
  },
  created() {
    this.market = new Market(this.marketAddress);
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        this.token = new Token(tokenAddress);
        return [
          this.token.eventualName,
          this.token.eventualSymbol,
          this.token.balanceOf(this.account),
        ];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol, balanceOfUser]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
        this.balanceOfUser = Number(balanceOfUser);
      });
    this.market.getUpdatedBorrowBy(this.account)
      .then((borrowByUser) => {
        this.borrowByUser = Number(borrowByUser);
      });
  },
};
</script>
