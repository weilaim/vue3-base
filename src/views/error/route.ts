import type { RouteType } from '~/src/typings/router';
const Layout = () => import('@/layout/index.vue');

export default {
  name: 'ErrorPage',
  path: '/error-page',
  component: Layout,
  redirect: '/error-page/404',
  meta: {
    title: 'ErrorPage',
    order: 99,
    icon: 'mdi:alert-circle-outline',
    role: ['admin']
  },
  children: [
    {
      name: 'ERROR-404',
      path: '404',
      component: () => import('./404.vue'),
      meta: {
        title: '404',
        icon: 'tabler:error-404',
        role: ['admin']
      }
    }
  ]
} as RouteType;
