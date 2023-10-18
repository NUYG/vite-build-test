import {
    A_APPOINTMENTS_URL,
    A_CART_MGMT_URL,
    A_CHAT,
    A_EXP_CONTRACT_URL,
    A_PJ_MGMT_URL,
    A_SPS_URL,
    A_U_REQUEST_MGMT,
    A_U_UP_HISTORY_URL,
    A_U_VERIFY_URL,
    AAS_CALL_URL,
    AAS_U_UP_HISTORY_URL,
    AD_CALL_STATS_URL,
    AD_CUSTOMER_URL,
    AD_HR_URL,
    AD_SP_URL,
    AD_UNIT_URL,
    AD_UR_URL,
    MG_APPOINTMENTS_URL,
    MG_SP_SET_AGENT_URL,
    MG_SPS_URL,
    MG_REQUEST_MGMT,
    S_CHAT,
    S_CUSTOMERS_URL,
    S_DASHBOARD_URL,
    S_UNITS_URL,
    T_ARCHIVED_URL,
    T_PJ_PICK_URL,
    T_STATS_URL,
    S_PJ_PICK,
    S_UNIT_DETAIL_URL,
    S_SP_DETAIL_URL,
    S_CREATE_CUS_URL,
    S_CUS_UPDATE_URL,
    S_CUS_DETAIL_URL,
    FpGuestCart,
    AD_REF_URL,
    FpGuestLobby,
    FpHoDRpBug,
    FpHoDRequest
} from "@/router/URLs";
import {Roles} from "@/utils/constants";

