<template>
  <v-card class="PayBorrowForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>PayBorrow of market {{data.market.address}} of token {{data.token.symbol}}</h2>
        </v-row>
        <v-row>
          <v-col cols="10" class="pb-0">
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
          <v-col cols="2">
            <v-switch color="success" v-model="maxAmount" label="Máximo"/>
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

export default {
  name: 'PayBorrowForm',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      amount: null,
      maxAmount: false,
      rules: {
        required: () => !!this.amount || 'Required.',
        debtExists: () => (this.data.borrowedByAccount > 0 && !!this.contractAmount)
          || 'You do not have a debt on this market.',
        hasEnoughTokens: () => this.data.tokenAccountBalance >= this.contractAmount
          || `You do not have enough ${this.data.market.token.symbol}s`,
        notBiggerThanDebt: () => this.data.borrowedByAccount >= this.contractAmount
          || 'You do not owe that much.',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    maxAsDouble() {
      return this.data.max / (10 ** this.data.token.decimals);
    },
    validForm() {
      return typeof this.rules.required() !== 'string'
        && typeof this.rules.debtExists() !== 'string'
        && typeof this.rules.hasEnoughTokens() !== 'string'
        && typeof this.rules.notBiggerThanDebt() !== 'string';
    },
    contractAmount() {
      return this.amount * (10 ** this.data.token.decimals);
    },
  },
  methods: {
    payBorrow() {
      this.data.market.payBorrow(this.contractAmount, this.account)
        .then(() => {
          this.$emit('formSucceed');
        });
    },
  },
  watch: {
    amount() {
      if (this.maxAmount && this.amount !== this.maxAsDouble) this.maxAmount = false;
      if (this.amount === this.maxAsDouble) this.maxAmount = true;
    },
    maxAmount() {
      if (this.maxAmount) this.amount = this.maxAsDouble;
      if (!this.maxAmount && this.amount === this.maxAsDouble) this.amount = null;
    },
  },
};
</script>
