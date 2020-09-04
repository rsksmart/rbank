<template>
  <v-card flat class="loader d-flex align-center justify-center">
    <div class="container">
      <v-row class="my-5 d-flex justify-center">
        <v-progress-circular indeterminate :size="80" color="#008CFF"/>
      </v-row>
      <v-row class="mt-5 d-flex justify-center">
        <h1 class="text-center">Awaiting transaction approval</h1>
      </v-row>
      <v-row class="my-3 mx-8 d-flex justify-center">
        <p class="text-center">Check your wallet to complete this transaction!</p>
      </v-row>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'Loader',
};
</script>
