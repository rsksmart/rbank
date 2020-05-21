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
      this.controller
        .setCollateralFactor(this.account, this.collateralFactor);
    },
    setLiquidationFactor() {
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
