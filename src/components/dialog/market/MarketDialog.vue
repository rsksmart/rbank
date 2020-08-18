<template>
  <v-dialog v-model="data.flag" width="600">
    <v-card class="marketDialog container">
      <h1>market</h1>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MarketDialog',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      succeed: false,
      waiting: false,
    };
  },
};
</script>
