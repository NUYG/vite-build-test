import {
     S_CREATE_CUS_URL,
    S_CUS_DETAIL_URL, S_CUS_UPDATE_URL,
    S_CUSTOMERS_URL,
    S_DASHBOARD_URL, S_INQ_DETAIL_URL,
    S_INSTRUCTION_URL, S_PAIREDINQ, S_REQUESTS_URL, S_SP_DETAIL_URL, S_SPS_URL,
    S_PSP_URL, S_CHAT
} from "@/router/URLs";


import type {RouteRecordRaw} from 'vue-router';
import {Roles} from "@/utils/constants";

interface BreadcrumbData {
    label: string;
    path: string;
}

const sales: Array<RouteRecordRaw> = [
    {
        path: S_DASHBOARD_URL,
        name: 'Sales Dashboard',
        meta: {
            title: 'Trang chủ',
        },
        children: [
            {
                path: '',
                name: 'Dashboard ',
                component: () => import('@/views/SalesView/SDashboard.vue'),
            },
        ]
    },
    {
        path: S_CUSTOMERS_URL,
        name: 'Sales Customers',
        component: () => (import('@/views/SalesView/SalesCusMgmt.vue')),
        meta: {
            title: 'Khách hàng',
        },
        children: [
            {
                path: S_CUS_DETAIL_URL + '-:cusID',
                name: 'Sales cus detail general',
                component: () => (import('@/views/SalesView/SalesCusGeneral.vue')),
                meta: {
                    matchedProps:true,
                    title:'Khách hàng',
                    breadcrumb: (route: any): BreadcrumbData => {
                        const cusData = route.instances?.default?.cusData
                        const cusName: string = cusData?.name
                        const breadcrumbPath: string = `${S_CUSTOMERS_URL}/chi-tiet-khach-hang-${cusData?.id}`;
                        return {
                            label: `${cusName}`,
                            path: breadcrumbPath,
                        };
                    },
                },
                children: [
                    {
                        path: S_CUS_UPDATE_URL + '-:cusID',
                        name: 'update cus data',
                        component: () => (import('@/views/SalesView/SalesCusDetail.vue')),
                        meta: {
                            title: 'Cập nhật',
                        }
                    },
                    {
                        path: S_PAIREDINQ + '-nhu-cau-:inqId?',
                        name: 'Sales paired inq',
                        component: () => (import('@/views/SalesView/SalesPairedUnit/SalesPairedInq.vue')),
                        meta: {
                            title: 'Ghép căn ',
                        }
                    },
                    {
                        path: S_INQ_DETAIL_URL + '/:inqID',
                        name: 'Sales UInquiry',
                        component: () => (import('@/views/SalesView/SalesInqDetail.vue')),
                        meta: {
                            title: 'Nhu cầu',
                        }
                    },
                ]
            },
            {
                path: S_CREATE_CUS_URL + '/:cusID?',
                name: 'Sales Create Inq Cus',
                component: () => (import('@/views/SalesView/SalesCusCreate.vue')),
                meta: {
                    title: 'Tạo mới',
                }
            },
        ]
    },
    {
        path: S_REQUESTS_URL,
        name: 'Sales Requests',
        component: () => (import('@/views/UnitRequestView/URequestMgmt.vue')),
        props: (route: any) => ({defaultStt: route.query.status, role: Roles.Sales}),
        meta: {
            title: 'QL yêu cầu căn hộ',
        }
    },

    {
        path: S_INSTRUCTION_URL,
        name: 'Sales Instruction',
        component: () => (import('@/views/SalesView/SalesInstruction.vue')),
        meta: {
            title: 'Hướng dẫn',
        }
    },
    {
        path: S_SPS_URL,
        name: 'Sales SPs',
        component: () => (import('@/views/SalesView/SalesSPS.vue')),
        props: (route: any) => ({status: route.query.status})
    },
    {
        path: S_SP_DETAIL_URL + '-:spID',
        name: 'Sales SP',
        component: () => (import('@/views/SalesView/SalesSPDetail.vue')),
        meta: {
            title: 'Giao dịch',
        }
    },

    {
        path: S_PSP_URL,
        name: 'Sales Personal SP Detail',
        component: () => (import('@/views/SalesView/SalesPersonal/PersonalSPDetail.vue')),
        props: (route: any) => (
            {
                pspID: parseInt(route.query.pspID),
                setEditDefault: parseInt(route.query.setEditDefault)
            }
        )
    },
    {
        path: S_CHAT + ':reqChatId?',
        name: 'SalesChat',
        component: () => (import('@/views/FpChat/FpChatView.vue')),
        props: (route: any) => ({
            role: 'Sales',
        }),
        meta: {
            title: 'Tin nhắn',
        }
    },
]

export default sales
