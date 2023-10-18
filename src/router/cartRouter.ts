import {S_DASHBOARD_URL, S_PJ_INFO, S_PJ_PICK, S_UNIT_DETAIL_URL} from "@/router/URLs";
import {Roles} from "@/utils/constants";
import type {RouteRecordRaw} from "vue-router";

interface BreadcrumbData {
    label: string;
    path: string;
}
const cartRouter: Array<RouteRecordRaw> = [
    {
        path: S_PJ_PICK,
        name: 'Sales Project Pick',
        component: () => import('@/views/SalesView/SalesProjectPick.vue'),
        meta: {
            title: 'Dự án',
        },
        alias: ['/fp_guest/cart'],
        children: [
            {
                path: ':renting-:pjName',
                name: 'Sales Cart',
                component: () => import('@/views/SalesView/SalesUnits.vue'),
                meta: {
                    // title: 'Giỏ hàng',
                    breadcrumb: (route: any): BreadcrumbData => {
                        const renting: string = route.params?.renting;
                        const pjName: string = route.params?.pjName;
                        const breadcrumbPath: string = `${S_PJ_PICK}/${renting}-${pjName}`;
                        return {
                            label: 'Giỏ hàng',
                            path: breadcrumbPath,
                        };
                    },
                },
                children: [
                    {
                        path: ':renting-' + S_UNIT_DETAIL_URL + '-:unitID',
                        name: 'Sales Unit Detail',
                        component: () => (import('@/views/SalesView/SalesUnitDetail/SalesUnitDetail.vue')),
                        meta: {title: 'Căn hộ'}
                    },
                    {
                        path: S_PJ_INFO + '-:pjName',
                        name: 'project information',
                        component: () => (import('@/views/FpProjectInformation/SalesProjectInfoView.vue')),
                        props: (route: any) => (
                            {
                                role: Roles.Sales,
                            }
                        ),
                        meta: {
                            title: 'Dự án',
                        }
                    },
                ]
            },
        ],
    }
]
export default cartRouter
