<template>
  <div>
    <redeem-list/>
  </div>
</template>

<script>
import RedeemList from '@/components/redeem/RedeemList.vue';
import { mapActions } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Redeem',
  components: {
    RedeemList,
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
