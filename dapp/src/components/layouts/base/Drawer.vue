<template>
  <v-navigation-drawer
    v-model="drawer"
    :expand-on-hover="true"
    :mini-variant="true"
    app
  >
    <v-list dense>
      <template link v-for="(route, idx) in routes">
        <v-list-item
          v-if="route.publicShow || isOwner"
          link
          :key="`item-list-${idx}`"
          @click="$router.push({name: route.name})"
        >
          <v-list-item-action>
            <v-icon>{{route.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{route.name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';

import routes from '@/router/routes';

export default {
  name: 'Drawer',
  data() {
    return {
      routes,
      drawer: null,
    };
  },
  computed: {
    ...mapState({
      isOwner: (state) => state.Session.isOwner,
    }),
  },
};
</script>
