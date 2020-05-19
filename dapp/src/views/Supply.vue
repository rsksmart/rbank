<template>
  <div>
    <supply-list :marketAddresses="marketAddresses"/>
  </div>
</template>

<script>
import SupplyList from '@/components/supply/SupplyList.vue';
import Controller from '@/handlers/controller';

export default {
  name: 'Supply',
  data() {
    return {
      controller: null,
      marketAddresses: [],
    };
  },
  components: {
    SupplyList,
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
