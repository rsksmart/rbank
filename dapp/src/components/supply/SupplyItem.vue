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
                {{ balance }}
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
      <supply-form @formSucceed="reset" :market="market"/>
    </template>
  </div>
</template>

<script>
import SupplyForm from '@/components/market/SupplyForm.vue';
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'SupplyItem',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
    };
  },
  computed: {
    ...mapState({
      mantissa: (state) => state.Controller.mantissa,
      factor: (state) => state.Controller.factor,
    }),
    apr() {
      return ((this.market.borrowRate * 100) / this.factor).toFixed(2);
    },
    balance() {
      return (this.market.token.balance / this.mantissa).toFixed(5);
    },
  },
  methods: {
    ...mapActions({
      getMarkets: constants.CONTROLLER_GET_MARKETS,
    }),
    reset() {
      this.flag = false;
      this.getMarkets();
    },
    enableForm() {
      this.flag = !this.flag;
    },
  },
  components: {
    SupplyForm,
  },
};
</script>
