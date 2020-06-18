<template>
  <div class="settings">
    <h1>Settings</h1>
    <controller-form/>
    <market-form/>
    <markets-list/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as constants from '@/store/constants';
import ControllerForm from '@/components/settings/ControllerForm.vue';
import MarketForm from '@/components/settings/MarketForm.vue';
import MarketsList from '@/components/settings/MarketsList.vue';

export default {
  name: 'Settings',
  data() {
    return {
      marketAddresses: [],
    };
  },
  computed: {
    ...mapState({
      isOwner: (state) => state.Session.isOwner,
    }),
    pageHeight() {
      return document.body.scrollHeight;
    },
  },
  methods: {
    ...mapActions({
      getMarkets: constants.CONTROLLER_GET_MARKETS,
    }),
  },
  watch: {
    isOwner(val) {
      if (!val) {
        this.$router.push({ name: 'Home' });
      }
    },
    markets() {
      this.$vuetify.goTo(this.pageHeight);
    },
  },
  created() {
    this.$rbank.eventualMarkets
      .then((markets) => {
        this.marketAddresses = markets.map((market) => market.address);
      })
      .catch(() => {
        this.marketAddresses = [];
      });
  },
  components: {
    ControllerForm,
    MarketForm,
    MarketsList,
  },
  created() {
    this.getMarkets();
  },
};
</script>
