<template>
  <div class="container">
    <v-row class="mt-12 d-flex justify-center">
      <h1 class="blueish">Success!</h1>
    </v-row>
    <v-row class="my-6 d-flex justify-center">
      <div class="text-center">
        You have successfully <br> changed the price to <br>
        <span class="greenish"> {{ price | formatPrice }} USD</span>
      </div>
    </v-row>
    <v-row class="marketDialog mb-1 d-flex justify-center">
      <v-btn class="button" color="#008CFF" @click="close">
        Back to market
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'MarketSuccessPrice',
  props: {
    price: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('closed');
    },
  },
};
</script>
