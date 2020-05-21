<template>
  <v-card class="mx-5" outlined>
    <v-list-item three-line>
      <v-list-item-avatar tile size="80">
        <v-img src="https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right">
          {{ tokenName }}
        </v-list-item-title>
        <v-list-item-subtitle class="headline mb-1 text-right">
          {{tokensPrice | formatPrice}}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="mx-5"></v-divider>
    <v-list class="transparent">
      <v-list-item>
        <v-list-item-title>
          {{ tokenSymbol }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-right">
          {{marketSupplyOf}}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider class="mx-5"></v-divider>
    <h3 class="text-center ma-2">Annual Rates</h3>
    <div class="d-flex justify-space-around">
      <v-card width="45%" class="ma-2">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4 text-center">Supplier</div>
            <v-list-item-title class="headline text-center">
              2 %
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card width="45%" class="ma-2">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4 text-center">Taker</div>
            <v-list-item-title class="headline text-center">
              1.5 %
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Controller from '@/handlers/controller';
import Market from '@/handlers/market';
import Token from '@/handlers/token';

export default {
  name: 'MarketDetail',
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      controller: null,
      market: null,
      tokenName: null,
      tokenSymbol: null,
      marketSupplyOf: null,
      tokensPrice: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    tokensByPrice() {
      this.tokensPrice = this.price * this.marketSupplyOf;
    },
  },
  created() {
    this.controller = new Controller();
    this.market = new Market(this.marketAddress);
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        const token = new Token(tokenAddress);
        return [token.eventualName, token.eventualSymbol];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
      });
    this.controller.getPrice(this.marketAddress)
      .then((price) => {
        this.price = Number(price);
        return this.market.getUpdatedSupplyOf(this.account);
      })
      .then((supplyOf) => {
        this.marketSupplyOf = Number(supplyOf);
        this.tokensByPrice();
      });
  },
};
</script>
