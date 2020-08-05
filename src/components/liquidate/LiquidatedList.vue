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
          <liquidated-item v-for="(borrower, idx) in unhealthyAccounts"
                           :key="`liquidated-item-${borrower}-${idx}`"
                           :borrower="borrower" :marketAddress="marketAddress"
                           :tokenSymbol="token"/>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import _ from 'lodash';
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
    getSymbol() {
      this.marketContract.eventualToken
        .then((token) => token.eventualSymbol)
        .then((symbol) => { this.token = symbol; });
    },
    getUnhealthyAccounts() {
      this.marketContract.getPastEvents('Borrow', 0)
        .then((borrowEvents) => borrowEvents.map((e) => e.returnValues.user))
        .then((borrowAccounts) => {
          const accounts = borrowAccounts
            .filter((account, index) => borrowAccounts.indexOf(account) === index);
          const accountsHealthPromises = _.range(accounts.length)
            .map((acc, index) => this.$rbank.controller.getAccountHealth(accounts[index]));
          Promise.all(accountsHealthPromises)
            .then((accountsHealth) => {
              this.unhealthyAccounts = accounts
                .filter((account, index) => accountsHealth[index] >= 0);
            });
        })
        .catch(console.error);
    },
  },
  created() {
    this.marketContract = new this.$rbank.Market(this.marketAddress);
    this.getSymbol();
    this.getUnhealthyAccounts();
  },
};
</script>
´
