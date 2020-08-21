<template>
  <v-app-bar class="appBar ma-5" color="transparent" flat>
    <h1 class="mx-5">RBank</h1>
    <h2>{{ title }}</h2>
    <v-spacer/>
    <div v-if="isLogged">
      <template v-if="!isOwner">
        <router-link class="mx-5" :to="{ name: 'MyActivity' }">
          Home
        </router-link>
        <router-link class="mx-5" :to="{ name: 'SupplyBorrow' }">
          Supply/Borrow
        </router-link>
      </template>
      <v-btn class="mx-5" rounded outlined color="#008CFF">
        {{ accountCutOff }}
      </v-btn>
    </div>
    <v-btn class="ml-5 button" rounded color="#008CFF" id="connectButton" @click="connect" v-else>
      <span class="mx-5">Connect wallet</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'AppBar',
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
    ...mapState({
      account: (state) => state.Session.account,
      isOwner: (state) => state.Session.isOwner,
    }),
    title() {
      if (this.$route.path === '/supplyBorrow') return 'Supply / Borrow';
      if (this.$route.path === '/myActivity') return 'My Activity';
      if (this.$route.path === '/admin') return 'Admin Dashboard';
      return '';
    },
    accountCutOff() {
      return `${this.account.substring(0, 4)}...${this.account
        .substring(this.account.length - 4, this.account.length)}`;
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
  },
  watch: {
    isOwner(val) {
      if (val) this.$router.push({ name: 'Admin' });
    },
    isLogged() {
      this.$router.push({ name: 'MyActivity' });
    },
  },
};
</script>
