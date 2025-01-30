import { RouteRecordRaw } from 'vue-router';
import { isAdminGuard } from 'src/guards/AdminGuard';

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
      },
      {
        path: 'movimentacoes',
        name: 'admin-movement',
        component: () => import('src/pages/Movement.vue'),
      },
      {
        path: 'agendamentos',
        name: 'admin-scheduling',
        component: () => import('src/pages/Scheduling.vue'),
      },
      {
        path: 'contas',
        name: 'admin-account',
        component: () => import('src/pages/Account.vue'),
      },
      {
        path: 'categorias',
        name: 'admin-category',
        component: () => import('src/pages/Category.vue'),
      },
      {
        path: 'usuarios',
        name: 'admin-users',
        component: () => import('src/pages/User.vue'),
        beforeEnter: isAdminGuard,
      },
      {
        path: 'departamentos',
        name: 'admin-departments',
        component: () => import('src/pages/Department.vue'),
        beforeEnter: isAdminGuard,
      },
      {
        path: 'registros',
        name: 'admin-records',
        component: () => import('src/pages/Register.vue'),
        beforeEnter: isAdminGuard,
      },
      {
        path: 'filial',
        name: 'admin-office',
        component: () => import('src/pages/Office.vue'),
        beforeEnter: isAdminGuard,
      },
      {
        path: 'enterprise',
        name: 'admin-enterprise',
        component: () => import('src/pages/Enterprise.vue'),
      },
      {
        path: 'solicitacoes',
        name: 'admin-order',
        component: () => import('src/pages/Order.vue'),
      },

      {
        path: 'vinculos',
        component: () => import('src/pages/Bond.vue'),
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

      // {
      //   path: 'alertas',
      //   name: 'admin-alert',
      //   component: () => import('src/pages/Alert.vue'),
      // },
      {
        path: 'contabilidade',
        name: 'admin-financial-control',
        component: () => import('src/pages/FinancialControl.vue'),
        beforeEnter: isAdminGuard,
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
