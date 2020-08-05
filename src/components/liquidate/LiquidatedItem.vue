<template>
  <div class="LiquidatedItem">
    <v-card class="ma-3" outlined :elevation="4">
      <v-list-item @click="toggleShow()">
        <v-row>
          <v-col cols="6" class="text-center">
            {{borrower}}
          </v-col>
          <v-col cols="3" class="text-center">
            {{debt}}
          </v-col>
          <v-col cols="3" class="text-center">
            {{price}}
          </v-col>
        </v-row>
      </v-list-item>
      <template v-if="show">
        <v-divider/>
        <v-row>
          <v-col cols="9">
            <v-row>
              <v-col class="text-center font-weight-bold">
                Asset
              </v-col>
              <v-col cols="2" class="text-center font-weight-bold">
                Amount
              </v-col>
              <v-col class="text-center font-weight-bold">
                Max Allowed
              </v-col>
            </v-row>
          <collateral-list
            :collaterals="collaterals"
            :borrower="borrower"
          />
          </v-col>
          <v-col class="d-flex align-center">
            <v-card flat>
              <v-row>
                <h2 class="text-center">
                  Total: 525 {{tokenSymbol}}
                </h2>
              </v-row>
              <v-row class="d-flex justify-center">
                <v-btn>Buy</v-btn>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-card>
  </div>
</template>

<script>
import _ from 'lodash';
import CollateralList from '@/components/liquidate/CollateralList.vue';

export default {
  name: 'LiquidatedItem',
  components: { CollateralList },
  props: {
    borrower: {
      type: String,
      required: true,
    },
    marketAddress: {
      type: String,
      required: true,
    },
    tokenSymbol: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      controller: null,
      show: false,
      marketAddresses: [],
      collaterals: [],
      debt: null,
      price: null,
      total: 0,
      currentMarket: null,
    };
  },
  methods: {
    loadMarkets() {
      this.$rbank.controller.eventualMarketListSize
        .then((marketListSize) => _.range(marketListSize))
        .then((marketIndices) => marketIndices
          .map((idx) => this.$rbank.controller.getEventualMarketAddress(idx)))
        .then((marketAddressesPromises) => Promise.all(marketAddressesPromises))
        .then((marketAddresses) => {
          this.marketAddresses = marketAddresses
            .filter((mkt) => mkt !== this.marketAddress);
          this.getCollateral();
        });
    },
    toggleShow() {
      this.show = !this.show;
    },
    getDebt() {
      const market = new this.$rbank.Market(this.marketAddress);
      market.updatedBorrowBy(this.borrower)
        .then((debt) => {
          this.debt = Number(debt);
        })
        .then(() => this.$rbank.controller.eventualMarketPrice(this.marketAddress))
        .then((price) => { this.price = price; });
    },
    getCollateral() {
      const marketSupplies = this.marketAddresses
        .map((marketAddress) => new this.$rbank.Market(marketAddress))
        .map((market) => market.updatedSupplyOf(this.borrower));
      Promise.all(marketSupplies)
        .then((supplies) => {
          this.collaterals = supplies.map((sup) => ({
            maxAllowed: sup,
            amount: 0,
          }));
        });
    },
  },
  created() {
    this.loadMarkets();
    this.getDebt();
  },
};
</script>
