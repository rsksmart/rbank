<template>
  <div class="settings">
    <h1>Settings</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex';

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
};
</script>
