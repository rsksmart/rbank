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
      <supply-form @formSucceed="reset" :data="formObject"/>
    </template>
  </div>
</template>

<script>
import SupplyForm from '@/components/market/SupplyForm.vue';
import { mapState } from 'vuex';
import Token from '@/handlers/token';

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
      tokenBalance: 0,
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
    balance() {
      return (this.tokenBalance / (10 ** this.market.token.decimals))
        .toFixed(this.market.token.decimals);
    },
    formObject() {
      return {
        market: this.market,
        accountBalance: Number(this.tokenBalance),
      };
    },
  },
  methods: {
    reset() {
      this.flag = false;
      this.accountTokenBalance();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    async accountTokenBalance() {
      const token = new Token(this.market.token.address);
      await token.balanceOf(this.account)
        .then((balance) => {
          this.tokenBalance = Number(balance);
          return this.tokenBalance;
        });
    },
  },
  components: {
    SupplyForm,
  },
  mounted() {
    this.accountTokenBalance();
  },
};
</script>
