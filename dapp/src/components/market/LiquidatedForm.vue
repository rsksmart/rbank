<template>
  <v-card class="LiquidatedForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Liquidate loan of account {{accountAddress}}}</h2>
        </v-row>
        <v-row>
          <v-col class="pb-0">
            <v-text-field
              v-model.number="amount"
              label="Amount"
              type="number"
              :rules="[rules.required]"
              required>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="pl-6 pb-4 pt-0">
      <v-btn color="success" @click="liquidate" :disabled="!validForm">
        Liquidate
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LiquidatedForm',
  props: {
    accountAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      market: null,
      token: null,
      amount: null,
      tokenName: null,
      tokenSymbol: null,
      tokenBalance: null,
      validForm: false,
      rules: {
        required: () => !!this.amount || 'Required.',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    getBalance() {
      this.token.balanceOf(this.account)
        .then((balance) => {
          this.tokenBalance = Number(balance);
        });
    },
    liquidate() {
      console.log(`Liquidated for ${this.amount} of account ${this.accountAddress}`);
      this.$emit('formSucceed');
    },
  },
  watch: {
    amount() {
      this.validForm = typeof this.rules.required() !== 'string';
    },
  },
};
</script>
