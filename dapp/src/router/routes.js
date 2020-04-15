import Home from '@/views/Home.vue';

export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'home',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    icon: 'dashboard',
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import(/* webpackChunkName: "account" */ '@/views/Account.vue'),
    icon: 'attach_money',
  },
];
