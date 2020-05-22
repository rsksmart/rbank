<template>
  <div class="LiquidatedItem">
    <v-card class="mt-5" outlined>
      <v-list-item @click="buyLiquidation(liquidated.address)">
        <v-row>
          <v-col cols="3" class="d-flex justify-center">
            <v-list-item-avatar>
              <v-img :src="liquidated.icon"/>
            </v-list-item-avatar>
          </v-col>
          <v-col cols="6">
            <v-list-item-content>
              <v-list-item-title class="left">
                {{ liquidated.address }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="3">
            <v-list-item-content>
              <v-list-item-title  class="text-center">
                {{ liquidated.quantity }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
    <template v-if="flag">
      <liquidated-form :accountAddress="liquidated.address"/>
    </template>
  </div>
</template>

<script>
import LiquidatedForm from '@/components/market/LiquidatedForm.vue';

export default {
  name: 'LiquidatedItem',
  props: {
    liquidated: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
    };
  },
  methods: {
    buyLiquidation(accountAddress) {
      this.flag = !this.flag;
      console.log(`Liquidated of account ${accountAddress}`);
    },
  },
  components: {
    LiquidatedForm,
  },
};
</script>
