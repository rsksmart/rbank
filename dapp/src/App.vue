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
    this.$rbank.controller = '0x84F46628D78e7de013279c33e7B262488ce4421D';
  },
};
</script>
