<template>
  <v-app light>

    <drawer v-if="connected"/>

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

import { mapState } from 'vuex';

export default {
  name: 'BaseLayout',
  data() {
    return {};
  },
  computed: {
    ...mapState({
      connected: (state) => state.Session.connected,
    }),
  },
  components: {
    AppBar,
    Drawer,
    Footing,
  },
};
</script>
