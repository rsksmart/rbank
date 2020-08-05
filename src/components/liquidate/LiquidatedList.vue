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
    getHealth(account) {
      return new Promise((resolve, reject) => {
        this.controller.getAccountValues(account)
          .then(({ supplyValue, borrowValue }) => {
            const supplied = Number(supplyValue);
            const borrowed = Number(borrowValue);
            const factor = (borrowed === 0 || supplied === 0)
              ? 0 : (borrowed / supplied) * 100;
            resolve(factor);
          })
          .catch(reject);
      });
    },
    getSymbol() {
      this.marketContract.eventualTokenAddress
        .then((tokenAddress) => new this.$rbank.Token(tokenAddress).eventualSymbol)
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
        .filter((account, index) => this.unhealthyAccounts.indexOf(account) === index)
        .filter((account) => this.getHealth(account) >= 50);
    },
  },
  created() {
    this.marketContract = new this.$rbank.Market(this.marketAddress);
    this.getSymbol();
    this.getBorrowEvents();
  },
};
</script>
´
