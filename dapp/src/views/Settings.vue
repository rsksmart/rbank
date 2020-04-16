<template>
  <div class="settings">
    <h1>Settings</h1>
    <market-form/>
    <markets-list/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import MarketForm from '@/components/settings/MarketForm.vue';
import MarketsList from '@/components/settings/MarketsList.vue';

export default {
  name: 'Settings',
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
  components: {
    MarketForm,
    MarketsList,
  },
};
</script>
