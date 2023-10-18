import {
    AD_CALL_STATS_URL,
    AD_CUSTOMER_URL,
    AD_HR_URL,
    AD_REF_URL,
    AD_SP_URL,
    AD_UNIT_URL,
    AD_UR_URL
} from "@/router/URLs";

import type { RouteRecordRaw } from 'vue-router';
const admin : Array<RouteRecordRaw> = [
    {
        path: AD_CUSTOMER_URL,
        name: 'Admin Customer',
        component: () => (import('@/views/AdminView/AdminCus.vue')),
        meta: {
            title: 'Quản lý khách hàng',
        }
    },
    {
        path: AD_UNIT_URL,
        name: 'Admin Manager',
        component: () => (import('@/views/AdminView/AdminUnit.vue')),
        meta: {
            title: 'Quản lý giỏ hàng',
        }
    },
    {
        path: AD_HR_URL,
        name: 'Admin Hr',
        component: () => (import('@/views/AdminView/AdminHR.vue')),
        meta: {
            title: 'Quản lý nhân sự',
        }
    },
    {
        path: AD_CALL_STATS_URL,
        name: 'Admin Dashboard',
        component: () => (import('@/views/AdminView/AdminCallStats.vue')),
        meta: {
            title: 'Quản lý cuộc gọi',
        }
    },
    {
        path: AD_SP_URL,
        name: 'Admin SP',
        component: () => (import('@/views/AdminView/AdminSP.vue')),
        meta: {
            title: 'Quản lý giao dịch',
        }
    },
    {
        path: AD_UR_URL,
        name: 'Admin Request',
        component: () => (import('@/views/AdminView/AdminRequest.vue')),
        meta: {
            title: 'Quản lý yêu cầu',
        }
    },
    {
        path: AD_REF_URL,
        name: 'Admin Referral',
        component: () => (import('@/views/AdminView/AdminRef.vue')),
        meta: {
            title: 'Quản lý giới thiệu',
        }
    },
]

export default admin
