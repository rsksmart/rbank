<template>
  <v-card flat height="400" class="d-flex align-center justify-center">
    <div>
      <v-row class="my-5 d-flex justify-center">
        <v-progress-circular indeterminate :size="80" color="#008CFF"/>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <h1>Connecting...</h1>
      </v-row>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'Loader',
};
</script>
