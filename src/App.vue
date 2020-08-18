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
    this.$rbank.controller = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
  },
};
</script>
