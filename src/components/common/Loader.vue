<template>
  <v-card flat height="400" class="loader d-flex align-center justify-center">
    <div>
      <v-row class="my-5 d-flex justify-center">
        <v-progress-circular indeterminate :size="80" color="#008CFF"/>
      </v-row>
      <v-row class="mt-5 d-flex justify-center">
        <h1>Awaiting transaction approval</h1>
      </v-row>
      <v-row class="mt-3 d-flex justify-center">
        <p>Check your wallet to complete this transaction!</p>
      </v-row>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'Loader',
};
</script>
