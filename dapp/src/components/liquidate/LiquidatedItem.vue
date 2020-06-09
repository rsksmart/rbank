<template>
  <div class="LiquidatedItem">
    <v-card class="ma-3" outlined :elevation="4">
      <v-list-item @click="toggleShow()">
        <v-row>
          <v-col cols="6" class="text-center">
            {{account}}
          </v-col>
          <v-col cols="3" class="text-center">
            {{debt}}
          </v-col>
          <v-col cols="3" class="text-center">
            {{price | formatPrice}}
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
            <div v-for="(token, idx) in collaterals"
                         :key="`collateral-${account}-${idx}`">
              <v-list-item v-if="token.symbol !== tokenSymbol">
                <v-row>
                    <v-col class="font-weight-bold text-center">
                      {{token.symbol}}
                    </v-col>
                    <v-col cols="2" class="pa-0">
                      <v-text-field class="pa-0"
                                    v-model="token.amount"
                                    type="number">
                      </v-text-field>
                    </v-col>
                    <v-col class="text-center">
                      {{token.maxAllowed}}
                    </v-col>
                  </v-row>
              </v-list-item>
            </div>
          </v-col>
          <v-col class="d-flex align-center">
            <v-card flat>
              <v-row>
                <h2 class="text-center">
                  Total: {{total}}
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
      flag: false,
      show: false,
      collaterals: [],
      debt: null,
      price: null,
      total: 0,
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
        .then((symbols) => {
          symbols.forEach((symbol, idx) => {
            this.collaterals[idx].symbol = symbol;
          });
        });
    },
    getDebt() {
      const market = new Market(this.marketAddress);
      market.getUpdatedBorrowBy(this.account)
        .then((debt) => {
          this.debt = Number(debt);
          return this.controller.getPrice(this.marketAddress);
        })
        .then((price) => {
          this.price = this.debt * price;
        });
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
            maxAllowed: sup,
            amount: 0,
          }));
        })
        .then(() => this.getSymbols());
    },
  },
  created() {
    this.controller = new Controller();
    this.getCollateral();
    this.getDebt();
  },
};
</script>
