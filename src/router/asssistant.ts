import {AAS_CALL_URL, AAS_U_UP_HISTORY_URL} from "@/router/URLs";
import type { RouteRecordRaw } from 'vue-router';
const assistant : Array<RouteRecordRaw> = [
    {
        path: AAS_CALL_URL,
        name: 'Agent Assistant Call',
        component: () => (import('@/views/AgentAssistantView/AgentAssistantCall.vue')),
        meta: {
            title: 'Gọi',
        }
    },
    {
        path: AAS_U_UP_HISTORY_URL,
        name: 'Agent Assistant Call History',
        component: () => (import('@/views/TeleView/TeleStats.vue')),
        meta: {
            title: 'Lịch sử gọi',
        }
    },
]
export default assistant