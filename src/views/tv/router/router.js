// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/index',
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/index',
    icon: 'android-apps',
    name: 'index',
    title: 'subway',
    component: () => import('@/views/tv/pages/index.vue')
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  otherRouter,
  ...appRouter,
];
