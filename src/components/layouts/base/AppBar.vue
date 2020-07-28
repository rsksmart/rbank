<template>
  <v-app-bar app class="">
    <v-spacer></v-spacer>

    <v-btn icon @click="toggleTheme">
      <v-icon v-if="theme">mdi-invert-colors-off</v-icon>
      <v-icon v-else>mdi-invert-colors</v-icon>
    </v-btn>

    <v-btn icon v-if="isLogged">
      <v-icon>mdi-link</v-icon>
    </v-btn>
    <v-btn icon id="connectButton" @click="connect" v-else>
      <v-icon>mdi-link-off</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'AppBar',
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
    theme() {
      return this.$vuetify.theme.dark;
    },
  },
  methods: {
    ...mapActions({
      connectToWeb3: constants.SESSION_CONNECT_WEB3,
    }),
    async connect() {
      try {
        // eslint-disable-next-line no-undef
        await ethereum.enable();
      } catch (e) {
        console.log(e);
      }
      this.connectToWeb3();
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>

<style scoped>

</style>
