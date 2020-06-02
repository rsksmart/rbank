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
                {{ maxBorrowAllowed }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="4">
            <v-list-item-content>
              <v-list-item-title class="text-center">
                ... %
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
    <template v-if="flag">
      <borrow-form @formSucceed="reset" :marketAddress="marketAddress"
                    :maxAmountAllowed="maxBorrowAllowed"/>
    </template>
  </div>
</template>

<script>
import BorrowForm from '@/components/market/BorrowForm.vue';
import { mapState } from 'vuex';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'BorrowItem',
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
      tokenName: null,
      tokenSymbol: null,
      liquidity: null,
      marketPrice: null,
      marketCash: null,
      maxBorrowAllowed: null,
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
      this.getMaxBorrowAllowed();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    getMaxBorrowAllowed() {
      this.market.eventualCash
        .then((balance) => {
          this.marketCash = balance;
          return this.controller.getLiquidity(this.account);
        })
        .then((liquidity) => {
          this.liquidity = Number(liquidity);
          return this.controller.getPrice(this.marketAddress);
        })
        .then((price) => {
          this.marketPrice = Number(price);
          this.maxBorrowAllowed = this.marketPrice > 0
            ? Math.floor(this.liquidity / (this.marketPrice * 2)) : 0;
          this.maxBorrowAllowed = this.maxBorrowAllowed >= this.marketCash
            ? this.marketCash : this.maxBorrowAllowed;
        });
    },
  },
  components: {
    BorrowForm,
  },
  created() {
    this.controller = new Controller();
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
    this.getMaxBorrowAllowed();
  },
};
</script>
