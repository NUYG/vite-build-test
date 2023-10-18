import {
    A_APPOINTMENTS_URL,
    A_CART_MGMT_URL,
    A_EXP_CONTRACT_URL,
    A_PJ_MGMT_URL,
    A_SP_DETAIL_URL,
    A_SPS_URL,
    A_U_UP_HISTORY_URL,
    A_U_VERIFY_URL,
    A_U_REQUESTS_URL,
    A_PJ_DETAIL_URL,
    A_LAYOUT_MGMT_URL,
    A_LAYOUT_DETAIL_URL,
    A_PJ_IMG_MGMT,
    A_UPLOAD_PJ_IMG,
    A_U_REQUEST_MGMT,
    A_U_REQUEST_DETAIL,
    A_PJ_MP, A_MP_MGMT, A_CHAT
} from "@/router/URLs";
import type{ RouteRecordRaw } from 'vue-router';
import {Roles} from "@/utils/constants";

const agent : Array<RouteRecordRaw> = [
    {
        path: A_CART_MGMT_URL,
        name: 'Agent Cart',
        component:() => (import('@/views/AgentView/AgentCart/AgentCartView.vue')),
        props: {
            currentPage: 'Agent'
        },
        meta: {
            title: 'Giỏ hàng',
        }
    },
    {
        path: A_U_UP_HISTORY_URL,
        name: 'Agent update history',
        component:() => (import('@/views/AgentView/AgentUpdateHistory/AgentUpdatePage.vue')),
        meta: {
            title: 'Lịch sự cuộc gọi',
        }
    },
    {
        path: A_U_VERIFY_URL,
        name: 'Agent verify units',
        component:() => (import('@/views/AgentView/AgentUnitVerify/AgentVerifyUnit.vue')),
        meta: {
            title: 'Xác thực giỏ hàng',
        }
    },
    // {
    //     path: A_U_REQUESTS_URL,
    //     name: 'Agent request unit',
    //     component:() => (import('@/views/AgentView/AgentRequest/AgentRequestView.vue'))
    // },
    {
        path: A_PJ_MP + '-du-an-:pjId',
        name: 'Agent project mp',
        component:() => (import('@/views/AgentView/AgentProject/MasterPlan/MasterPlan.vue')),
        meta: {
            title: 'Mặt bằng tầng',
        }
    },
    {
        path: A_MP_MGMT + '-mat-bang-tang-:masterPlanID-du-an-:pjID-block-:blockID',
        name: 'MasterPlan mgmt',
        component:() => (import('@/views/AgentView/AgentProject/MasterPlan/MasterPMgmt.vue')),
        meta: {
            title: 'Quản lý mặt bằng tầng',
        }
    },
    {
        path: A_EXP_CONTRACT_URL,
        name: 'Agent expiring contract',
        component:() => (import('@/views/AgentView/AgentExpiringContract/ExpiringContract.vue')),
        meta: {
            title: 'Căn hộ sắp hết hạn',
        }
    },
    {
        path: A_PJ_MGMT_URL,
        name: 'Agent PJ mgmt',
        component:() => (import('@/views/AgentView/AgentProject/Project/AgentPjManagementView.vue')),
        meta: {
            title: 'Quản lý dự án',
        }
    },
    {
        path: A_SP_DETAIL_URL + '-:spID',
        name: 'Agent SP detail',
        component:() => (import('@/views/AgentView/AgentSPDetail.vue')),
        meta: {
            title: 'Giao dịch',
        }
    },
    {
        path: A_SPS_URL,
        name: 'Agent SPS',
        component:()=> (import('@/views/AgentView/AgentSPS.vue')),
        meta: {
            title: 'Quản lý giao dịch',
        }
    },
    {
        path: A_APPOINTMENTS_URL,
        name: 'Agent appointments',
        component:() => (import('@/views/AgentView/AgentAppoint.vue')),
        meta: {
            title: 'Quản lý lịch hẹn',
        }
    },
    {
        path: A_PJ_DETAIL_URL + '-:pjId',
        name: 'Agent Pj detail',
        component:() => (import('@/views/AgentView/AgentProject/ProjectDetail/AgentPjDetailView.vue')),
        meta: {
            title: 'Chi tiết dự án',
        }
        // props: (route:any) => ({ pjId: route.query.project })
    },
    {
        path: A_LAYOUT_MGMT_URL + '-:pjId',
        name: 'Agent Layout MGMT',
        component:() => (import('@/views/AgentView/AgentProject/AgentLayoutMn/LayoutManagementView.vue')),
        meta: {
            title: 'Quản lý layout',
        }
        // props: (route:any) => ({ pjId: route.query.project })
    },
    {
        path: A_PJ_IMG_MGMT,
        name: 'Agent Project image mgmt',
        component:() => (import('@/views/AgentView/AgentProject/AgentLayoutMn/LayoutManagementView.vue')),
        props: (route:any) => ({ pjId: route.query.project }),
        meta: {
            title: 'Hình ảnh dự án',
        }
    },
    {
        path: A_LAYOUT_DETAIL_URL + '-du-an-:pjID-layout-:layoutID',
        name: 'Agent layout detail',
        component:() => (import('@/views/CommonView/LayoutDetail.vue')),
        meta: {
            title: 'Chi tiết layout',
        }
    },
    {
        path: A_UPLOAD_PJ_IMG + '-du-an-:pjID',
        name: 'Agent upload img pj ',
        component:() => (import('@/views/AgentView/AgentProject/Project/AgentUploadPjImgOverall.vue')),
        meta: {
            title: 'Upload hình ảnh dự án',
        }
        // props: (route:any) => ({pjID: route.query.project})
    },
    {
        path: A_U_REQUEST_MGMT,
        name: 'Agent Unit Request MGMT',
        component:() => (import('@/views/UnitRequestView/URequestMgmt.vue')),
        props: () => (
            {
                role:Roles.Agent
            }),
        meta: {
            title: 'Quản lý yêu cầu căn',
        }
    },
    {
        path: A_U_REQUEST_DETAIL + '-:requestID',
        name: 'Agent Unit Request Detail',
        component:() => (import('@/views/UnitRequestView/URequestDetail.vue')),
        props: () => (
            {
                role: Roles.Agent
            }),
        meta: {
            title: 'Yêu cầu căn',
        }
    },
    {
        path: A_CHAT,
        name: 'AgentChat',
        component: () => (import('@/views/FpChat/FpChatView.vue')),
        props: {
            role: 'Agent',
        },
        meta: {
            title: 'Tin nhắn',
        }
    },

]
export default agent
