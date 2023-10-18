import {T_ARCHIVED_URL, T_CALL_URL, T_PJ_PICK_URL, T_STATS_URL} from "@/router/URLs";
import type{ RouteRecordRaw } from 'vue-router';

const tele  : Array<RouteRecordRaw> =  [
    {
        path: T_PJ_PICK_URL,
        name: 'Tele Project Pick',
        component:() => (import('@/views/TeleView/PjPick.vue')),
        meta: {
            title: 'Chọn dự án',
        }
    },
    {
        path: T_CALL_URL,
        name: 'Tele Call Page',
        component:() => (import('@/views/TeleView/TeleCall.vue')),
        props: (route:any) => ({ unitId: route.query.unit }),
        meta: {
            title: 'Gọi',
        }
    },
    {
        path: T_STATS_URL,
        name: 'Tele Statistic',
        component:() => (import('@/views/TeleView/TeleStats.vue')),
        meta: {
            title: 'Lịch sử gọi',
        }
    },
    {
        path: T_ARCHIVED_URL,
        name: 'Tele Archived Units',
        component:() => (import('@/views/TeleView/ArchivedUnits.vue')),
        meta: {
            title: 'Căn hộ lưu trữ',
        }
    },
    {
        path: '/test_firebase',
        name: 'TestFirebase',
        // component: FirebaseTest
        component:() => (import('@/views/TestView/FirebaseTest.vue'))
    },
]
export default tele