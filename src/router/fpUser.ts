import {FPU_INFO_URL,FPU_SETTING} from "@/router/URLs";
import type{RouteRecordRaw} from "vue-router";

const  fpUser : Array<RouteRecordRaw> = [
    {
        path: FPU_INFO_URL,
        name: 'FPUser info mgmt',
        component: () => (import('@/views/FPUserView/FPUInfo.vue')),
        meta: {
            title: 'Thông tin người dùng',
        }
    },
    {
        path: FPU_SETTING,
        name: 'FPUser setting',
        component: () => (import('@/views/FPUserView/FpUserSetting.vue')),
        meta: {
            title: 'Cài đặt',
        }
    },
]
export default fpUser
