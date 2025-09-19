import { RouteRecordRaw } from 'vue-router';
import { isAdminGuard } from 'src/guards/AdminGuard';
import { isCounterGuard } from 'src/guards/CounterGuard';
import { isClientGuard } from 'src/guards/ClientGuard';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'auth',
    component: () => import('src/pages/Auth.vue'),
  },
  {
    path: '/admin',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'admin-feed' },
      },
      {
        path: 'feed',
        name: 'admin-feed',
        component: () => import('src/pages/Feed.vue'),
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('src/pages/Dashboard.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'movimentacoes',
        name: 'admin-movement',
        component: () => import('src/pages/Movement.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'agendamentos',
        name: 'admin-scheduling',
        component: () => import('src/pages/Scheduling.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'contas',
        name: 'admin-account',
        component: () => import('src/pages/Account.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'membros',
        name: 'admin-member',
        component: () => import('src/pages/Member.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'ministérios',
        name: 'admin-ministry',
        component: () => import('src/pages/Ministry.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'celulas',
        name: 'admin-cell',
        component: () => import('src/pages/Cell.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'congregacoes',
        name: 'admin-congregation',
        component: () => import('src/pages/Congregation.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'redes',
        name: 'admin-network',
        component: () => import('src/pages/Network.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'categorias',
        name: 'admin-category',
        component: () => import('src/pages/Category.vue'),
        beforeEnter: [isClientGuard],
      },
      {
        path: 'usuarios',
        name: 'admin-users',
        component: () => import('src/pages/User.vue'),
        beforeEnter: [isAdminGuard],
      },
      {
        path: 'departamentos',
        name: 'admin-departments',
        component: () => import('src/pages/Department.vue'),
        beforeEnter: [isAdminGuard],
      },
      {
        path: 'registros',
        name: 'admin-records',
        component: () => import('src/pages/Register.vue'),
        beforeEnter: [isAdminGuard],
      },
      {
        path: 'filial',
        name: 'admin-office',
        component: () => import('src/pages/Office.vue'),
        beforeEnter: [isAdminGuard, isClientGuard],
      },
      {
        path: 'enterprise',
        name: 'admin-enterprise',
        component: () => import('src/pages/Enterprise.vue'),
        beforeEnter: [isCounterGuard],
      },
      {
        path: 'solicitacoes',
        name: 'admin-order',
        component: () => import('src/pages/Order.vue'),
        beforeEnter: [isCounterGuard],
      },

      {
        path: 'vinculos',
        component: () => import('src/pages/Bond.vue'),
        beforeEnter: [isCounterGuard],
        children: [
          {
            path: '',
            name: 'admin-bond',
            component: () => import('src/pages/Bond.vue'),
          },
          {
            path: ':id',
            name: 'admin-bond-with-id',
            component: () => import('src/pages/Bond.vue'),
          },
        ],
      },
      {
        path: 'contabilidade',
        name: 'admin-financial-control',
        component: () => import('src/pages/FinancialControl.vue'),
        beforeEnter: [isAdminGuard, isClientGuard],
      },
      {
        path: 'assinaturas',
        name: 'admin-subscription',
        component: () => import('src/pages/Subscriptions.vue'),
      },
      {
        path: 'ajuda',
        name: 'admin-help',
        component: () => import('src/pages/Help.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/error/ErrorNotFound.vue'),
  },
];

export default routes;
