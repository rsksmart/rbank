<template>
  <div class="error-dialog">
    <v-row class="my-5 pb-5 d-flex justify-center">
      <h2 class="text-center">RBank</h2>
    </v-row>
    <v-row class="ma-0 py-5 d-flex justify-center">
      <v-icon color="#EB5757" x-large fab>error_outline</v-icon>
    </v-row>
    <v-row class="ma-0 pt-5 d-flex justify-center">
      <h1 class="text-center">Something went wrong...</h1>
    </v-row>
    <v-row class="my-3 d-flex justify-center">
      <p class="text-center">We were unable to complete <br> this transaction. Please try again</p>
    </v-row>
    <v-row class="my-5 pt-5 d-flex justify-center">
      <v-btn class="button" rounded color="#008CFF" @click="closeDialog">
        Back
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ErrorDialog',
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>
