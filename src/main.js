import Vue from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import Rbank from '@rsksmart/rbank.js';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import './sass/main.scss';

require('./filters');

Vue.config.productionTip = false;

// eslint-disable-next-line no-multi-assign
Vue.prototype.$rbank = Vue.rbank = new Rbank();

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
