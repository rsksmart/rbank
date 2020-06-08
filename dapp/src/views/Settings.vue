<template>
  <div class="settings">
    <h1>Settings</h1>
    <controller-form/>
    <market-form/>
    <markets-list :marketAddresses="marketAddresses"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ControllerForm from '@/components/settings/ControllerForm.vue';
import MarketForm from '@/components/settings/MarketForm.vue';
import MarketsList from '@/components/settings/MarketsList.vue';

export default {
  name: 'Settings',
  computed: {
    ...mapState({
      isOwner: (state) => state.Session.isOwner,
      marketAddresses: (state) => state.Controller.markets.map((mkt) => mkt.address),
    }),
    pageHeight() {
      return document.body.scrollHeight;
    },
  },
  watch: {
    isOwner(val) {
      if (!val) {
        this.$router.push({ name: 'Home' });
      }
    },
    marketAddresses() {
      this.$vuetify.goTo(this.pageHeight);
    },
  },
  components: {
    ControllerForm,
    MarketForm,
    MarketsList,
  },
};
</script>
