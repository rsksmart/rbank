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
              Health Factor: {{ factor }} %
            </v-list-item-title>
            <v-list-item-subtitle>
              Account in risk when health factor is bigger than 50%
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
          :value="factor">
          </v-progress-linear>
          <v-card class="d-flex justify-center mx-2" min-width="50"
            color="red lighten-1" flat tile max-height="50">
            <v-card-text class="d-flex justify-center pa-1">
              50 %
            </v-card-text>
          </v-card>
        </div>
      </v-card>
    </div>
    <market-detail-list/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';
import Controller from '@/handlers/controller';
import MarketDetailList from '@/components/lending/MarketDetailList.vue';

export default {
  name: 'DepositLending',
  data() {
    return {
      controller: null,
      accountHealth: null,
      supplied: null,
      borrowed: null,
      liquidity: null,
      marketAddresses: null,
      barColor: null,
    };
  },
  methods: {
    ...mapActions({
      getMarkets: constants.CONTROLLER_GET_MARKETS,
    }),
    calculateHealth() {
      this.barColor = (this.factor <= 50) ? 'light-green darken-4' : 'red';
    },
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    factor() {
      return ((this.borrowed === 0 || this.supplied === 0)
        ? 0 : (this.borrowed / this.supplied) * 100).toFixed(2);
    },
  },
  components: {
    MarketDetailList,
  },
  created() {
    this.controller = new Controller();
    this.controller.getAccountHealth(this.account)
      .then((accountHealth) => {
        this.accountHealth = Number(accountHealth);
      });
    this.controller.getAccountValues(this.account)
      .then(({ supplyValue, borrowValue }) => {
        this.supplied = Number(supplyValue);
        this.borrowed = Number(borrowValue);
        this.calculateHealth();
      });
    this.controller.getLiquidity(this.account)
      .then((liquidity) => {
        this.liquidity = Number(liquidity);
      });
    this.getMarkets();
  },
};
</script>
