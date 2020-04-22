<template>
  <v-card class="BorrowForm ma-5" :lazy-validation="true" max-width="80%">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Borrow from market {{marketAddress}} of token {{tokenSymbol}}</h2>
        </v-row>
        <v-row>
          <v-col class="pb-0">
            <v-text-field
              v-model="amount"
              label="Borrow amount"
              type="number"
              required>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="pl-6 pb-4 pt-0">
      <v-btn color="success" @click="borrow">
        Borrow
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'BorrowForm',
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
      tokenName: null,
      tokenSymbol: null,
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
    borrow() {
      this.market.borrow(this.from, this.amount)
        .then(() => {
          this.$emit('formSucceed');
        });
    },
  },
  created() {
    this.market = new Market(this.marketAddress);
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        const token = new Token(tokenAddress);
        return [token.eventualName, token.eventualSymbol];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
      });
  },
};
</script>
