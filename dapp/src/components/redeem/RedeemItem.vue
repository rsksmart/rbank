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
                {{ maxRedeemAmount }}
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
      <redeem-form @formSucceed="reset" :data="formObject"/>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Market from '@/handlers/market';
import RedeemForm from '@/components/market/RedeemForm.vue';

export default {
  name: 'RedeemItem',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
      userSupply: null,
    };
  },
  computed: {
    ...mapState({
      mantissa: (state) => state.Controller.mantissa,
      factor: (state) => state.Controller.factor,
      account: (state) => state.Session.account,
    }),
    maxRedeemAmount() {
      const allowed = this.market.cash > this.userSupply
        ? this.userSupply : this.market.cash;
      return (allowed / this.mantissa).toFixed(5);
    },
    apr() {
      return ((this.market.borrowRate * 100) / this.factor).toFixed(2);
    },
    formObject() {
      return {
        market: this.market,
        max: Number(this.maxRedeemAmount) * this.mantissa,
        userSupply: this.userSupply,
      };
    },
  },
  methods: {
    reset() {
      this.flag = false;
      this.getUserSupply();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    async getUserSupply() {
      const market = new Market(this.market.address);
      await market.getUpdatedSupplyOf(this.account)
        .then((supply) => {
          this.userSupply = Number(supply);
          return this.userSupply;
        });
    },
  },
  components: {
    RedeemForm,
  },
  created() {
    this.getUserSupply();
  },
};
</script>
