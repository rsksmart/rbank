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
import PayBorrowForm from '@/components/market/PayBorrowForm.vue';
import rifImage from '@/assets/rif.png';

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
      return this.borrowRate.toFixed(2);
    },
    formObject() {
      return {
        market: this.market,
        token: this.token,
        max: Number(this.maxPayBorrowAllowed) * (10 ** this.token.decimals),
        tokenAccountBalance: this.tokenAccountBalance,
        borrowedByAccount: this.borrowedByAccount,
      };
    },
    maxPayBorrowAllowed() {
      const allowed = this.borrowedByAccount > this.tokenAccountBalance
        ? this.tokenAccountBalance : this.borrowedByAccount;
      return (allowed / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
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
      await this.market.updatedBorrowBy(this.account)
        .then((borrowBy) => {
          this.borrowedByAccount = borrowBy;
        });
    },
    async accountTokenBalance() {
      await this.market.token
        .then((tok) => tok.eventualBalanceOf(this.account))
        .then((balance) => {
          this.tokenAccountBalance = balance;
        });
    },
  },
  components: {
    PayBorrowForm,
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
        this.accountBorrows();
      });
  },
};
</script>
