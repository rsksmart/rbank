<template>
  <div class="settings">
    <h1>Settings</h1>
    <controller-form/>
    <market-form @marketCreated="loadMarkets"/>
    <markets-list :marketAddresses="marketAddresses"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Controller from '@/handlers/controller';

import ControllerForm from '@/components/settings/ControllerForm.vue';
import MarketForm from '@/components/settings/MarketForm.vue';
import MarketsList from '@/components/settings/MarketsList.vue';

export default {
  name: 'Settings',
  data() {
    return {
      controller: null,
      marketAddresses: [],
    };
  },
  computed: {
    ...mapState({
      isOwner: (state) => state.Session.isOwner,
    }),
  },
  watch: {
    isOwner(val) {
      if (!val) {
        this.$router.push({ name: 'Home' });
      }
    },
  },
  methods: {
    loadMarkets() {
      this.controller.eventualMarketAddresses
        .then((marketAddresses) => {
          this.marketAddresses = marketAddresses;
        });
    },
  },
  components: {
    ControllerForm,
    MarketForm,
    MarketsList,
  },
  created() {
    this.controller = new Controller();
    this.loadMarkets();
  },
};
</script>
