<template>
  <component :is="currentComponent">
    <router-view/>
  </component>
</template>

<script>
import BaseLayout from '@/components/layouts/base/Index.vue';
import { mapActions } from 'vuex';
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
    currentComponent() {
      return `${this.layout.toLowerCase()}-layout`;
    },
  },
  methods: {
    ...mapActions({
      loadControllerAtSession: constants.SESSION_INIT_CONTROLLER,
      loadController: constants.CONTROLLER_INIT,
    }),
  },
  components: {
    BaseLayout,
  },
  created() {
    this.loadController();
    this.loadControllerAtSession();
  },
};
</script>
