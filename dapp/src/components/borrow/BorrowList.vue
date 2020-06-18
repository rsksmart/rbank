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
                <v-list-item-subtitle class="text-center">Available for you</v-list-item-subtitle>
              </v-col>
              <v-col cols="4">
                <v-list-item-subtitle class="text-center">APR%</v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item>
          <borrow-item v-for="(market, idx) in markets"
                       :key="`market-item-${idx}`" :market="market"/>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import BorrowItem from '@/components/borrow/BorrowItem.vue';
import { mapState } from 'vuex';

export default {
  name: 'BorrowList',
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
  },
  components: {
    BorrowItem,
  },
};
</script>
