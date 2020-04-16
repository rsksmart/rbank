import Home from '@/views/Home.vue';

export default [
  {
    path: '/',
    name: 'Home',
    icon: 'home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    icon: 'attach_money',
    component: () => import(/* webpackChunkName: "account" */ '@/views/Account.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: 'settings',
    check: true,
    component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue'),
  },
];
