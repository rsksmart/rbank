<template>
  <v-app light>
    <drawer v-if="isLogged"/>
    <app-bar/>
    <v-content>
      <v-container class="" fluid>
        <slot></slot>
      </v-container>
    </v-content>
    <footing></footing>
  </v-app>
</template>

<script>
import AppBar from '@/components/layouts/base/AppBar.vue';
import Drawer from '@/components/layouts/base/Drawer.vue';
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
    Drawer,
    Footing,
  },
};
</script>
