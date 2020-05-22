<template>
  <div class="RedeemList">
    <v-container fluid class="d-flex justify-center">
      <v-card width="80%" elevation="0">
        <v-list>
          <v-list-item>
            <v-row>
              <v-col cols="3">
                <v-list-item-subtitle class="text-center">Assets</v-list-item-subtitle>
              </v-col>
              <v-col cols="6">
                <v-list-item-subtitle class="text-center">Addresses</v-list-item-subtitle>
              </v-col>
              <v-col cols="3">
                <v-list-item-subtitle class="text-center">Quantity</v-list-item-subtitle>
              </v-col>
            </v-row>
          </v-list-item>
          <liquidated-item v-for="(liquidated, idx) in liquidatedList"
                       :key="`liquidated-item-${idx}`" :liquidated="liquidated"/>
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
    liquidatedList: {
      type: Array,
      required: true,
    },
  },
  components: {
    LiquidatedItem,
  },
};
</script>
´
