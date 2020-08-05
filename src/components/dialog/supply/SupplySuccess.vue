<template>
  <div>
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">
          You have successfully supplied <br> this Market with
          <span class="greenish">
                {{ data.amount }} {{ data.token.symbol }}
              </span>
        </div>
      </v-row>
    </div>
    <div class="my-5 py-5">
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>in your wallet:</h3>
        </v-col>
        <v-col cols="4">
          <v-row class="ma-0 d-flex align-center">
            <v-col cols="7">
              <h1>{{ data.balanceAsDouble }}</h1>
            </v-col>
            <v-col cols="5" class="itemInfo">
              <span v-if="data.supplyBalanceInfo">(-{{ data.supplyBalanceInfo }})</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>supply balance:</h3>
        </v-col>
        <v-col cols="4">
          <v-row class="ma-0 d-flex align-center">
            <v-col cols="7">
              <h1>{{ data.supplied }}</h1>
            </v-col>
            <v-col cols="5" class="itemInfo">
              <span v-if="data.supplyBalanceInfo">(+{{ data.supplyBalanceInfo }})</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex align-end justify-end">
          <h3>borrow limit:</h3>
        </v-col>
        <v-col cols="4">
          <v-row class="ma-0 d-flex align-center">
            <v-col cols="7">
              <h1>{{ data.maxBorrowAllowed }}</h1>
            </v-col>
            <v-col cols="5" class="itemInfo">
              <span v-if="data.borrowLimitInfo">(+{{ data.borrowLimitInfo }})</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
    </div>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="2"/>
      <v-col class="itemInfo">
        transaction hash: {{ hashCutOff }}
      </v-col>
      <v-col class="ml-1">
        <v-icon small>content_copy</v-icon>
        <a class="listTitle" target="_blank" :href="rskExplorerUrl">View on RSKExplorer</a>
      </v-col>
      <v-col cols="1"/>
    </v-row>
    <v-row class="my-5 d-flex justify-center">
      <v-btn class="button" rounded color="#008CFF" @click="closeDialog">
        Back to Supply / Borrow
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'SupplySuccess',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hashCutOff() {
      return `${this.data.hash.substring(0, 4)}...${this.data.hash
        .substring(this.data.hash.length - 4, this.data.hash.length)}`;
    },
    rskExplorerUrl() {
      return `https://explorer.rsk.co/tx/${this.data.hash}`;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>
