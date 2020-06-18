<template>
  <v-card class="mx-5" outlined>
    <v-list-item three-line>
      <v-list-item-avatar tile size="80">
        <v-img src="https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1 text-right">
          {{ market.token.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="headline mb-1 text-right">
          {{ tokenPrice | formatPrice}}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="mx-5"></v-divider>
    <v-list class="transparent">
      <v-list-item>
        <v-list-item-title>
          {{ market.token.symbol }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-right">
          {{ marketSupplyOf }}
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
import Market from '@/handlers/market';

export default {
  name: 'MarketDetail',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      marketSupplyOf: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    tokenPrice() {
      return this.market.price * (Number(this.marketSupplyOf) / (10 ** this.market.token.decimals));
    },
  },
  created() {
    const marketInstance = new Market(this.market.address);
    marketInstance.getUpdatedSupplyOf(this.account)
      .then((supplyOf) => {
        this.marketSupplyOf = Number(supplyOf) / (10 ** this.market.token.decimals);
      });
  },
};
</script>
