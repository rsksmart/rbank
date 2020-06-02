<template>
  <div class="LiquidatedItem">
    <v-card class="mt-5 ma-3" outlined :elevation="4">
      <v-list-item @click="toggleShow()">
        <div class="col-12 d-flex">
          <v-row>
            <v-col cols="6" class="d-flex justify-center">
              <v-list-item-content>
                <v-list-item-title class="text-center">
                  {{account}}
                </v-list-item-title>
              </v-list-item-content>
            </v-col>
            <v-col cols="3" class="d-flex justify-center">
              <v-list-item-content>
                <v-list-item-title class="text-center">
                  15
                </v-list-item-title>
              </v-list-item-content>
            </v-col>
            <v-col cols="3" class="d-flex justify-center">
              <v-list-item-content>
                <v-list-item-title class="text-center">
                  10
                </v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </div>
      </v-list-item>
      <div class="col-12 py-0 my-0" v-show="show">
        <v-row>
          <v-col cols="12" class="py-0 my-0">
            <v-list-item-content>
              <v-list-item-title class="text-center font-weight-bold">
                Collateral
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="py-0 my-0">
            <v-list-item-content>
              <v-list-item-subtitle class="text-center">
                Amount
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="d-flex justify-center py-0 my-0">
            <v-list-item-content>
              <v-list>
                <v-list-item v-for="(token, idx) in collaterals"
                             :key="`collateral-${account}-${idx}`">
                  <div class="col-12">
                    <v-row>
                      <v-col cols="5" class="font-weight-bold">
                        {{token.symbol}}
                      </v-col>
                      <v-col cols="7">
                        {{token.amount}}
                      </v-col>
                    </v-row>
                  </div>
                </v-list-item>
              </v-list>
            </v-list-item-content>
          </v-col>
          <v-col cols="6" class="d-flex justify-center">
            <v-btn>Buy</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'LiquidatedItem',
  props: {
    account: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      controller: null,
      flag: false,
      show: false,
      collaterals: [],
    };
  },
  methods: {
    buyLiquidation(accountAddress) {
      this.flag = !this.flag;
      console.log(`Liquidated of account ${accountAddress}`);
    },
    toggleShow() {
      this.show = !this.show;
    },
    getSymbols() {
      const tokens = this.marketAddresses
        .map((market) => new Market(market).eventualTokenAddress);
      Promise.all(tokens)
        .then((tokensAddr) => tokensAddr.map((tokenAddr) => new Token(tokenAddr).eventualSymbol))
        .then((symbolPromises) => Promise.all(symbolPromises))
        // eslint-disable-next-line no-return-assign
        .then((symbols) => symbols.forEach((symbol, idx) => this.collaterals[idx].symbol = symbol));
    },
    getCollateral() {
      this.controller.eventualMarketAddresses
        .then((marketAddresses) => {
          this.marketAddresses = marketAddresses;
          return marketAddresses
            .map((market) => new Market(market).getUpdatedSupplyOf(this.account));
        })
        .then((supplyPromises) => Promise.all(supplyPromises))
        .then((supplies) => {
          this.collaterals = supplies.map((sup) => ({
            amount: sup,
          }));
        })
        .then(() => this.getSymbols());
    },
  },
  created() {
    this.controller = new Controller();
    this.getCollateral();
  },
};
</script>
