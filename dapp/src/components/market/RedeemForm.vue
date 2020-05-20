<template>
  <v-card class="RedeemForm mx-5" :lazy-validation="true">
    <v-card-text class="pb-0">
      <v-container fluid>
        <v-row>
          <h2>Redeem from market {{marketAddress}} of token {{tokenSymbol}}</h2>
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
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'RedeemForm',
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
    maxAmountAllowed: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      market: null,
      amount: null,
      tokenName: null,
      tokenSymbol: null,
      validForm: false,
      userSupply: null,
      balanceOfMarket: null,
      maxAmount: false,
      rules: {
        required: () => !!this.amount || 'Required.',
        marketSupply: () => this.balanceOfMarket >= this.amount || 'Market does not have enough funds',
        userSupply: () => this.userSupply >= this.amount || 'You do not have enough funds on this market',
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    redeem() {
      this.market.redeem(this.account, this.amount)
        .then(() => this.$emit('formSucceed'));
    },
  },
  watch: {
    amount() {
      this.validForm = typeof this.rules.required() !== 'string'
        && typeof this.rules.marketSupply() !== 'string'
        && typeof this.rules.userSupply() !== 'string';
    },
    maxAmount() {
      if (this.maxAmount) {
        this.amount = this.maxAmountAllowed;
      } else {
        this.amount = null;
      }
    },
  },
  created() {
    this.market = new Market(this.marketAddress);
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        const token = new Token(tokenAddress);
        return [token.eventualName, token.eventualSymbol, token.balanceOf(this.marketAddress)];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol, balanceOfMarket]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
        this.balanceOfMarket = Number(balanceOfMarket);
      });
    this.market.getUpdatedSupplyOf(this.account)
      .then((supply) => {
        this.userSupply = Number(supply);
      });
  },
};
</script>
