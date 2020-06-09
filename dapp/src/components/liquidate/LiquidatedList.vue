<template>
  <div class="RedeemList" v-if="unhealthyAccounts.length > 0">
    <v-container fluid class="d-flex justify-center">
      <v-card width="80%" elevation="3">
        <h2 class="px-2"> Market {{token}}</h2>
          <v-row>
            <v-col cols="6" class="pa-0 text-center">
              Address
            </v-col>
            <v-col cols="3" class="pa-0 text-center">
              Debt
            </v-col>
            <v-col cols="3" class="pa-0 text-center">
              Price
            </v-col>
          </v-row>
        <v-list class="pa-0">
          <liquidated-item v-for="(account, idx) in unhealthyAccounts"
                           :key="`liquidated-item-${account}-${idx}`"
                           :account="account" :marketAddress="marketAddress"
                           :tokenSymbol="token"/>
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
    marketAddress: {
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
    LiquidatedItem,
  },
  methods: {
    getSymbol() {
      this.marketContract.eventualTokenAddress
        .then((tokenAddress) => new Token(tokenAddress).eventualSymbol)
        .then((symbol) => { this.token = symbol; });
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
      this.unhealthyAccounts = this.unhealthyAccounts
        .filter((account, index) => this.unhealthyAccounts.indexOf(account) === index);
    },
  },
  created() {
    this.marketContract = new Market(this.marketAddress);
    this.getSymbol();
    this.getBorrowEvents();
  },
};
</script>
´
