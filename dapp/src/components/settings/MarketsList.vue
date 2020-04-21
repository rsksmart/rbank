<template>
  <div>
    <h2 class="d-flex justify-center text-center">Current Markets</h2>
    <div class="d-flex justify-center">
      <v-card width="70%">
          <v-list>
            <v-list-item>
              <v-list-item-subtitle class="text-center">Symbol</v-list-item-subtitle>
              <v-list-item-subtitle class="text-center">Asset</v-list-item-subtitle>
              <v-list-item-subtitle class="text-center">Borrows</v-list-item-subtitle>
              <v-list-item-subtitle class="text-center">Supplies</v-list-item-subtitle>
              <v-list-item-subtitle class="text-center">Price</v-list-item-subtitle>
            </v-list-item>
            <market-list-item v-for="(marketAddress, idx) in marketAddresses"
              :key="`market-list-item-${idx}`" :marketAddress="marketAddress"
              :eventualPrice="controller.getPrice(marketAddress)"/>
          </v-list>
        </v-card>
      </div>
  </div>
</template>

<script>
import Controller from '@/handlers/controller';
import MarketListItem from '@/components/settings/MarketListItem.vue';

export default {
  name: 'MarketsList',
  data() {
    return {
      controller: null,
    };
  },
  props: {
    marketAddresses: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    MarketListItem,
  },
  created() {
    this.controller = new Controller();
  },
};
</script>
