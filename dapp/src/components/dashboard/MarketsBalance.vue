<template>
  <div>
    <div class="d-flex justify-center">
      <h1>Balance</h1>
    </div>
    <v-container fluid>
      <v-row>
        <v-col v-for="marketAddress in marketAddresses" :key="marketAddress" cols="4">
          <market-balance-item :marketAddress="marketAddress"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MarketBalanceItem from '@/components/dashboard/MarketBalanceItem.vue';

export default {
  name: 'MarketsBalance',
  props: {
    marketAddresses: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    MarketBalanceItem,
  },
};
</script>
