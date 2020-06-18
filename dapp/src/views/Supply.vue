<template>
  <div>
    <supply-list/>
  </div>
</template>

<script>
import SupplyList from '@/components/supply/SupplyList.vue';
import { mapActions } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Supply',
  components: {
    SupplyList,
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
