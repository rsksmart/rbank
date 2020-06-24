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
            <v-btn :disabled="!validForm" color="success" @click="createMarket">
              Create Market
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="flag"
        :timeout=3000>
        {{ error }}
        <v-btn
          color="red"
          text
          @click="reset">
          Close
        </v-btn>
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
      validForm: false,
      error: null,
      flag: false,
      emptyAddress: '0x0000000000000000000000000000000000000000',
      rules: {
        requiredAddress: () => !!this.tokenAddress || 'Required.',
        requiredRate: () => !!this.marketBaseBorrowRate || 'Required.',
        address: () => (/^0x[a-fA-F0-9]{40}$/.test(this.tokenAddress) || 'Not a valid address'),
      },
    };
  },
  methods: {
    createMarket() {
      this.flag = false;
      this.$rbank.eventualMarket(this.tokenAddress)
        .then((market) => {
          this.error = `There is already a market ${market.address} for the token address entered`;
          this.flag = true;
        })
        .catch(() => {
          const baseBorrowRate = (this.marketBaseBorrowRate * 1e4);
          this.$rbank.Market.create(this.tokenAddress, baseBorrowRate)
            .then((createdMarketAddress) => new this.$rbank.Market(createdMarketAddress))
            .then((market) => {
              market.setControllerAddress(this.$rbank.controller.address);
              return market.address;
            })
            .then((createdMarketAddress) => {
              this.$rbank.controller.addMarket(createdMarketAddress);
              this.reset();
              this.$emit('marketCreated');
            })
            .catch(console.error);
        });
    },
    isValidForm() {
      this.validForm = typeof this.rules.requiredAddress() !== 'string'
        && typeof this.rules.address() !== 'string'
        && typeof this.rules.requiredRate() !== 'string';
    },
    reset() {
      this.$refs.form.reset();
      this.flag = false;
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
