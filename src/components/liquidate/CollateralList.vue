<template>
  <div>
    <div v-for="(token, idx) in collaterals"
         :key="`collateral-${borrower}-${idx}`">
      <v-list-item>
        <v-row>
          <v-col class="font-weight-bold text-center">
            {{token.symbol}}
          </v-col>
          <v-col cols="2" class="pa-0">
            <v-text-field class="pa-0"
                          v-model="token.amount"
                          type="number">
            </v-text-field>
          </v-col>
          <v-col class="text-center">
            {{token.maxAllowed}}
          </v-col>
        </v-row>
      </v-list-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollateralList',
  props: {
    collaterals: {
      type: Array,
      required: true,
    },
    borrower: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
