<template>
  <v-container fluid>
    <v-row>
      <h2>Controller data</h2>
    </v-row>
    <v-form ref="form" :lazy-validation="true">
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="collateralFactor"
            label="Collateral Factor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="liquidationFactor"
            label="Liquidation Factor"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-btn
          class="success"
          @click="setFactors">
          Set Factors
        </v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import Controller from '@/handlers/controller';

export default {
  name: 'ControllerForm',
  data() {
    return {
      controller: null,
      collateralFactor: null,
      liquidationFactor: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    setFactors() {
      this.controller
        .setCollateralFactor(this.account, this.collateralFactor);
      this.controller
        .setLiquidationFactor(this.account, this.liquidationFactor);
    },
  },
  created() {
    this.controller = new Controller();
    this.controller.eventualCollateralFactor
      .then((collateralFactor) => {
        this.collateralFactor = collateralFactor;
      });
    this.controller.eventualLiquidationFactor
      .then((liquidationFactor) => {
        this.liquidationFactor = liquidationFactor;
      });
  },
};
</script>
