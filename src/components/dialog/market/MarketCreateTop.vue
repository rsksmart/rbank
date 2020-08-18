<template>
  <div class="mt-5 mb-3">
    <template v-if="success">
      <h1 class="blueish text-center">Success!</h1>
      <p class="mt-1">You have successfully created a<br> new Market.</p>
    </template>
    <template v-else>
      <h1 class="blueish text-center">Create New Market</h1>
      <p class="mt-1">Fill out the following form to <br> create your new Market.</p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MarketCreateTop',
  props: {
    success: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
