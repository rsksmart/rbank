<template>
  <v-card class="SupplyForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Supply to market {{data.marketAddress}} of token {{data.token.symbol}}</h2>
        </v-row>
        <v-row>
          <v-col cols="10" class="pb-0">
            <v-text-field
              v-model.number="amount"
              label="Supply amount"
              type="number"
              :rules="[rules.required, rules.minBalance]"
              required>
            </v-text-field>
          </v-col>
          <v-col cols="2">
            <v-switch color="success" v-model="maxAmount" label="Max"/>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="pl-6 pb-4 pt-0">
      <v-btn color="success" @click="supply" :disabled="!validForm">
        Supply
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SupplyForm',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      market: new this.$rbank.Market(this.data.marketAddress),
      maxAmount: false,
      amount: null,
      rules: {
        required: () => !!this.amount || 'Required.',
        minBalance: () => this.balanceAsDouble >= this.amount || 'Not enough funds',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    contractAmount() {
      return this.amount * (10 ** this.data.token.decimals);
    },
    balanceAsDouble() {
      return this.data.accountBalance / (10 ** this.data.token.decimals);
    },
    validForm() {
      return typeof this.rules.minBalance() !== 'string'
        && typeof this.rules.required() !== 'string';
    },
  },
  methods: {
    supply() {
      this.market.supply(this.contractAmount, this.account)
        .then(() => this.$emit('formSucceed'));
    },
  },
  watch: {
    amount() {
      if (this.maxAmount && this.amount !== this.balanceAsDouble) this.maxAmount = false;
      if (this.amount === this.balanceAsDouble) this.maxAmount = true;
    },
    maxAmount() {
      if (this.maxAmount) this.amount = this.balanceAsDouble;
      if (!this.maxAmount && this.amount === this.balanceAsDouble) this.amount = null;
    },
  },
};
</script>
