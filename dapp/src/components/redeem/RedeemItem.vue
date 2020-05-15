<template>
  <div class="RedeemItem">
    <v-card class="ma-5" outlined>
      <v-list-item @click="buyLiquidation(redeem.address)">
        <v-row>
          <v-col cols="3" class="d-flex justify-center">
            <v-list-item-avatar>
              <v-img :src="redeem.icon"/>
            </v-list-item-avatar>
          </v-col>
          <v-col cols="6">
            <v-list-item-content>
              <v-list-item-title class="left">
                {{ redeem.address }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="3">
            <v-list-item-content>
              <v-list-item-title  class="text-center">
                {{ redeem.quantity }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'RedeemItem',
  props: {
    redeem: {
      type: Object,
      required: true,
    },
  },
  methods: {
    buyLiquidation(accountAddress) {
      console.log(`Redeem buy liquidation of account ${accountAddress}`);
    },
  },
};
</script>
