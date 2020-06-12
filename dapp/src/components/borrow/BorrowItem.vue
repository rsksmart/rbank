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
                {{ market.token.symbol }}
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
import Controller from '@/handlers/controller';

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
    };
  },
  computed: {
    ...mapState({
      mantissa: (state) => state.Controller.mantissa,
      factor: (state) => state.Controller.factor,
      account: (state) => state.Session.account,
    }),
    apr() {
      return ((this.market.borrowRate * 100) / this.factor).toFixed(2);
    },
    formObject() {
      return {
        market: this.market,
        max: Number(this.maxBorrowAllowed),
        liquidity: this.liquidity,
      };
    },
    maxBorrowAllowed() {
      let allowed = this.market.price > 0
        ? Math.floor(this.liquidity / (this.market.price * 2)) : 0;
      allowed = allowed >= this.market.cash ? this.market.cash : allowed;
      return (allowed / this.mantissa).toFixed(5);
    },
  },
  methods: {
    reset() {
      this.flag = false;
      this.getAccountLiquidity();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    getAccountLiquidity() {
      const controller = new Controller();
      controller.getLiquidity(this.account)
        .then((liquidity) => {
          this.liquidity = Number(liquidity);
        });
    },
  },
  components: {
    BorrowForm,
  },
  created() {
    this.getAccountLiquidity();
  },
};
</script>
