<template>
  <div>
    <borrow-list/>
  </div>
</template>

<script>
import BorrowList from '@/components/borrow/BorrowList.vue';
import { mapActions } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Borrow',
  components: {
    BorrowList,
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
