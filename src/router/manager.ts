import {
    MG_SPS_URL,
    MG_SP_DETAIL_URL,
    MG_APPOINTMENTS_URL,
    MG_SP_SET_AGENT_URL,
    A_U_REQUEST_MGMT,
    MG_REQUEST_MGMT,
    A_U_REQUEST_DETAIL, MG_U_REQUEST_DETAIL_URL
} from "@/router/URLs";
import type{ RouteRecordRaw } from 'vue-router';
import {Roles} from "@/utils/constants";
const manager : Array<RouteRecordRaw> = [
    {
        path: MG_SPS_URL,
        name: 'Manager Sale Processes',
        component:() => (import('@/views/ManagerView/ManagerSPS.vue')),
        meta: {
            title: 'Quản lý giao dịch',
        }
    },
    {
        path: MG_SP_DETAIL_URL + '-:spID',
        name: 'Manager SPS',
        component: () => (import('@/views/ManagerView/ManagerSPDetail.vue')),
        meta: {
            title: 'Giao dịch',
        }
    },
    {
        path: MG_APPOINTMENTS_URL,
        name: 'Manager Appointment Mgmt',
        component: () => (import('@/views/ManagerView/ManagerAppoint.vue')),
        meta: {
            title: 'QL lịch hẹn',
        }
    },
    {
        path: MG_SP_SET_AGENT_URL,
        name: 'Manager Agent Set',
        component: () => (import('@/views/ManagerView/MGSPSetAgent.vue')),
        meta: {
            title: 'Phân quyền Agent',
        }
    },
    {
        path: MG_REQUEST_MGMT ,
        name: 'Manager Unit Request mgmt',
        component:() => (import('@/views/UnitRequestView/URequestMgmt.vue')),
        props: (route:any) => (
            {
                role:Roles.Manager,
                notInitialized:route.query.notInitialized
            }),
        meta: {
            title: 'QL yêu cầu căn',
        }
    },
    {
        path: MG_U_REQUEST_DETAIL_URL + '-:requestID',
        name: 'Manager Unit Request Detail',
        component:() => (import('@/views/UnitRequestView/URequestDetail.vue')),
        props: () => (
            {
                role: Roles.Manager
            }),
        meta: {
            title: 'Yêu cầu căn',
        }
    },
]
export default manager
