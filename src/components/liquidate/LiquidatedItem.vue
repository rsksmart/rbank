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
                  Total: {{totalAmount}} {{currentMarket.token.symbol}}
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
import { mapState } from 'vuex';

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
      show: false,
      collaterals: [],
      debt: null,
      price: null,
      total: 0,
      currentMarket: null,
    };
  },
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
    totalAmount() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.total = 0;
      this.collaterals
        .forEach((token) => { this.total += (token.price * token.amount); });
      return this.total / this.currentMarket.price;
    },
  },
  methods: {
    buyLiquidation(accountAddress) {
      console.log(`Liquidated ${this.total} debt of account ${accountAddress}`);
    },
    toggleShow() {
      this.show = !this.show;
    },
    getDebt() {
      const market = new this.$rbank.Market(this.marketAddress);
      market.getUpdatedBorrowBy(this.account)
        .then((debt) => {
          this.debt = Number(debt);
        })
        .then(() => {
          this.price = this.debt * this.currentMarket.price;
        });
    },
    getCollateral() {
      const marketSupplies = this.markets.map((market) => market.address)
        .map((market) => new this.$rbank.Market(market).getUpdatedSupplyOf(this.account));
      Promise.all(marketSupplies)
        .then((supplies) => {
          this.collaterals = supplies.map((sup, idx) => ({
            maxAllowed: sup,
            amount: 0,
            price: this.markets[idx].price,
            symbol: this.markets[idx].token.symbol,
          }));
        });
    },
  },
  created() {
    [this.currentMarket] = this.markets
      .filter((mkt) => mkt.address === this.marketAddress);
    this.getCollateral();
    this.getDebt();
  },
};
</script>
