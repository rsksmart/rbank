<template>
  <v-row class="d-flex justify-center align-center">
    <v-col cols="2"/>
    <v-col class="itemInfo">
      transaction hash: {{ hashCutOff }}
    </v-col>
    <v-col class="ml-1">
      <v-icon small>content_copy</v-icon>
      <a class="ml-2 listTitle" target="_blank" :href="rskExplorerUrl">View on RSKExplorer</a>
    </v-col>
    <v-col cols="1"/>
  </v-row>
</template>

<script>
export default {
  name: 'TransactionHash',
  props: {
    hash: {
      type: String,
      required: true,
    },
  },
  computed: {
    hashCutOff() {
      return `${this.hash.substring(0, 4)}...${this.hash
        .substring(this.hash.length - 4, this.hash.length)}`;
    },
    rskExplorerUrl() {
      return `https://explorer.testnet.rsk.co/tx/${this.hash}`;
    },
  },
};
</script>
