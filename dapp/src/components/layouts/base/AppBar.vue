<template>
  <v-app-bar class="ma-5" color="transparent" flat>
    <h1 class="mx-5">RBank</h1>
    <h2>{{ title }}</h2>
    <v-spacer/>
    <div v-if="isLogged">
      <v-btn @click="toHome" class="button" text color="transparent">
        <h4 class="mx-5">Home</h4>
      </v-btn>
      <v-btn @click="toSupplyBorrow" class="button" text color="transparent">
        <h4 class="mx-5">Supply/Borrow</h4>
      </v-btn>
      <v-btn class="ml-5 button" rounded outlined color="#008CFF">
        {{ accountCutOff }}
      </v-btn>
    </div>
    <v-btn class="ml-5 button" rounded color="#008CFF" id="connectButton" @click="connect" v-else>
      <div class="text">Connect wallet</div>
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
    }),
    title() {
      if (this.$route.path === '/supplyBorrow') return 'Supply / Borrow';
      return 'My Activity';
    },
    accountCutOff() {
      return `${this.account.substring(0, 4)}...${this.account.substring(this.account.length - 4, this.account.length)}`;
    },
  },
  methods: {
    ...mapActions({
      connectToWeb3: constants.SESSION_CONNECT_WEB3,
    }),
    toHome() {
      this.$router.push({
        name: 'Home',
      });
    },
    toSupplyBorrow() {
      this.$router.push({
        name: 'SupplyBorrow',
      });
    },
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
};
</script>
