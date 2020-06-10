<template>
  <v-card class="SupplyForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Supply to market {{market.address}} of token {{market.token.symbol}}</h2>
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

export default {
  name: 'SupplyForm',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      maxAmount: false,
      // market: null,
      // token: null,
      amount: null,
      // tokenName: null,
      // tokenSymbol: null,
      // tokenBalance: null,
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
      isOwner: (state) => state.Session.isOwner,
    }),
  },
  methods: {
    supply() {
      this.token.approve(this.account, this.marketAddress, this.amount)
        .then(() => this.market.supply(this.account, this.amount))
        .then(() => {
          this.$emit('formSucceed');
        });
    },
  //   getBalance() {
  //     this.token.balanceOf(this.account)
  //       .then((balance) => {
  //         this.tokenBalance = Number(balance);
  //       });
  //   },
  },
  watch: {
    amount() {
      this.validForm = typeof this.rules.minBalance() !== 'string'
        && typeof this.rules.required() !== 'string';
    },
    maxAmount() {
      this.amount = this.maxAmount ? this.market.token.balance : null;
    },
  },
  // created() {
  //   this.market = new Market(this.marketAddress);
  //   this.market.eventualTokenAddress
  //     .then((tokenAddress) => {
  //       this.token = new Token(tokenAddress);
  //       return [this.token.eventualName, this.token.eventualSymbol];
  //     })
  //     .then((tokenPromises) => Promise.all(tokenPromises))
  //     .then(([tokenName, tokenSymbol]) => {
  //       this.tokenName = tokenName;
  //       this.tokenSymbol = tokenSymbol;
  //       this.getBalance();
  //     });
  // },
};
</script>
