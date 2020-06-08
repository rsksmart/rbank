<template>
  <v-container fluid>
    <v-row>
      <h2>Controller data</h2>
    </v-row>
    <v-row>
      <v-col cols="5" class="mx-5">
        <v-form ref="form" :lazy-validation="true">
          <v-row>
            <v-text-field
              v-model="liquidationFactor"
              label="Liquidation Factor"
              type="number"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-btn
              class="success"
              @click="setLiquidationFactor">
              Set Liquidation
            </v-btn>
          </v-row>
        </v-form>
      </v-col>
      <v-col cols="5" class="mx-5">
        <v-form ref="form" :lazy-validation="true">
          <v-row>
            <v-text-field
              v-model="collateralFactor"
              label="Collateral Factor"
              type="number"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-btn
              class="success"
              @click="setCollateralFactor">
              Set Collateral
            </v-btn>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
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
    setCollateralFactor() {
      const collateral = this.collateralFactor * this.controller.MANTISSA;
      console.log(collateral);
      this.controller
        .setCollateralFactor(this.account, collateral);
    },
    setLiquidationFactor() {
      const liquidation = this.liquidationFactor * this.controller.MANTISSA;
      console.log(liquidation);
      this.controller
        .setLiquidationFactor(this.account, liquidation);
    },
  },
  created() {
    this.controller = new Controller();
    this.controller.eventualCollateralFactor
      .then((collateralFactor) => {
        this.collateralFactor = collateralFactor / this.controller.MANTISSA;
      });
    this.controller.eventualLiquidationFactor
      .then((liquidationFactor) => {
        this.liquidationFactor = liquidationFactor / this.controller.MANTISSA;
      });
  },
};
</script>
