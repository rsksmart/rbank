<template>
  <component :is="currentComponent">
      <router-view/>
  </component>
</template>

<script>
import BaseLayout from '@/components/layouts/base/Index.vue';

export default {
  name: 'App',
  data() {
    return {
      layout: 'Base',
      layouts: [
        'Base',
      ],
    };
  },
  computed: {
    currentComponent() {
      return `${this.layout.toLowerCase()}-layout`;
    },
  },
  methods: {

  },
  components: {
    BaseLayout,
  },
  created() {
    this.$rbank.controller = '0xda081f6f794bddfb033492d4b0aeb5e7e3e3ce98'.toLowerCase();
  },
};
</script>
