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
export default {
  name: 'ControllerForm',
  data() {
    return {
      controller: null,
      collateralFactor: null,
      liquidationFactor: null,
    };
  },
  methods: {
    setCollateralFactor() {
      this.$rbank.controller.setCollateralFactor(this.collateralFactor);
    },
    setLiquidationFactor() {
      this.$rbank.controller.setLiquidationFactor(this.liquidationFactor);
    },
  },
  created() {
    this.$rbank.controller.eventualCollateralFactor
      .then((collateralFactor) => {
        this.collateralFactor = collateralFactor;
      });
    this.$rbank.controller.eventualLiquidationFactor
      .then((liquidationFactor) => {
        this.liquidationFactor = liquidationFactor;
      });
  },
};
</script>
