<template>
  <v-card class="RedeemForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Redeem from market {{data.market.address}} of token {{data.token.symbol}}</h2>
        </v-row>
        <v-row>
          <v-col cols="10" class="pb-0">
            <v-text-field
              v-model.number="amount"
              label="Redeem amount"
              type="number"
              :rules="[rules.required, rules.marketSupply, rules.userSupply]"
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
      <v-btn color="success" @click="redeem" :disabled="!validForm">
        Redeem
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'RedeemForm',
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
        marketSupply: () => this.data.cash >= this.contractAmount
          || 'Market does not have enough funds',
        userSupply: () => this.data.userSupply >= this.contractAmount
          || 'You do not have enough funds on this market',
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
        && typeof this.rules.marketSupply() !== 'string'
        && typeof this.rules.userSupply() !== 'string';
    },
    contractAmount() {
      return this.amount * (10 ** this.data.token.decimals);
    },
  },
  methods: {
    redeem() {
      this.data.market.redeem(this.contractAmount, this.account)
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
