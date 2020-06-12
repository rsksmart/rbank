<template>
  <div>
    <pay-borrow-list/>
  </div>
</template>

<script>
import PayBorrowList from '@/components/payBorrow/PayBorrowList.vue';
import { mapActions } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'PayBorrow',
  components: {
    PayBorrowList,
  },
  methods: {
    ...mapActions({
      getMarkets: constants.CONTROLLER_GET_MARKETS,
    }),
  },
  created() {
    this.getMarkets();
  },
};
</script>
