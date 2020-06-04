<template>
  <div class="RedeemList">
    <v-container fluid class="d-flex justify-center">
      <v-card width="80%" elevation="3">
        <v-card-title> Market {{token}}</v-card-title>
        <v-list>
          <v-list-item>
            <v-row>
              <v-col cols="6">
                <v-list-item-subtitle class="text-center">Address
                </v-list-item-subtitle>
              </v-col>
              <v-col cols="3">
                <v-list-item-subtitle class="text-center">Debt
                </v-list-item-subtitle>
              </v-col>
              <v-col cols="3">
                <v-list-item-subtitle class="text-center">price
                </v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item>
          <liquidated-item v-for="(account, idx) in unhealthyAccounts"
                           :key="`liquidated-item-${account}-${idx}`"
                           :account="account" :marketAddress="market"/>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import LiquidatedItem from '@/components/liquidate/LiquidatedItem.vue';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'LiquidatedList',
  props: {
    market: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      marketContract: null,
      token: '',
      borrowEvents: [],
      unhealthyAccounts: [],
    };
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    LiquidatedItem,
  },
  methods: {
    getSymbol() {
      this.marketContract.eventualTokenAddress
        .then((tokenAddress) => new Token(tokenAddress).eventualSymbol)
        // eslint-disable-next-line no-return-assign
        .then((symbol) => this.token = symbol);
    },
    getBorrowEvents() {
      this.marketContract.getBorrowEvents()
        .then((events) => {
          this.borrowEvents = events;
          this.getUnhealthyAccounts();
        });
    },
    getUnhealthyAccounts() {
      this.unhealthyAccounts = this.borrowEvents.map((e) => e.returnValues.user);
      // eslint-disable-next-line max-len
      this.unhealthyAccounts = this.unhealthyAccounts.filter((account, index) => this.unhealthyAccounts.indexOf(account) === index);
    },
  },
  created() {
    this.marketContract = new Market(this.market);
    this.getSymbol();
    this.getBorrowEvents();
  },
};
</script>
´
