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
                {{ maxPayBorrowAllowed }}
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
      <pay-borrow-form @formSucceed="reset" :data="formObject"/>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Market from '@/handlers/market';
import Token from '@/handlers/token';
import PayBorrowForm from '@/components/market/PayBorrowForm.vue';

export default {
  name: 'PayBorrowItem',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
      borrowedByAccount: null,
      tokenAccountBalance: null,
    };
  },
  computed: {
    ...mapState({
      factor: (state) => state.Controller.factor,
      account: (state) => state.Session.account,
    }),
    apr() {
      return ((this.market.borrowRate * 100) / this.factor).toFixed(2);
    },
    formObject() {
      return {
        market: this.market,
        max: Number(this.maxPayBorrowAllowed) * (10 ** this.market.token.decimals),
        tokenAccountBalance: this.tokenAccountBalance,
        borrowedByAccount: this.borrowedByAccount,
      };
    },
    maxPayBorrowAllowed() {
      const allowed = this.borrowedByAccount > this.tokenAccountBalance
        ? this.tokenAccountBalance : this.borrowedByAccount;
      return (allowed / (10 ** this.market.token.decimals))
        .toFixed(this.market.token.decimals);
    },
  },
  methods: {
    reset() {
      this.flag = false;
      this.accountTokenBalance();
      this.accountBorrows();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    async accountBorrows() {
      const market = new Market(this.market.address);
      return market.getUpdatedBorrowBy(this.account)
        .then((borrowBy) => {
          this.borrowedByAccount = Number(borrowBy);
          return this.borrowedByAccount;
        });
    },
    async accountTokenBalance() {
      const token = new Token(this.market.token.address);
      await token.balanceOf(this.account)
        .then((balance) => {
          this.tokenAccountBalance = Number(balance);
          return this.tokenAccountBalance;
        });
    },
  },
  components: {
    PayBorrowForm,
  },
  created() {
    this.accountTokenBalance();
    this.accountBorrows();
  },
};
</script>
