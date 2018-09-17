// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/login',
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/login',
    icon: 'android-apps',
    name: 'login',
    title: '登录',
    component: () => import('@/views/login/pages/login.vue')
  },
  {
    path: '/register',
    icon: 'android-apps',
    name: 'register',
    title: '注册',
    component: () => import('@/views/login/pages/register.vue')
  },
  {
    path: '/resetPassword',
    icon: 'android-apps',
    name: 'resetPassword',
    title: '重置密码',
    component: () => import('@/views/login/pages/resetPassword.vue')
  },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  otherRouter,
  ...appRouter,
];
