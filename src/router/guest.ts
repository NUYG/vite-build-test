import {FpGuestCart, GUEST_UNITS_URL, FpGuestLobby} from "@/router/URLs";

import type {RouteRecordRaw} from 'vue-router';
import {Roles} from "@/utils/constants";

const guest: Array<RouteRecordRaw> = [
    {
        path: FpGuestCart,
        name: 'Guest project pick',
        component: () => (import('@/views/GuestPage/GuestView.vue')),
        meta: {
            title: 'Giỏ hàng khách',
        }
    },
    {
        path: FpGuestLobby,
        name: 'Guest Lobby',
        component: () => (import('@/views/GuestPage/GuestLobby.vue')),
        meta: {
            title: 'Giới thiệu',
        }
    },
    {
        path: GUEST_UNITS_URL + '/:renting-:pjName/:unitId?',
        name: 'Guest units',
        component: () => (import('@/views/SalesView/SalesUnits.vue')),
        props: (route: any) => (
            {
                role: Roles.Guest,
            }
        ),
        meta: {
            title: 'Giỏ hàng khách',
        }
    },
]
export default guest
