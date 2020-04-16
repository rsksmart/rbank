import Vue from 'vue';
import Web3 from 'web3';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import './sass/main.scss';

Vue.config.productionTip = false;

window.addEventListener('load', async () => {
  // eslint-disable-next-line no-undef
  if (web3 !== undefined) {
    // eslint-disable-next-line no-undef
    web3 = new Web3(window.web3.currentProvider);
    // eslint-disable-next-line no-multi-assign,no-undef
    Vue.prototype.$web3 = Vue.web3 = web3;
    try {
      // eslint-disable-next-line no-undef
      await ethereum.enable();
    } catch (e) {
      console.error(e);
    }
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
