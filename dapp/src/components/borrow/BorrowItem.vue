<template>
  <div class="LiquidatedItem">
    <v-card class="mt-5" outlined>
      <v-list-item @click="enableForm()">
        <v-row>
          <v-col cols="2" class="d-flex justify-end">
            <v-list-item-avatar>
              <v-img :src="rif"/>
            </v-list-item-avatar>
          </v-col>
          <v-col cols="2">
            <v-list-item-content>
              <v-list-item-title class="text-left">
                {{ token.symbol }}
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
                {{ apr }} %
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
    <template v-if="flag">
      <borrow-form @formSucceed="reset" :data="formObject"/>
    </template>
  </div>
</template>

<script>
import BorrowForm from '@/components/market/BorrowForm.vue';
import { mapState } from 'vuex';
import rifImage from '@/assets/rif.png';

export default {
  name: 'BorrowItem',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
      liquidity: null,
      rif: rifImage,
      token: {
        name: null,
        symbol: null,
        decimals: 0,
      },
      borrowRate: 0,
      price: 0,
      cash: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    apr() {
      return this.borrowRate.toFixed(2);
    },
    formObject() {
      return {
        market: this.market,
        max: Number(this.maxBorrowAllowed) * (10 ** this.token.decimals),
        liquidity: this.liquidity,
        token: this.token,
        price: this.price,
      };
    },
    maxBorrowAllowed() {
      let allowed = this.price > 0 ? Math.floor(this.liquidity / (this.price * 2)) : 0;
      allowed = allowed >= this.cash ? this.cash : allowed;
      return (allowed / (10 ** this.token.decimals)).toFixed(this.token.decimals);
    },
  },
  methods: {
    reset() {
      this.flag = false;
      this.getAccountLiquidity();
      this.getMarketCash();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    async getAccountLiquidity() {
      await this.$rbank.controller.getAccountLiquidity(this.account)
        .then((liquidity) => {
          this.liquidity = liquidity;
        });
    },
    async getMarketCash() {
      await this.market.eventualCash
        .then((cash) => {
          this.cash = cash;
        });
    },
  },
  components: {
    BorrowForm,
  },
  created() {
    this.market.token
      .then((tok) => [
        tok.eventualName,
        tok.eventualSymbol,
        tok.eventualDecimals,
      ])
      .then((results) => Promise.all(results))
      .then(([name, symbol, decimals]) => {
        this.token.name = name;
        this.token.symbol = symbol;
        this.token.decimals = decimals;
        return this.$rbank.controller.eventualMarketPrice(this.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        this.getAccountLiquidity();
        this.getMarketCash();
      });
  },
};
</script>
