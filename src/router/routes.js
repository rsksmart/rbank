import Landing from '@/views/Landing.vue';
import store from '@/store';

const requireAuth = (to, from, next) => {
  if (!store.getters.SESSION_IS_LOGGED) {
    next({ name: 'Landing' });
  } else {
    next();
  }
};

export default [
  {
    path: '/',
    name: 'Landing',
    icon: null,
    publicShow: false,
    component: Landing,
  },
  {
    path: '/myActivity',
    name: 'MyActivity',
    icon: null,
    publicShow: false,
    component: () => import(/* webpackChunkName: "myActivity" */ '@/views/MyActivity.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/supplyBorrow',
    name: 'SupplyBorrow',
    icon: null,
    publicShow: false,
    component: () => import(/* webpackChunkName: "supplyBorrow" */ '@/views/SupplyBorrow.vue'),
    props: true,
    beforeEnter: requireAuth,
  },
  {
    path: '/depositLending',
    name: 'Lending',
    icon: 'local_atm',
    publicShow: true,
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/DepositLending.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/liquidate',
    name: 'Liquidations',
    icon: 'local_mall',
    publicShow: true,
    component: () => import(/* webpackChunkName: "liquidate" */ '@/views/Liquidated.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    icon: null,
    publicShow: false,
    component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/market/:id',
    name: 'Market',
    icon: 'local_convenience_store',
    publicShow: false,
    component: () => import(/* webpackChunkName: "market" */ '@/views/Market.vue'),
    props: true,
    beforeEnter: requireAuth,
  },
  {
    path: '*',
    redirect: { name: 'Landing' },
  },
];
