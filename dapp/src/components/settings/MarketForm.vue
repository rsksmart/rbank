<template>
  <div class="MarketForm">
    <v-container fluid>
      <v-row>
        <h2>Add a new Market</h2>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-form ref="form" :lazy-validation="true">
            <v-text-field
              v-model="newMarket.tokenAddress"
              label="Token Base Address"
              required
            ></v-text-field>
            <v-text-field
              v-model="newMarket.marketBaseBorrowRate"
              label="Market Base Borrow Rate"
              type="number"
              required
            ></v-text-field>
            <v-btn color="success" @click="create">
              Create Market
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'MarketForm',
  data() {
    return {
      newMarket: {
        tokenAddress: null,
        marketBaseBorrowRate: null,
      },
    };
  },
  methods: {
    ...mapActions({
      createMarket: constants.CONTROLLER_CREATE_MARKET,
    }),
    create() {
      console.log(this.newMarket);
      this.createMarket(this.newMarket);
      // this.$refs.form.reset();
    },
  },
};
</script>
