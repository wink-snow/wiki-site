import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

// 为了更好地组织 Wiki 相关的路由，我们可以创建一个 Wiki 布局组件。
// 这个组件包含了侧边栏和主内容区，而具体的 Wiki 页面（如武器、角色）将作为它的子路由渲染。
import WikiLayout from '@/layouts/WikiLayout.vue';
import WikiHome from '@/views/wiki/WikiHome.vue';
import Weapons from '@/views/wiki/Weapons.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    // 所有 /wiki/:gameId/... 的路径都会使用 WikiLayout 组件
    path: '/wiki/:gameId',
    component: WikiLayout,
    props: true, // 将路由参数 (:gameId) 作为 props 传递给 WikiLayout 组件
    children: [
      {
        // 当访问 /wiki/:gameId 时，默认显示这个组件
        path: '', 
        name: 'WikiHome',
        component: WikiHome,
      },
      {
        // 示例：武器列表页
        path: 'weapons', // 注意这里是相对路径，最终 URL 是 /wiki/:gameId/weapons
        name: 'WikiWeapons',
        component: Weapons,
      },
    ],
  },
  // 你可以添加一个404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'), // 懒加载
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;