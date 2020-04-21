<template>
  <div>
    <h1>Market</h1>
    <h2>Address: {{id}}</h2>
    <price/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import * as constants from '@/store/constants';
import Price from '@/components/market/Price.vue';

export default {
  name: 'Market',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    Price,
  },
  methods: {
    ...mapActions({
      initMarket: constants.MARKET_INIT,
    }),
  },
  created() {
    this.initMarket(this.id);
  },
};
</script>
