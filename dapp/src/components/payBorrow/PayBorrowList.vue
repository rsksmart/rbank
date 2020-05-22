<template>
  <div>
    <v-container fluid class="d-flex justify-center">
      <v-card width="80%" elevation="0">
        <v-list>
          <v-list-item>
            <v-row>
              <v-col cols="4">
                <v-list-item-subtitle class="text-center">Assets</v-list-item-subtitle>
              </v-col>
              <v-col cols="4">
                <v-list-item-subtitle class="text-center">Your current debt</v-list-item-subtitle>
              </v-col>
              <v-col cols="4">
                <v-list-item-subtitle class="text-center">APR%</v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item>
          <pay-borrow-item v-for="(market, idx) in marketAddresses"
                       :key="`market-item-${idx}`" :marketAddress="market"/>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import PayBorrowItem from '@/components/payBorrow/PayBorrowItem.vue';

export default {
  name: 'PayBorrowList',
  props: {
    marketAddresses: {
      type: Array,
      required: true,
    },
  },
  components: {
    PayBorrowItem,
  },
};
</script>

<style scoped>

</style>
