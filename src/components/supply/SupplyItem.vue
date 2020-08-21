<template>
  <div class="dialog">
    <v-list-item>
      <v-row class="my-5 mx-0 d-flex align-center">
        <v-col cols="3">
          <v-row class="d-flex align-center">
            <v-col cols="6" class="pa-0 d-flex justify-end">
              <v-list-item-avatar tile size="40">
                <v-img src="../../assets/rif.png"/>
              </v-list-item-avatar>
            </v-col>
            <v-col cols="6" class="pa-0 d-flex justify-start">
              <v-list-item-subtitle class="item d-flex justify-start">
                {{ token.symbol }}
              </v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3">
          <v-list-item-subtitle class="item">
            {{ price | formatPrice }}<span class="ml-2 itemInfo">usd</span>
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="2">
          <v-list-item-subtitle class="item">
            {{ apr }}%
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="4" class="px-0">
          <v-row class="ma-0">
            <v-col cols="9" class="pa-0 d-flex align-center">
              <v-list-item-subtitle class="item">
                {{ tokenBalance | formatToken(token.decimals) }}
              </v-list-item-subtitle>
            </v-col>
            <v-col cols="3" class="pa-0">
              <v-btn class="pa-0" @click="dialog = !dialog" icon>
                <svg width="11" height="32" viewBox="0 0 11 32" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L9 16L1 31" stroke="#008CFF" stroke-width="2"
                        stroke-linecap="round"/>
                </svg>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-list-item>
    <v-divider/>
    <supply-dialog :data="dataObject" @closeDialog="reset"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SupplyDialog from '@/components/dialog/supply/SupplyDialog.vue';

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
      token: {
        name: null,
        symbol: null,
        decimals: 0,
      },
      price: 0,
      borrowRate: 0,
      dialog: false,
      tokenBalance: 0,
      currentComponent: 'SupplyList',
      supplyValue: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    apr() {
      return this.borrowRate.toFixed(2);
    },
    dataObject() {
      return {
        flag: this.dialog,
        borrowRate: this.borrowRate,
        price: this.price,
        token: this.token,
        market: this.market,
      };
    },
  },
  methods: {
    reset() {
      this.dialog = false;
      this.$rbank.controller.eventualMarketPrice(this.market.address)
        .then((marketPrice) => {
          this.price = marketPrice;
          return this.market.eventualBorrowRate;
        })
        .then((borrowRate) => {
          this.borrowRate = borrowRate;
          return this.market.eventualToken;
        })
        .then((tok) => tok.eventualBalanceOf(this.account))
        .then((tokenBalance) => {
          this.tokenBalance = tokenBalance;
        });
      this.$emit('dialogClosed');
    },
  },
  components: {
    SupplyDialog,
  },
  created() {
    this.market.eventualToken
      .then((tok) => [
        tok.eventualName,
        tok.eventualSymbol,
        tok.eventualDecimals,
        tok.eventualBalanceOf(this.account),
      ])
      .then((results) => Promise.all(results))
      .then(([name, symbol, decimals, balance]) => {
        this.token.name = name;
        this.token.symbol = symbol;
        this.token.decimals = decimals;
        this.tokenBalance = balance;
        return this.$rbank.controller.eventualMarketPrice(this.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        return this.market.updatedSupplyOf(this.account);
      })
      .then((supplyOf) => {
        this.supplyOf = supplyOf;
      });
  },
};
</script>
