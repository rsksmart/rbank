<template>
  <div class="SupplyForm">
    <v-container fluid>
      <v-row>
        <h2>Supply to market {{marketAddress}} for token {{tokenSymbol}}</h2>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-form ref="form" :lazy-validation="true">
            <v-text-field
              v-model="amount"
              label="Supply amount"
              type="number"
              required>
            </v-text-field>
            <v-btn color="success" @click="supply">
              Supply
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
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
      successSupply: false,
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
    supply() {
      this.token.approve(this.from, this.marketAddress, this.amount)
        .then(() => {
          this.market.supply(this.from, this.amount)
            .then(() => {
              this.$router.push({
                name: 'Market',
                params: { id: this.marketAddress },
              });
            });
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
