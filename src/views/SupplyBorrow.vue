<template>
  <div class="supplyBorrow">
    <h1 class="text-center">Invest Or Borrow In Just A Few Clicks.</h1>
    <v-row class="my-5 d-flex justify-center">
      <div class="healthBorder d-flex justify-center">
        <div class="mx-3">
          Health Factor:
          <span class="ml-2 healthFactor" :style="{ color: healthFactorColor }">
            {{ healthFactor }}%
          </span>
        </div>
      </div>
      <v-tooltip right color="#E5E5E5">
        <template v-slot:activator="{ on, attrs }">
          <v-icon small class="mx-5" v-bind="attrs" v-on="on">info</v-icon>
        </template>
        <div class="tooltip">
          Your Health Factor represents <br> the state of your loans.
          <span class="boldie"> Don't <br> let it drop to
          <span class="redish"> 0% </span></span>
          or your <br> collateral might be liquidated!
        </div>
      </v-tooltip>
    </v-row>
    <v-row class="d-flex justify-center">
      <div class="toggle my-5">
        <v-btn :class="[ currentComponent === 'SupplyList' ? 'selected' : 'notSelected']"
               text @click="currentComponent = 'SupplyList'">
          <span>Supply</span>
        </v-btn>
        <v-btn :class="[ currentComponent === 'BorrowList' ? 'selected' : 'notSelected']"
               text @click="currentComponent = 'BorrowList'">
          <span>Borrow</span>
        </v-btn>
      </div>
    </v-row>
    <v-row class="my-5 d-flex justify-center">
      <component :is="currentComponent"/>
    </v-row>
  </div>
</template>

<script>
import SupplyList from '@/components/supplyBorrow/supply/SupplyList.vue';
import BorrowList from '@/components/supplyBorrow/borrow/BorrowList.vue';
import { mapState } from 'vuex';

export default {
  name: 'SupplyBorrow',
  data() {
    return {
      accountHealth: 1,
      currentComponent: 'SupplyList',
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    healthFactor() {
      return this.accountHealth * 100;
    },
    healthFactorColor() {
      if (this.accountHealth <= 0.3) return '#EB5757';
      if (this.accountHealth > 0.3 && this.accountHealth <= 0.6) return '#F2994A';
      return '#24BD6B';
    },
  },
  components: {
    SupplyList,
    BorrowList,
  },
  created() {
    this.$rbank.controller.getAccountHealth(this.account)
      .then((accountHealth) => {
        this.accountHealth = accountHealth;
      });
  },
};
</script>
