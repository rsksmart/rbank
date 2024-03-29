<template>
  <div>
    <div v-if="hasAccounts" class="liquidate-list">
      <v-row class="d-flex justify-center">
        <h1>Select the collaterals you wish to liquidate:</h1>
      </v-row>
      <div class="container">
        <v-row>
          <v-col class="d-flex justify-center">
            <h2>Address</h2>
          </v-col>
          <v-col class="d-flex justify-center">
            <h2>Collateral to be Liquidated</h2>
          </v-col>
        </v-row>
        <v-row class="ma-0 px-6">
          <v-divider/>
        </v-row>
        <v-list class="mx-6" v-for="(borrow, idx) in borrows"
                :key="`liquidate-item-${idx}`">
          <liquidate-item :borrower="borrow.borrower"
                          :maxToLiquidate="borrow.maxToLiquidate"
                          :debt="borrow.debt"
                          :borrowMarketAddress="borrow.borrowMarketAddress"
                          :collateral="data"
                          @selected="accountSelected"
          />
          <v-divider/>
        </v-list>
      </div>
    </div>
    <div v-else class="py-6 empty-liquidate">
      <v-row class="my-6 d-flex justify-center">
        <v-icon class="d-flex justify-center" x-large color="#000000">
          error_outline
        </v-icon>
      </v-row>
      <v-row class="ma-6 d-flex justify-center">
        <h1>There are no accounts available to be liquidated</h1>
      </v-row>
      <v-row class="my-6 d-flex justify-center">
        Please check later.
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LiquidateItem from '@/components/dialog/liquidate/LiquidateItem.vue';

export default {
  name: 'LiquidateList.vue',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: {
    LiquidateItem,
  },
  data() {
    return {
      borrows: [],
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    hasAccounts() {
      return this.borrows.length > 0;
    },
  },
  methods: {
    accountSelected(accountObject) {
      this.$emit('selected', accountObject);
    },
    getUnhealthyAccounts(market) {
      market.getPastEvents('Borrow', 0)
        .then((borrowEvents) => {
          const accounts = [];
          const uniqueBorrows = [];
          const borrowsTemp = borrowEvents
            .map(({ address, returnValues: { user } }) => ({
              borrower: user,
              borrowMarketAddress: address,
            }))
            .filter((borrow) => borrow.borrower !== this.account);
          borrowsTemp.forEach((borrow) => {
            if (accounts.indexOf(borrow.borrower) === -1) {
              accounts.push(borrow.borrower);
              uniqueBorrows.push(borrow);
            }
          });
          return uniqueBorrows;
        })
        .then((borrows) => Promise.all([Promise.all(borrows
          .map((borrow) => this.$rbank.controller.getAccountHealth(borrow.borrower))), borrows]))
        .then(([accountsHealth, borrows]) => borrows
          .map((borrow, idx) => ({ health: accountsHealth[idx], ...borrow }))
          .filter((borrow) => borrow.health <= 0))
        .then((borrows) => Promise.all([
          borrows,
          Promise.all(borrows.map((borrow) => new this.$rbank.Market(borrow.borrowMarketAddress)
            .updatedBorrowBy(borrow.borrower))),
          Promise.all(borrows.map((borrow) => this.data.market.updatedSupplyOf(borrow.borrower))),
        ]))
        .then(([borrows, debtsBy, suppliesOf]) => borrows
          .map((borrow, idx) => ({
            debt: debtsBy[idx],
            maxToLiquidate: suppliesOf[idx],
            ...borrow,
          })).forEach((borrow) => this.borrows.push(borrow)));
    },
    getBorrows() {
      this.$rbank.eventualMarkets
        .then((markets) => markets.filter((market) => market.address !== this.data.market.address))
        .then((markets) => markets
          .forEach((market) => this.getUnhealthyAccounts(market)));
    },
  },
  created() {
    this.getBorrows();
  },
};
</script>
