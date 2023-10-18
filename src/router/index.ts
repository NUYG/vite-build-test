import {createRouter, createWebHistory} from 'vue-router'
import teleRouter from "./tele";
import adminRouter from "./admin";
import salesRouter from "./sales";
import agentRouter from "./agent";
import assistantRouter from "./asssistant";
import managerRouter from "./manager";
import fpUserRouter from "./fpUser";
import guestRouter from "@/router/guest";
import fpUnitImg from '@/router/unitImg'
import hodRouter from '@/router/hod'
import type {RouteRecordRaw} from 'vue-router';
import {FPU_CHANGE_PW, homeURL} from "@/router/URLs";
import cartRouter from "@/router/cartRouter";



const AllRoutes: Array<RouteRecordRaw> = [
    // add your custom routes here
    {
        path: homeURL,
        name: 'home',
        component: () => (import('@/views/HomeView.vue')),
    },
    {
        path: '/test_map',
        name: 'test',
        component: () => (import('@/views/GoogleMap/TestMap.vue')),
    },
    {
        path:'/socket',
        name:'socket',
        component: () => (import('@/socketIO/chatListenSocket.vue'))
    },
    {
        path: '/login',
        name: 'Login',
        component: () => (import('@/views/Authencation/LoginView.vue')),
    },
    {
        path: '/login',
        name: 'Login2',
        component: () => (import('@/views/Authencation/LoginView.vue')),
    },
    {
        path: '/resetPw',
        name: 'resetPw',
        component: () => (import('@/views/Authencation/ResetPw.vue')),
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => (import('@/views/MainView.vue'))
    },
    {
        path: '/register',
        name: 'Register',
        component: () => (import('@/views/Authencation/RegisterView.vue')),
    },
    {
        path: FPU_CHANGE_PW,
        name: 'ChangePW',
        component: () => (import('@/views/Authencation/PwChange.vue')),
    },
    {
        path: '/notification',
        name: 'notification',
        component: () => (import('@/components/FpNotification/MobileNotification.vue')),
    },
    ...fpUnitImg,
    ...guestRouter,
    ...teleRouter,
    ...adminRouter,
    ...salesRouter,
    ...managerRouter,
    ...agentRouter,
    ...assistantRouter,
    ...fpUserRouter,
    ...hodRouter,
    ...cartRouter
];

const router = createRouter({
    history: createWebHistory(),
    routes: AllRoutes as RouteRecordRaw[]
});

router.beforeEach((to, from, next) => {
  const title: string = to.meta.title ? to.meta.title.toString() : '';
  document.title = title ? title : 'More';
  next();
})


export default router;
