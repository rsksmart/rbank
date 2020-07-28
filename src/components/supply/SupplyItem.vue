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
import rifImage from '@/assets/rif.png';

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
      token: {
        name: null,
        symbol: null,
        decimals: 0,
      },
      borrowRate: 0,
      rif: rifImage,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    apr() {
      return this.borrowRate.toFixed(3);
    },
    balance() {
      return (this.tokenBalance / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
    },
    formObject() {
      return {
        accountBalance: this.tokenBalance,
        market: this.market,
        token: this.token,
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
    accountTokenBalance() {
      this.market.token
        .then((tok) => tok.eventualBalanceOf(this.account))
        .then((balance) => {
          this.tokenBalance = balance;
        });
    },
  },
  components: {
    SupplyForm,
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
        return this.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        this.accountTokenBalance();
      });
  },
};
</script>
