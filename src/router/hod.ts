import type {RouteRecordRaw} from 'vue-router';
import {FpHoDRequest, FpHoDRpBug} from "@/router/URLs";

const hod: Array<RouteRecordRaw> = [
    {
        path: FpHoDRequest,
        name: 'Hod Request Page',
        component: () => (import('@/views/FpHoD/FpHoDRequest.vue')),
        meta: {
            title: 'Yêu cầu tính năng',
        }
    },
    {
        path:FpHoDRpBug,
        name:'HoD Report Bug',
        component: () => (import('@/views/FpHoD/FpHodReportBug.vue')),
        meta: {
            title: 'Báo cáo lỗi',
        }
    }
]
export default hod
