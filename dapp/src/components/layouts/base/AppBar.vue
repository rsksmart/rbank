<template>
  <v-app-bar app class="">
    <v-spacer></v-spacer>

    <v-btn icon @click="toggleTheme">
      <v-icon v-if="theme">mdi-invert-colors-off</v-icon>
      <v-icon v-else>mdi-invert-colors</v-icon>
    </v-btn>

    <v-btn icon @click="connect">
      <v-icon v-if="connected">mdi-link</v-icon>
      <v-icon v-else>mdi-link-off</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'AppBar',
  computed: {
    ...mapState({
      connected: (state) => state.Session.connected,
    }),
    theme() {
      return this.$vuetify.theme.dark;
    },
  },
  methods: {
    ...mapMutations({
      sessionSetProperty: constants.SESSION_SET_PROPERTY,
    }),
    connect() {
      this.sessionSetProperty({
        property: 'connected',
        value: !this.connected,
      });
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>

<style scoped>

</style>
