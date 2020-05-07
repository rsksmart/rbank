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
              label="Market Base Borrow Rate"
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
import { mapState } from 'vuex';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';

export default {
  name: 'MarketForm',
  data() {
    return {
      controller: null,
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
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    async getMarketByToken() {
      this.flag = false;
      await this.controller.getMarketByToken(this.tokenAddress)
        .then((mktAddress) => {
          if (mktAddress !== this.emptyAddress) {
            this.error = `There is already a market ${mktAddress} for the token address entered`;
            this.flag = true;
          }
        });
      return this.flag;
    },
    async createMarket() {
      await this.getMarketByToken();
      if (!this.flag && (this.tokenAddress !== this.emptyAddress)) {
        Market.deploy(
          this.account,
          this.tokenAddress,
          this.marketBaseBorrowRate,
        )
          .then((marketAddress) => {
            const market = new Market(marketAddress);
            market.setController(this.account, this.controller.address);
            return this.controller.addMarket(this.account, marketAddress);
          })
          .then(() => {
            this.reset();
            this.$emit('marketCreated');
          });
      }
      setTimeout(() => {
        this.reset();
      }, 3000);
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
  created() {
    this.controller = new Controller();
  },
};
</script>
