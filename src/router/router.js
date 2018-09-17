import Main from '@/views/Main.vue';
import api from '@/api/server';

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: (() => {
    let str;
    if (typeof userType !== 'undefined') str = {5: '/manage/user-list', 6: '/manage/relate-list'}[userType] || 5;
    return str;
  })(),
  component: Main,
  children: [
    {path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue')},
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = (() => {
  let routePath = []

  if (typeof userType !== 'undefined') {
    (userType === 5 && (() => {
      routePath.push({
        path: '/manage',
        icon: 'android-apps',
        name: 'manage',
        title: '管理',
        component: Main,
        children: [
          {
            path: 'user-list',
            title: '人员列表',
            name: 'user-list',
            icon: 'android-contacts',
            component: () => import('@/views/user/user-list.vue')
          },
          {
            path: 'device-list',
            title: '设备管理',
            name: 'device-list',
            icon: 'settings',
            component: () => import('@/views/user/device-list.vue')
          },
          {
            path: 'group-list',
            title: '工种分类',
            name: 'group-list',
            icon: 'pricetags',
            component: () => import('@/views/user/group-list.vue')
          },
          {
            path: 'admin-list',
            title: '管理员列表',
            name: 'admin-list',
            icon: 'person-stalker',
            component: () => import('@/views/user/admin-list.vue')
          },
          {
            path: 'rule-list',
            title: '设置规则',
            name: 'rule-list',
            icon: 'clipboard',
            component: () => import('@/views/user/rule-list.vue')
          },
          {
            path: 'screen-list',
            title: '屏幕管理',
            name: 'screen-list',
            icon: 'monitor',
            component: () => import('@/views/user/screen-list.vue')
          },
          {
            path: 'plan-list',
            title: '加分计划',
            name: 'plan-list',
            icon: 'plus',
            component: () => import('@/views/user/plan-list.vue')
          },
          {
            path: 'inOut-list',
            title: '出勤日志',
            name: 'inOut-list',
            icon: 'compose',
            component: () => import('@/views/user/inOut-list.vue')
          },
        ]
      });
    })()) || (userType === 6 && (() => {
      routePath.push({
        path: '/manage',
        icon: 'android-apps',
        name: 'manage',
        title: '管理',
        component: Main,
        children: [
          {
            path: 'relate-list',
            title: '人员关联',
            name: 'relate-list',
            icon: 'android-people',
            component: () => import('@/views/project/relate-list.vue')
          },
          {
            path: 'project-list',
            title: '项目管理',
            name: 'project-list',
            icon: 'ios-folder',
            component: () => import('@/views/project/project-list.vue')
          }
        ]
      });
    })())
  }

  return routePath;
})();

/*export const appRouter = [
  {
    path: '/manage',
    icon: 'android-apps',
    name: 'manage',
    title: '人员管理',
    component: Main,
    children: [
      {
        path: 'user-list',
        title: '人员列表',
        name: 'user-list',
        showMenu: (typeof userType !== 'undefined' && userType === 5),
        icon: 'settings',
        component: () => import('@/views/user/user-list.vue')
      },
      {
        path: 'relate-list',
        title: '人员关联',
        name: 'relate-list',
        showMenu: (typeof userType !== 'undefined' && userType === 6),
        icon: 'settings',
        component: () => import('@/views/user/relate-list.vue')
      }
    ]
  }
];*/

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  otherRouter,
  ...appRouter,
];
