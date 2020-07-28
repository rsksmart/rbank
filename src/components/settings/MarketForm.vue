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
              v-model="tokenAddress"
              label="Token Base Address"
              :rules="[rules.requiredAddress, rules.address]"
              type="string"
              required
            ></v-text-field>
            <v-text-field
              v-model="marketBaseBorrowRate"
              label="Market Base Borrow Rate %"
              :rules="[rules.requiredRate]"
              type="number"
              required
            ></v-text-field>
            <v-text-field
              v-model="blocksPerYear"
              label="Blocks per Year"
              type="number"
              required
            ></v-text-field>
            <v-text-field
              v-model="utilizationRateFraction"
              label="Utilization Rate Fraction"
              type="number"
              required
            ></v-text-field>
            <v-btn :disabled="!validForm" color="success" @click="createMarket">
              Create Market
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
      <v-snackbar v-model="showSnackbar" color="error" elevation="24" :multi-line="true">
        {{ error }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'MarketForm',
  data() {
    return {
      tokenAddress: null,
      marketBaseBorrowRate: null,
      blocksPerYear: 1e6,
      utilizationRateFraction: 20,
      validForm: false,
      error: null,
      showSnackbar: false,
      rules: {
        requiredAddress: () => !!this.tokenAddress || 'Required.',
        requiredRate: () => !!this.marketBaseBorrowRate || 'Required.',
        address: () => (/^0x[a-fA-F0-9]{40}$/.test(this.tokenAddress) || 'Not a valid address'),
      },
    };
  },
  methods: {
    createMarket() {
      return this.$rbank.marketExistsByToken(this.tokenAddress)
        .then((marketExists) => {
          if (!marketExists) {
            this.$rbank.Market.create(
              this.tokenAddress,
              this.marketBaseBorrowRate,
              this.blocksPerYear,
              this.utilizationRateFraction,
            )
              .then((createdMarketAddress) => new this.$rbank.Market(createdMarketAddress))
              .then((market) => {
                market.setControllerAddress(this.$rbank.controller.address);
                return market.address;
              })
              .then((createdMarketAddress) => this.$rbank.controller
                .addMarket(createdMarketAddress))
              .then(() => {
                this.reset();
                this.$emit('marketCreated');
              })
              .catch(console.error);
          } else {
            this.error = 'There is already a market for the token address entered!';
            this.showSnackbar = true;
            setTimeout(() => this.reset(), 3000);
          }
        });
    },
    isValidForm() {
      this.validForm = typeof this.rules.requiredAddress() !== 'string'
        && typeof this.rules.address() !== 'string'
        && typeof this.rules.requiredRate() !== 'string';
    },
    reset() {
      this.$refs.form.reset();
      this.showSnackbar = false;
    },
  },
  watch: {
    tokenAddress() {
      this.isValidForm();
    },
    marketBaseBorrowRate() {
      this.isValidForm();
    },
  },
};
</script>
