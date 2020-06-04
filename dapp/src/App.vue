<template>
  <component :is="currentComponent">
    <router-view/>
  </component>
</template>

<script>
import BaseLayout from '@/components/layouts/base/Index.vue';
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'App',
  data() {
    return {
      layout: 'Base',
      layouts: [
        'Base',
      ],
    };
  },
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
    currentComponent() {
      return `${this.layout.toLowerCase()}-layout`;
    },
  },
  methods: {
    ...mapActions({
      loadControllerAtSession: constants.SESSION_INIT_CONTROLLER,
      getMarkets: constants.CONTROLLER_GET_MARKETS,
    }),
  },
  components: {
    BaseLayout,
  },
  created() {
    this.loadControllerAtSession();
    this.getMarkets();
  },
};
</script>
