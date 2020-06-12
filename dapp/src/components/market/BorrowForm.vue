<template>
  <v-card class="BorrowForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Borrow from market {{data.market.address}} of token {{data.market.token.symbol}}</h2>
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
import { mapState, mapActions } from 'vuex';
import * as constants from '@/store/constants';
import Market from '@/handlers/market';

export default {
  name: 'BorrowForm',
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
        required: () => (!!this.amount || 'Required.'),
        liquidity: () => (this.data.liquidity
          >= (this.data.market.price * 2 * this.contractAmount) || 'not enough liquidity'),
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
      mantissa: (state) => state.Controller.mantissa,
    }),
    maxAsDouble() {
      return this.data.max / this.mantissa;
    },
    validForm() {
      return typeof this.rules.liquidity() !== 'string'
        && typeof this.rules.required() !== 'string';
    },
    contractAmount() {
      return this.amount * this.mantissa;
    },
  },
  methods: {
    ...mapActions({
      updateMarket: constants.CONTROLLER_MARKET_UPDATE,
    }),
    borrow() {
      const market = new Market(this.data.market.address);
      market.borrow(this.account, this.contractAmount)
        .then(() => {
          this.updateMarket(this.data.market.id);
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
