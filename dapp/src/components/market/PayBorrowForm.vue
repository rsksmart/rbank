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
              v-model="amount"
              label="Debt amount"
              type="number"
              required>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="pl-6 pb-4 pt-0">
      <v-btn color="success" @click="payBorrow">
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
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
      from: (state) => ({ from: state.Session.account }),
    }),
  },
  methods: {
    payBorrow() {
      this.token.approve(this.from, this.marketAddress, this.amount)
        .then(() => this.market.payBorrow(this.from, this.amount))
        .then(() => {
          this.$emit('formSucceed');
        });
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
      });
  },
};
</script>
