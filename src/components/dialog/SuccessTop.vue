<template>
  <v-row class="mx-5 d-flex align-center justify-center">
    <v-col cols="2" class="d-flex justify-center">
      <v-img class="ml-5" src="../../assets/rif.png" width="60"/>
    </v-col>
    <v-col cols="3" class="item">
      <h1 class="ma-0">{{ data.token.symbol }}</h1>
    </v-col>
    <v-col cols="4">
      <v-row>
        <h2>price:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        <span>{{ data.price | formatPrice }}</span><span class="ml-2 itemInfo">usd</span>
      </v-row>
    </v-col>
    <v-col cols="2">
      <v-row>
        <h2>apr:</h2>
      </v-row>
      <v-row class="item d-flex justify-start">
        {{ data.apr }}%
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SuccessTop',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>
