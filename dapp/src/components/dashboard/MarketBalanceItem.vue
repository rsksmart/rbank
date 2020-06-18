<template>
  <v-card class="ma-5" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          {{ market.token.name }} ({{ market.token.symbol }})
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ marketSupplyOf }}
        </v-list-item-subtitle>
        <v-list-item-title>
          {{ updatedSupplyCash | formatPrice }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-avatar tile size="80">
        <v-img :src="btc"></v-img>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Market from '@/handlers/market';

export default {
  name: 'MarketBalanceItem',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      marketSupplyOf: null,
      btc: 'https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png',
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    updatedSupplyCash() {
      return this.market.price * Number(this.marketSupplyOf);
    },
  },
  created() {
    const market = new Market(this.market.address);
    market.getUpdatedSupplyOf(this.account)
      .then((supplyOf) => {
        this.marketSupplyOf = (Number(supplyOf) / (10 ** this.market.token.decimals))
          .toFixed(this.market.token.decimals);
      });
  },
};
</script>
