<template>
  <v-row class="ma-0 d-flex align-center">
    <v-col cols="2" class="d-flex justify-center">
      <v-img class="ml-5" src="../../../assets/rif.png" width="60"/>
    </v-col>
    <v-col cols="2" class="item">
      <h1 class="ma-0">{{ data.token.symbol }}</h1>
    </v-col>
    <v-col cols="3">
      <v-row>
        <h2>price:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        <span>{{ data.price | formatPrice }}</span><span class="ml-2 itemInfo">usd</span>
      </v-row>
    </v-col>
    <v-col cols="3">
      <v-row>
        <h2>in your wallet:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        {{ data.balanceAsDouble }}<span class="ml-2 itemInfo">usd</span>
      </v-row>
    </v-col>
    <v-col cols="2">
      <v-row>
        <h2>earnings:</h2>
      </v-row>
      <v-row class="item greenish d-flex justify-start">
        {{ earnings }}<span class="ml-2 itemInfo">{{ data.token.symbol }}</span>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SupplyTop',
  data() {
    return {
      earnings: 0,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>
