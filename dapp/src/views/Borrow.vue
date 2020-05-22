<template>
  <div>
    <borrow-list :marketAddresses="marketAddresses"/>
  </div>
</template>

<script>
import BorrowList from '@/components/borrow/BorrowList.vue';
import Controller from '@/handlers/controller';

export default {
  name: 'Borrow',
  data() {
    return {
      controller: null,
      marketAddresses: [],
    };
  },
  components: {
    BorrowList,
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
