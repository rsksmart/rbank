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
    name: 'Lending',
    icon: 'local_atm',
    publicShow: true,
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/DepositLending.vue'),
  },
  {
    path: '/supply',
    name: 'Supply',
    icon: 'archive',
    publicShow: true,
    component: () => import(/* webpackChunkName: "liquidate" */ '@/views/Supply.vue'),
  },
  {
    path: '/borrow',
    name: 'Borrow',
    icon: 'attach_money',
    publicShow: true,
    component: () => import(/* webpackChunkName: "market" */ '@/views/Borrow.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/payBorrow',
    name: 'PayBorrow',
    icon: 'credit_card',
    publicShow: true,
    component: () => import(/* webpackChunkName: "liquidate" */ '@/views/PayBorrow.vue'),
  },
  {
    path: '/redeem',
    name: 'Redeem',
    icon: 'unarchive',
    publicShow: true,
    component: () => import(/* webpackChunkName: "liquidate" */ '@/views/Redeem.vue'),
  },
  {
    path: '/liquidate',
    name: 'Liquidations',
    icon: 'local_mall',
    publicShow: true,
    component: () => import(/* webpackChunkName: "liquidate" */ '@/views/Liquidated.vue'),
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
    path: '/market/:id',
    name: 'Market',
    icon: 'local_convenience_store',
    publicShow: false,
    component: () => import(/* webpackChunkName: "market" */ '@/views/Market.vue'),
    props: true,
  },
  {
    path: '/supplyBorrow',
    name: 'SupplyBorrow',
    icon: '',
    publicShow: false,
    component: () => import(/* webpackChunkName: "market" */ '@/views/SupplyBorrow.vue'),
    props: true,
  },
  {
    path: '*',
    redirect: { name: 'Home' },
  },
];
