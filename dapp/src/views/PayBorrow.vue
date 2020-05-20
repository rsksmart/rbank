<template>
  <div>
    <pay-borrow-list :marketAddresses="marketAddresses"/>
  </div>
</template>

<script>
import PayBorrowList from '@/components/payBorrow/PayBorrowList.vue';
import Controller from '@/handlers/controller';

export default {
  name: 'PayBorrow',
  data() {
    return {
      controller: null,
      marketAddresses: [],
    };
  },
  components: {
    PayBorrowList,
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
