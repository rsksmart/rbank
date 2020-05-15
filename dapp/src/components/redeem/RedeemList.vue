<template>
  <div class="RedeemList">
    <v-container fluid class="d-flex justify-center">
      <v-card width="70%" elevation="0">
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
          <redeem-item v-for="(redeem, idx) in redeemList"
                       :key="`redeem-item-${idx}`" :redeem="redeem"/>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import RedeemItem from '@/components/redeem/RedeemItem.vue';

export default {
  name: 'RedeemList',
  props: {
    redeemList: {
      type: Array,
      required: true,
    },
  },
  components: {
    RedeemItem,
  },
};
</script>
´
