<template>
  <v-container fluid>
    <v-row>
      <h2>Controller data</h2>
    </v-row>
    <v-form ref="form" :lazy-validation="true">
      <v-row>
        <v-col cols="6">
          <v-text-field
            :value="colFac"
            @input="collateralFactor = $event"
            label="Collateral Factor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            :value="liqFac"
            @input="liquidationFactor = $event"
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
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'ControllerForm',
  data() {
    return {
      collateralFactor: null,
      liquidationFactor: null,
    };
  },
  computed: {
    ...mapState({
      colFac: (state) => state.Controller.collateralFactor,
      liqFac: (state) => state.Controller.liquidationFactor,
    }),
  },
  methods: {
    ...mapActions({
      loadCollateral: constants.CONTROLLER_LOAD_COLLATERAL_FACTOR,
      loadLiquidation: constants.CONTROLLER_LOAD_LIQUIDATION_FACTOR,
      setCollateral: constants.CONTROLLER_SET_COLLATERAL_FACTOR,
      setLiquidation: constants.CONTROLLER_SET_LIQUIDATION_FACTOR,
    }),
    setFactors() {
      this.setCollateral(this.collateralFactor);
      this.setLiquidation(this.liquidationFactor);
    },
  },
  created() {
    this.loadCollateral();
    this.loadLiquidation();
  },
};
</script>
