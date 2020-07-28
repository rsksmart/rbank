<template>
  <div class="deposit_lending">
    <div class="d-flex justify-space-around my-3">
      <v-card width="20%" class="ma-5">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4">Supplied</div>
            <v-list-item-title class="headline">{{supplied | formatPrice}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card width="20%" class="ma-5">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4">Debt</div>
            <v-list-item-title class="headline">{{borrowed | formatPrice}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card width="20%" class="ma-5">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4">Debt power</div>
            <v-list-item-title class="headline">{{liquidity | formatPrice}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card width="20%" class="ma-5">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4">Earnings</div>
            <v-list-item-title class="headline">...</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
    <div class="d-flex justify-center my-5">
      <v-card width="90%" class="my-auto py-auto">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">
              Health Factor: {{ healthFactor }} %
            </v-list-item-title>
            <v-list-item-subtitle>
              Account in risk when health factor is decreasing
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <div class="d-flex justify-space-around mb-4">
          <v-card class="d-flex justify-center mx-2" min-width="50"
                  color="light-green" flat tile max-height="50">
            <v-card-text class="d-flex justify-center pa-1">
              0 %
            </v-card-text>
          </v-card>
          <v-progress-linear
            background-color="blue-grey lighten-5"
            :color="barColor"
            height="30" stripped
            :value="healthFactor">
          </v-progress-linear>
          <v-card class="d-flex justify-center mx-2" min-width="50"
                  color="red lighten-1" flat tile max-height="50">
            <v-card-text class="d-flex justify-center pa-1">
              100 %
            </v-card-text>
          </v-card>
        </div>
      </v-card>
    </div>
    <market-detail-list/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MarketDetailList from '@/components/lending/MarketDetailList.vue';

export default {
  name: 'DepositLending',
  data() {
    return {
      accountHealth: 0,
      supplied: 0,
      borrowed: 0,
      liquidity: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    healthFactor() {
      return this.accountHealth.toFixed(2);
    },
    barColor() {
      switch (true) {
        case (this.healthFactor >= 50):
          return 'light-green darken-4';
        default:
          return 'red';
      }
    },
  },
  components: {
    MarketDetailList,
  },
  created() {
    this.$rbank.controller.getAccountValues(this.account)
      .then(({ supplyValue, borrowValue }) => {
        this.supplied = supplyValue;
        this.borrowed = borrowValue;
        return this.$rbank.controller.getAccountLiquidity(this.account);
      })
      .then((liquidity) => {
        this.liquidity = liquidity;
        return this.$rbank.controller.getAccountHealth(this.account);
      })
      .then((accountHealth) => {
        this.accountHealth = accountHealth * 100;
      });
  },
};
</script>
