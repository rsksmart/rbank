<template>
  <div>
    <redeem-list :marketAddresses="marketAddresses"/>
  </div>
</template>

<script>
import RedeemList from '@/components/redeem/RedeemList.vue';
import Controller from '@/handlers/controller';

export default {
  name: 'Redeem',
  data() {
    return {
      controller: null,
      marketAddresses: [],
    };
  },
  components: {
    RedeemList,
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

<style scoped>

</style>
