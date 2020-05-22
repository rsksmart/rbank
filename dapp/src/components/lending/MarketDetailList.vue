<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col v-for="marketAddress in marketAddresses" :key="marketAddress" cols="4">
          <market-detail :marketAddress="marketAddress"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MarketDetail from '@/components/lending/MarketDetail.vue';

export default {
  name: 'MarketDetailList',
  props: {
    marketAddresses: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    MarketDetail,
  },
};
</script>
