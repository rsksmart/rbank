<template>
  <div class="settings">
    <h1>Settings</h1>
    <controller-form/>
    <market-form @marketCreated="getMarkets"/>
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
    getMarkets() {
      this.$rbank.eventualMarkets
        .then((mkts) => {
          this.marketAddresses = mkts.map((mkt) => mkt.address);
        });
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
  created() {
    this.getMarkets();
  },
};
</script>
