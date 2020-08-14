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
      transactions: [
        {
          market: 'TK1',
          price: 1500,
          apr: 4.3,
          transactionHash: 'ox2cb3a4mncmdmd',
          transactionAmount: 4.65,
          operation: 'Borrow',
        },
      ],
    };
  },
};
</script>
