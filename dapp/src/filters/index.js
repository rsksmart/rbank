import Vue from "vue";

Vue.filter('formatPrice', (value) => {
  const val = (value / 1).toFixed(2).replace('.', ',');
  return `$ ${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
});