export const roleSidebar= {
    [Roles.Admin]: {
        dashboard: {
            icon: "dashboard_icon.svg",
            content: "Thống kê",
            href: AD_CALL_STATS_URL,
            iconActive:'ChartLineUpBlack.svg',
            class: '',
        },
        hr: {
            icon: "hr_icon.svg",
            content: "Nhân sự",
            href: AD_HR_URL,
            iconActive:'UsersFourBlack.svg',
            class: '',
        },
        manage: {
            icon: "Storefront.svg",
            content: "Giỏ hàng",
            href: AD_UNIT_URL,
            iconActive:'StorefrontBlack.svg',
            class: '',
        },
        manageCus: {
            icon: "UserCircleSolid.svg",
            content: "Khách hàng",
            href: AD_CUSTOMER_URL,
            iconActive:'UserCircleBlack.svg'
        },
        psStats: {
            icon: "Handshake.svg",
            content: "Giao dịch",
            href: AD_SP_URL,
            iconActive:'HandshakeBlack.svg',
            class: '',
        },
        requestStats: {
            icon: "adminRequest.svg",
            content: "Tìm căn",
            href: AD_UR_URL,
            iconActive:'adminRequestBlack.svg',
            class: '',
        },
        referralStats: {
            icon: "Ticket.svg",
            content: "Giới thiệu",
            href: AD_REF_URL,
            iconActive:'TicketBlack.svg',
            class: '',
        },

    },
    [Roles.Agent]: {
        conversations: {
            icon: "chatIcon.svg",
            content: 'Nhắn tin',
            href: A_CHAT,
            iconActive:'ChatCircleBlack.svg',
            class: '',
        },
        cartManage: {
            icon: "Storefront.svg",
            content: "Quản lý",
            iconActive:'StorefrontBlack.svg',
            children: [
                {
                    content: "Giỏ hàng",
                    href: A_CART_MGMT_URL,
                    class: '',
                },
                {
                    content: "Xác thực",
                    href: A_U_VERIFY_URL,
                    class: '',
                },
                // {
                //     content: "Yêu cầu căn",
                //     href: A_U_REQUESTS_URL,
                // },
                {
                    content: "Đến hạn HĐ",
                    href: A_EXP_CONTRACT_URL,
                    class: '',
                },
                {
                    content: "Lịch sử",
                    href: A_U_UP_HISTORY_URL,
                    class: '',
                },
                {
                    content:'Yêu cầu',
                    href:A_U_REQUEST_MGMT,
                    class: '',
                }
            ],
            class: '',
        },
        sale_processes: {
            icon: "Handshake.svg",
            content: "Giao dịch",
            href: A_SPS_URL,
            iconActive:'HandshakeBlack.svg',
            class: '',
        },
        pjManagement: {
            icon: "Buildings.svg",
            content: "Dự án",
            href: A_PJ_MGMT_URL,
            iconActive:'BuildingsBlack.svg',
            class: '',
        },
        appointments: {
            icon: "CalendarBlank.svg",
            content: "Lịch hẹn",
            href: A_APPOINTMENTS_URL,
            iconActive:'CalendarCheckBlack.svg',
            class: '',
        },

    },
    [Roles.AAS]: {
        aAssistantCall: {
            icon: "PhoneCall.svg",
            content: "Gọi",
            href: AAS_CALL_URL,
            iconActive:'PhoneCallBlack.svg',
            class: '',
        },
        history: {
            icon: "ClockCounterClockwise.svg",
            content: "lịch sử",
            href: AAS_U_UP_HISTORY_URL,
            iconActive: "ClockCounterClockwiseBlack.svg",
            class: '',
        },
    },
    [Roles.Sales]: {
        homepage: {
            icon: "HouseSimple.svg",
            content: "Trang chủ",
            href: S_DASHBOARD_URL,
            iconActive:"HouseSimpleBlack.svg",
            class: '',
        },
        cart: {
            icon: "Storefront.svg",
            content: "Giỏ hàng",
            href:  S_PJ_PICK,
            iconActive:'StorefrontBlack.svg',
            childrenGroup:[S_PJ_PICK,S_UNITS_URL,S_UNIT_DETAIL_URL],
            class: '',
        },
        Customer: {
            icon: "UserCircleSolid.svg",
            content: "Khách hàng",
            href: S_CUSTOMERS_URL,
            iconActive:'UserCircleBlack.svg',
            childrenGroup:[S_CUSTOMERS_URL,S_CUS_DETAIL_URL,S_SP_DETAIL_URL,S_CREATE_CUS_URL,S_CUS_UPDATE_URL,S_CUSTOMERS_URL],
            class: 'pj-pick-step-1',
        },
        // sale_processes: {
        //     icon: "Handshake.svg",
        //     content: "Giao dịch",
        //     href: S_SPS_URL,
        //     iconActive:'HandshakeBlack.svg',
        // },
        sale_chat: {
            icon: "chatIcon.svg",
            content: "Nhắn tin",
            href: S_CHAT,
            iconActive:'ChatCircleBlack.svg',
            class: '',
        },
    },
    [Roles.Tele]: {
        teleCall: {
            icon: "PhoneCall.svg",
            content: "Gọi",
            href: T_PJ_PICK_URL,
            iconActive:'PhoneCallBlack.svg',
            class: '',
        },
        dashboard: {
            icon: "ClockClockwise.svg",
            content: "Thống kê",
            href: T_STATS_URL,
            iconActive: "ClockClockwise.svg",
            class: '',
        },
        archive: {
            icon: "ArchiveTray.svg",
            content: "Lưu trữ",
            href: T_ARCHIVED_URL,
            iconActive:'ArchiveTrayBlack.svg',
            class: '',
        },
    },
    [Roles.Manager]: {
        sale_processes: {
            icon: "Handshake.svg",
            content: "Giao dịch",
            href: MG_SPS_URL,
            iconActive:"HandshakeBlack.svg",
            class: '',
        },
        SPAPermission: {
            icon: "hr_icon.svg",
            content: "Phân quyền",
            href: MG_SP_SET_AGENT_URL,
            iconActive:'UsersFourBlack.svg',
            class: '',
        },
        appointments: {
            icon: "CalendarBlank.svg",
            content: "Lịch hẹn",
            href: MG_APPOINTMENTS_URL,
            iconActive:'CalendarCheckBlack.svg',
            class: '',
        },
        requestmgmt:{
            icon:'adminRequest.svg',
            content:'Yc tìm căn',
            href:MG_REQUEST_MGMT,
            iconActive:'adminRequestBlack.svg',
            class: '',
        }
    },
    [Roles.Guest]: {
        homepage: {
            icon: "HouseSimple.svg",
            content: "Trang chủ",
            // href: S_DASHBOARD_URL,
            iconActive:"HouseSimpleBlack.svg",
            class: '',
        },
        cart: {
            icon: "Storefront.svg",
            content: "Giỏ hàng",
            href: S_PJ_PICK,
            iconActive:'StorefrontBlack.svg',
            childrenGroup:[S_PJ_PICK,S_UNITS_URL,S_UNIT_DETAIL_URL],
            class: '',
        },
        Customer: {
            icon: "UserCircleSolid.svg",
            content: "Khách hàng",
            iconActive:'UserCircleBlack.svg',
            class: '',
            // childrenGroup:[S_CUSTOMERS_URL,S_CUS_DETAIL_URL,S_SP_DETAIL_URL,S_CREATE_CUS_URL,S_CUS_UPDATE_URL,S_CUSTOMERS_URL]
        },
        sale_chat: {
            icon: "chatIcon.svg",
            content: "Nhắn tin",
            // href: S_CHAT,
            iconActive:'ChatCircleBlack.svg',
            class: '',
        },
    },
    [Roles.HoD]:{
        required: {
            icon: "adminRequest.svg",
            content: "Gửi yêu cầu",
            href: FpHoDRequest,
            iconActive:'adminRequestBlack.svg',
            class: '',
        },
        reportBug: {
            icon: "adminRequest.svg",
            content: "Báo lỗi",
            href: FpHoDRpBug,
            iconActive:'adminRequestBlack.svg',
            class: '',
        },

    }
};


export const defaultRolePage = {
    [Roles.Admin]: AD_CALL_STATS_URL,
    [Roles.Agent]: A_CART_MGMT_URL,
    [Roles.AAS]: AAS_CALL_URL,
    [Roles.Sales]:  S_PJ_PICK,
    [Roles.Tele]: T_PJ_PICK_URL,
    [Roles.Manager]: MG_SP_SET_AGENT_URL,
    [Roles.Guest] : FpGuestLobby,
    [Roles.HoD] : FpHoDRpBug
}
