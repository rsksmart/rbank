<template>
  <div class="Liquidated">
    <liquidated-list v-for="(market, idx) in marketAddresses"
                     :key="`market-item-${market}-${idx}`" :market="market"/>
  </div>
</template>

<script>
import LiquidatedList from '@/components/liquidate/LiquidatedList.vue';
import Controller from '@/handlers/controller';

export default {
  name: 'Liquidated',
  data() {
    return {
      marketAddresses: [],
      // testList: [
      //   {
      //     icon: 'https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png',
      //     address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88',
      //     quantity: 0.25,
      //   },
      //   {
      //     icon: 'https://developers.rsk.co/defi/img/btc-logo.svg',
      //     address: '0x58Be343B94f860124dC4fEe278FDCBD38C102D89',
      //     quantity: 3,
      //   },
      // ],
    };
  },
  components: {
    LiquidatedList,
  },
  methods: {
    loadMarkets() {
      this.controller.eventualMarketAddresses
        .then((marketAddresses) => {
          this.marketAddresses = marketAddresses;
        });
    },
  },
  created() {
    this.controller = new Controller();
    this.loadMarkets();
  },
};
</script>
