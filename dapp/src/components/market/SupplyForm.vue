<template>
  <v-card class="SupplyForm ma-5" :lazy-validation="true" max-width="80%">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Supply to market {{marketAddress}} of token {{tokenSymbol}}</h2>
        </v-row>
        <v-row>
          <v-col class="pb-0">
            <v-text-field
              v-model="amount"
              label="Supply amount"
              type="number"
              :rules="[rules.required, rules.minBalance]"
              required>
            </v-text-field>
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
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'SupplyForm',
  props: {
    marketAddress: {
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
        minBalance: () => this.tokenBalance >= this.amount || 'Not enough funds',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
      from: (state) => ({ from: state.Session.account }),
      isOwner: (state) => state.Session.isOwner,
    }),
  },
  methods: {
    supply() {
      this.token.approve(this.from, this.marketAddress, this.amount)
        .then(() => this.market.supply(this.from, this.amount))
        .then(() => {
          this.$emit('formSucceed');
        });
    },
    getBalance() {
      this.token.balanceOf(this.account)
        .then((balance) => {
          this.tokenBalance = balance;
        });
    },
  },
  watch: {
    amount() {
      this.validForm = typeof this.rules.minBalance() !== 'string' && typeof this.rules.required() !== 'string';
    },
  },
  created() {
    this.market = new Market(this.marketAddress);
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        this.token = new Token(tokenAddress);
        return [this.token.eventualName, this.token.eventualSymbol];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
        this.getBalance();
      });
  },
};
</script>
