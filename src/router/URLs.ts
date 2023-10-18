import {baseUrl, Roles} from "@/utils/constants";

export const spDetail = '/tien-trinh'
export const processMgmt = '/quan-ly-giao-dich'
export const pjInfoBase = '/thong-tin-du-an'
export const homeURL = '/home'
export const requestDetailUrl = '/chi-tiet-yeu-cau'
// region Sales
const salesBaseUrl = baseUrl[Roles.Sales];
export const S_DASHBOARD_URL = salesBaseUrl + '/trang-chu';
// export const S_UNITS_URL = salesBaseUrl + '/gio-hang';
export const S_UNITS_URL = '';

// export const S_UNIT_DETAIL_URL = salesBaseUrl + '/sales_unit';
export const S_UNIT_DETAIL_URL =  'can-ho';

export const S_CUSTOMERS_URL = salesBaseUrl + '/khach-hang';
// export const S_CUS_DETAIL_URL = salesBaseUrl + '/chi-tiet-khach-hang';
export const S_CUS_DETAIL_URL = 'chi-tiet-khach-hang'

// export const S_CUS_UPDATE_URL = salesBaseUrl + '/cap-nhat-khach-hang'
export const S_CUS_UPDATE_URL = 'cap-nhat-khach-hang'

export const S_INQUIRIES_URL = salesBaseUrl + '/unit_inquiries';
// export const S_INQ_DETAIL_URL = salesBaseUrl + '/yeu-cau';
export const S_INQ_DETAIL_URL = 'yeu-cau';

export const S_APPOINTMENTS_URL = salesBaseUrl + '/appointment_schedule';
export const S_REQUESTS_URL = salesBaseUrl + '/request';
export const S_CREATE_CUS_URL = salesBaseUrl + '/tao-moi';
export const S_INSTRUCTION_URL = salesBaseUrl + '/instruction';
export const S_SPS_URL = salesBaseUrl + '/quan-ly-giao-dich';
export const S_SP_DETAIL_URL = salesBaseUrl + spDetail;
export const S_CHAT = salesBaseUrl + '/tin-nhan';

// export const S_PAIREDINQ = salesBaseUrl + '/tu-van'
export const S_PAIREDINQ =  'tu-van'


export const S_PSP_URL = salesBaseUrl + '/tien-trinh-ca-nhan'
// export const S_PJ_PICK = salesBaseUrl + '/chon-du-an'
export const S_PJ_PICK = '/chon-du-an'
// export const S_PJ_INFO = salesBaseUrl + pjInfoBase
export const S_PJ_INFO = 'thong-tin-du-an'
// endregion

// region Manager
const managerBaseUrl = baseUrl[Roles.Manager];
export const MG_SPS_URL = managerBaseUrl + processMgmt;
export const MG_SP_DETAIL_URL = managerBaseUrl + spDetail;
export const MG_APPOINTMENTS_URL = managerBaseUrl + '/lich-hen';
export const MG_SP_SET_AGENT_URL = managerBaseUrl + '/phan-quyen';
export const MG_REQUEST_MGMT = managerBaseUrl + '/quan-ly-yeu-cau-can'
export const MG_U_REQUEST_DETAIL_URL = managerBaseUrl + requestDetailUrl

// endregion

// region Agent
const agentBaseUrl = baseUrl[Roles.Agent];
export const A_SPS_URL = agentBaseUrl + processMgmt ;
export const A_SP_DETAIL_URL = agentBaseUrl + spDetail;
export const A_CART_MGMT_URL = agentBaseUrl + '/';
export const A_U_UP_HISTORY_URL = agentBaseUrl + '/lich-su-cap-nhat';
export const A_U_VERIFY_URL = agentBaseUrl + '/xac-thuc';
export const A_U_REQUESTS_URL = agentBaseUrl + '/unit_requests';
export const A_EXP_CONTRACT_URL = agentBaseUrl + '/den-han-hop-dong';
export const A_PJ_MGMT_URL = agentBaseUrl + pjInfoBase;
export const A_PJ_DETAIL_URL = agentBaseUrl + '/chi-tiet-du-an';
export const A_LAYOUT_MGMT_URL = agentBaseUrl + '/quan-ly-layout';
export const A_PJ_IMG_MGMT = agentBaseUrl + '/pj_img_mgmt';
export const A_LAYOUT_DETAIL_URL = agentBaseUrl + '/chi-tiet-layout';
export const A_CHAT = agentBaseUrl + '/tin-nhan'
export const A_APPOINTMENTS_URL = agentBaseUrl + '/quan-ly-lich-hen';
export const A_UPLOAD_PJ_IMG = agentBaseUrl + '/quan-ly-hinh-anh'
export const A_U_REQUEST_MGMT = agentBaseUrl + '/quan-ly-yeu-cau-can'
export const A_U_REQUEST_DETAIL = agentBaseUrl + requestDetailUrl
export const A_PJ_MP = agentBaseUrl + '/mat-bang-tang'
export const A_MP_MGMT = agentBaseUrl + '/chi-tiet-mat-bang-tang'

// endregion


// region Telesale
const teleBaseUrl = baseUrl[Roles.Tele];
export const T_PJ_PICK_URL = teleBaseUrl + '/chon-du-an';
export const T_CALL_URL = teleBaseUrl + '/goi';
export const T_STATS_URL = teleBaseUrl + '/thong-ke';
export const T_ARCHIVED_URL = teleBaseUrl + '/luu-tru';
// endregion


// region Admin
const adminBaseUrl = baseUrl[Roles.Admin];
export const AD_CUSTOMER_URL = adminBaseUrl + '/khach-hang';
export const AD_UNIT_URL = adminBaseUrl + '/gio-hang';
export const AD_HR_URL = adminBaseUrl + '/nhan-su';
export const AD_CALL_STATS_URL = adminBaseUrl + '/thong-ke';
export const AD_SP_URL = adminBaseUrl + '/giao-dich';
export const AD_UR_URL = adminBaseUrl + '/tim-can';
export const AD_REF_URL = adminBaseUrl + '/gioi-thieu';
// endregion


// region A.Assistant
const aasBaseUrl = baseUrl[Roles.AAS];
export const AAS_CALL_URL = aasBaseUrl + '/';
export const AAS_U_UP_HISTORY_URL = aasBaseUrl + '/lich-su-cuoc-goi';
// endregion


// region FPUser
const fpUserBaseUrl = baseUrl['fpUser'];
export const FPU_INFO_URL = fpUserBaseUrl + '/thong-tin';
export const FPU_CHANGE_PW = fpUserBaseUrl + '/doi-mat-khau';
export const FPU_SETTING = fpUserBaseUrl + '/tuy-chinh'
// endregion


// region Guest
const fpGuestBaseUrl = baseUrl[Roles.Guest]
export const FpGuestCart = fpGuestBaseUrl + '/chon-du-an'
export const GUEST_UNITS_URL = fpGuestBaseUrl + '/gio-hang'
export const FpGuestLobby = '/'
// endregion


//region FpUnitImg
export const fpUnitBaseUrl = '/can-ho'

export const fpHodBaseUrl = baseUrl[Roles.HoD]
export const FpHoDRequest = fpHodBaseUrl + '/yeu-cau'
export const FpHoDRpBug = fpHodBaseUrl + '/bao-loi'
