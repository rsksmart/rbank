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
    this.$rbank.controller = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
  },
};
</script>
