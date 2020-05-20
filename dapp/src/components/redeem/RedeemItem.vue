<template>
  <div class="LiquidatedItem">
    <v-card class="mt-5" outlined>
      <v-list-item @click="enableForm()">
        <v-row>
          <v-col cols="2" class="d-flex justify-end">
            <v-list-item-avatar>
              <v-img src="https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png"/>
            </v-list-item-avatar>
          </v-col>
          <v-col cols="2">
            <v-list-item-content>
              <v-list-item-title class="text-left">
                {{ tokenSymbol }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="4">
            <v-list-item-content>
              <v-list-item-title class="text-center">
                {{ tokenBalance }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="4">
            <v-list-item-content>
              <v-list-item-title class="text-center">
                5%
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
    <template v-if="flag">
      <redeem-form @formSucceed="reset" :marketAddress="marketAddress"/>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Market from '@/handlers/market';
import Token from '@/handlers/token';
import RedeemForm from '@/components/market/RedeemForm.vue';

export default {
  name: 'RedeemItem',
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
      market: null,
      token: null,
      tokenBalance: null,
      tokenName: null,
      tokenSymbol: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    reset() {
      this.flag = false;
      this.getBalance();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    getBalance() {
      this.token.balanceOf(this.account)
        .then((balance) => {
          this.tokenBalance = Number(balance);
        });
    },
  },
  components: {
    RedeemForm,
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

<style scoped>

</style>
