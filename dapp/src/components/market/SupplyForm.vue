<template>
  <v-card class="SupplyForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Supply to market {{data.market.address}} of token {{data.market.token.symbol}}</h2>
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
            <v-switch color="success" v-model="maxAmount" label="Máximo"/>
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
import Token from '@/handlers/token';
import Market from '@/handlers/market';

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
      maxAmount: false,
      amount: null,
      validForm: false,
      rules: {
        required: () => !!this.amount || 'Required.',
        minBalance: () => this.data.accountBalance >= this.amount || 'Not enough funds',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
      mantissa: (state) => state.Controller.mantissa,
    }),
  },
  methods: {
    supply() {
      const contractAmount = this.amount * this.mantissa;
      const market = new Market(this.data.market.address);
      const token = new Token(this.data.market.token.address);
      token.approve(this.account, this.data.market.address, contractAmount)
        .then(() => market.supply(this.account, contractAmount))
        .then(() => {
          this.$emit('formSucceed');
        });
    },
  },
  watch: {
    amount() {
      this.validForm = typeof this.rules.minBalance() !== 'string'
        && typeof this.rules.required() !== 'string';
    },
    maxAmount() {
      this.amount = this.maxAmount ? this.data.accountBalance : null;
    },
  },
};
</script>
