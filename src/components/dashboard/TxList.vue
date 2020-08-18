<template>
  <v-col cols="8" class="mx-6 tx-list container">
    <v-row class="mx-6">
      <v-col cols="8">
        <v-row>
          <h1>Transaction History</h1>
        </v-row>
        <v-row>
          <span>Last updated: {{lastUpdated}}</span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col>
            <v-row>
              <img src="../../assets/myActivity/supplied.svg" alt="">
              <h3 class="mx-2">Supplied</h3>
            </v-row>
            <v-row>
              <img src="../../assets/myActivity/borrowed.svg" alt="">
              <h3 class="mx-2">Borrowed</h3>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <img src="../../assets/myActivity/withdrawn.svg" alt="">
              <h3 class="mx-2">Withdrawn</h3>
            </v-row>
            <v-row>
              <img src="../../assets/myActivity/repay.svg" alt="">
              <h3 class="mx-2">Repayed</h3>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mx-6">
      <v-col>
        <h2>
          Market
        </h2>
      </v-col>
      <v-col>
        <h2>
          Price
        </h2>
      </v-col>
      <v-col>
        <h2>
          APR
        </h2>
      </v-col>
      <v-col>
        <h2>
          Transaction
        </h2>
      </v-col>
    </v-row>
    <v-row class="mx-6">
      <div class="tx-divider"></div>
    </v-row>
    <v-list class="mx-6" v-for="(tx, idx) in transactions"
            :key="`tx-item-${idx}`">
      <tx-item :transactionHash="tx.transactionHash"
               :marketName="tx.market"
               :amount="tx.transactionAmount"
               :apr="tx.apr"
               :price="tx.price"
               :operation="tx.operation"
      />
      <div class="tx-divider"></div>
    </v-list>
  </v-col>
</template>

<script>
import TxItem from '@/components/dashboard/TxItem.vue';

export default {
  name: 'TxList',
  components: {
    TxItem,
  },
  data() {
    return {
      lastUpdated: '',
      transactions: [],
    };
  },
  methods: {
    pushMarketEvents(market, symbol, price, borrowRate) {
      market.events.supply()
        .on('data', ({ event, transactionHash, returnValues: { amount } }) => {
          this.transactions.push(
            {
              market: symbol,
              price,
              apr: borrowRate,
              transactionHash,
              transactionAmount: Number(amount),
              operation: event,
            },
          );
        });
      market.events.borrow()
        .on('data', ({ event, transactionHash, returnValues: { amount } }) => {
          this.transactions.push(
            {
              market: symbol,
              price,
              apr: borrowRate,
              transactionHash,
              transactionAmount: Number(amount),
              operation: event,
            },
          );
        });
      market.events.redeem()
        .on('data', ({ event, transactionHash, returnValues: { amount } }) => {
          this.transactions.push(
            {
              market: symbol,
              price,
              apr: borrowRate,
              transactionHash,
              transactionAmount: Number(amount),
              operation: event,
            },
          );
        });
      market.events.payBorrow()
        .on('data', ({ event, transactionHash, returnValues: { amount } }) => {
          this.transactions.push(
            {
              market: symbol,
              price,
              apr: borrowRate,
              transactionHash,
              transactionAmount: Number(amount),
              operation: event,
            },
          );
        });
    },
    getTransactions() {
      this.$rbank.eventualMarkets
        .then((markets) => {
          markets.forEach((market) => {
            market.eventualToken
              .then((token) => Promise.all([
                token.eventualSymbol,
                this.$rbank.controller.eventualMarketPrice(market.address),
                market.eventualBorrowRate,
              ]))
              .then(([symbol, price, borrowRate]) => {
                this.pushMarketEvents(market, symbol, price, borrowRate);
              });
          });
        });
    },
  },
  created() {
    this.getTransactions();
  },
};
</script>
