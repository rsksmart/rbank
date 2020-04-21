<template>
  <div>
    <h2 class="d-flex justify-center text-center">Current Markets</h2>
    <div class="d-flex justify-center">
      <v-card width="70%">
          <v-list>
            <v-list-item>
              <v-list-item-subtitle class="text-center">Symbol</v-list-item-subtitle>
              <v-list-item-subtitle class="text-center">Asset</v-list-item-subtitle>
              <v-list-item-subtitle class="text-center">Borrows</v-list-item-subtitle>
              <v-list-item-subtitle class="text-center">Supplies</v-list-item-subtitle>
              <v-list-item-subtitle class="text-center">Price</v-list-item-subtitle>
            </v-list-item>
            <template v-for="(market, idx) in detailMarkets">
              <v-list-item :key="idx" @click="setMarket(market.address)">
                <v-list-item-title class="text-left">
                  <v-list-item-action>
                    <v-icon>local_convenience_store</v-icon>
                  </v-list-item-action>
                  {{ market.tokenSymbol }}
                </v-list-item-title>
                <v-list-item-title class="text-center">
                  {{ market.tokenName }}
                </v-list-item-title>
                <v-list-item-title class="text-center">
                  {{ market.totalBorrows }}
                </v-list-item-title>
                <v-list-item-title class="text-center">
                  {{ market.totalSupply }}
                </v-list-item-title>
                <v-list-item-title class="text-center">
                  {{ market.price }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import * as constants from '@/store/constants';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'MarketsList',
  data() {
    return {
      detailMarkets: [],
    };
  },
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
  },
  methods: {
    ...mapActions({
      loadMarkets: constants.CONTROLLER_LOAD_MARKETS,
    }),
    ...mapMutations({
      setProperty: constants.MARKET_SET_PROPERTY,
    }),
    setMarket(marketAddress) {
      this.setProperty({ marketAddress });
      this.$router.push({
        name: 'Market',
        params: { id: marketAddress },
      });
    },
  },
  created() {
    this.loadMarkets();
  },
  watch: {
    markets() {
      const mkts = this.markets;
      mkts.forEach((address) => {
        const ctrl = new Controller();
        const market = new Market(address);
        let tkn = null;
        const mkt = {
          address: null,
          totalSupply: null,
          totalBorrows: null,
          price: null,
          tokenName: null,
          tokenSymbol: null,
        };
        mkt.address = address;
        ctrl.getPrice(address)
          .then((price) => {
            mkt.price = price;
          });
        market.totalSupply
          .then((totalSupply) => {
            mkt.totalSupply = totalSupply;
          });
        market.totalBorrows
          .then((totalBorrows) => {
            mkt.totalBorrows = totalBorrows;
          });
        market.token
          .then((tokenAddress) => {
            tkn = new Token(tokenAddress);
            return tkn.name;
          })
          .then((name) => {
            mkt.tokenName = name;
            return tkn.symbol;
          })
          .then((symbol) => {
            mkt.tokenSymbol = symbol;
          });
        this.detailMarkets.push(mkt);
      });
    },
  },
};
</script>
