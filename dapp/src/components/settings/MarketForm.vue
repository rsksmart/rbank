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
              required
            ></v-text-field>
            <v-text-field
              v-model="marketBaseBorrowRate"
              label="Market Base Borrow Rate"
              type="number"
              required
            ></v-text-field>
            <v-btn color="success" @click="createMarket">
              Create Market
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
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
    };
  },
  computed: {
    ...mapState({
      from: (state) => ({ from: state.Session.account }),
    }),
  },
  methods: {
    createMarket() {
      Market.deploy(
        this.from,
        this.tokenAddress,
        this.marketBaseBorrowRate,
      )
        .then((marketAddress) => {
          const market = new Market(marketAddress);
          market.setController(this.from, this.controller.address);
          return this.controller.addMarket(this.from, marketAddress);
        })
        .then(() => {
          this.$emit('marketCreated');
        });
      this.$refs.form.reset();
    },
  },
  created() {
    this.controller = new Controller();
  },
};
</script>
