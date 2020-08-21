<template>
  <v-app light>
    <app-bar/>
    <v-content>
      <v-container fluid>
        <slot></slot>
      </v-container>
    </v-content>
    <footing></footing>
  </v-app>
</template>

<script>
import AppBar from '@/components/layouts/base/AppBar.vue';
import Footing from '@/components/layouts/base/Footing.vue';

import { mapGetters } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'BaseLayout',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
  },
  components: {
    AppBar,
    Footing,
  },
};
</script>
