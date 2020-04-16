import Home from '@/views/Home.vue';
import store from '@/store';

const requireAuth = (to, from, next) => {
  if (!store.getters.SESSION_IS_LOGGED) {
    next({ name: 'Home' });
  } else {
    next();
  }
};

export default [
  {
    path: '/',
    name: 'Home',
    icon: 'home',
    publicShow: true,
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    publicShow: true,
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
  },
  {
    path: '/depositLending',
    name: 'Lending / borrow',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/DepositLending.vue'),
    icon: 'local_atm',
  },
  {
    path: '/account',
    name: 'Account',
    icon: 'person',
    publicShow: true,
    component: () => import(/* webpackChunkName: "account" */ '@/views/Account.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: 'settings',
    publicShow: false,
    component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '*',
    redirect: { name: 'Home' },
  },
];
