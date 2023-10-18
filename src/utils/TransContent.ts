import {URequestSttEnum} from "@/models/unitRequest";
import {UnitType} from "@/utils/dataLib";
import {translate} from "@/utils/utils";

const UNIT_STATUS = [
    ['notContact', 'Chưa liên lạc'],
    ['wrong', 'Sai thông tin'],
    ['available', 'Tìm khách hàng'],
    ['cantContact', 'Không liên lạc được'],
    ['noRespond', 'Không nghe máy'],
    ['notAvail', 'Không nhu cầu'],
    ['staying', 'Đang ở'],
]


const FURNITURE = [
    ['fully', 'Đầy đủ'],
    ['partly', 'Cơ bản'],
]


const CONTACTOR_STATUS = [
    ['active', 'Hoạt động'],
    ['inactive', 'Ngưng hoạt động'],
]


const POINTING = [
    ['east', 'Đông'],
    ['west', 'Tây'],
    ['south', 'Nam'],
    ['north', 'Bắc'],
    ['southeast', 'Đông Nam'],
    ['northeast', 'Đông Bắc'],
    ['southwest', 'Tây Nam'],
    ['northwest', 'Tây Bắc'],
    ['southeast, northeast', 'Đông Nam, Đông Bắc'],
    ['southeast, southwest', 'Đông Nam, Tây Nam'],
    ['northeast, northwest', 'Đông Bắc, Tây Bắc'],
    ['southwest, northwest', 'Tây Nam, Tây Bắc'],
    ['', 'Chưa có thông tin'],
]

export const BASIC_POINTING = [
    ['east', 'Đông'],
    ['west', 'Tây'],
    ['south', 'Nam'],
    ['north', 'Bắc'],
    ['southeast', 'Đông Nam'],
    ['northeast', 'Đông Bắc'],
    ['southwest', 'Tây Nam'],
    ['northwest', 'Tây Bắc'],
    ['', 'Không'],
]

const VIEW = [
    ['', ''],
    ['river', 'Sông'],
    ['landmark', 'Biểu tượng'],
    ['road', 'Đại lộ'],
    ['pool', 'Hồ bơi'],
    ['park', 'Công viên'],
    ['inner', 'Nội khu'],
    ['city', 'Thành phố'],
]
const HEIGHT = [
    ['low', 'Thấp'],
    ['mid', 'Trung'],
    ['high', 'Cao'],
]

const UNIT_TYPE = [
    [UnitType.APART, 'Căn hộ'],
    [UnitType.SHOPHOUSE, 'Shophouse'],
    [UnitType.OFFICETEL, 'Officetel'],
    [UnitType.STUDIO, 'Studio'],
    [UnitType.PENTHOUSE, 'Penthouse'],
    [UnitType.DUPLEX, 'Duplex'],
    [UnitType.SKY, 'Sky'],
    [UnitType.NP, 'Nhà phố'],
    [UnitType.GARDEN, 'Garden'],
]

const U_REQUEST_STT = [
    [URequestSttEnum.PROCESSING, 'Đang xử lý'],
    [URequestSttEnum.DONE, 'Đã xử lý'],
    [URequestSttEnum.CANCELED, 'Đã hủy'],
]

export enum SPSttEnum {
    WAITING = 'waiting',
    DEPOSIT = 'depositing',
    NOTARIZE = 'notarizing',
    SIGNING = 'signing',
    DONE = 'done',
    OWN_CANCEL = 'ownCanceled',
    CUS_CANCEL = 'cusCanceled',
}

const SALE_PROCESS_STATUS = [
    [SPSttEnum.WAITING, 'Hẹn xem nhà'],
    [SPSttEnum.DEPOSIT, 'Hẹn cọc'],
    [SPSttEnum.NOTARIZE, 'Hẹn công chứng'],
    [SPSttEnum.SIGNING, 'Hẹn bàn giao nhà'],
    [SPSttEnum.DONE, 'Đã giao dịch'],
    [SPSttEnum.OWN_CANCEL, 'Chủ tạm hoãn'],
    [SPSttEnum.CUS_CANCEL, 'Khách tạm hoãn'],
]

export const SP_STATUS_AD_SELL = {
    [SPSttEnum.WAITING]: 'Tư vấn',
    [SPSttEnum.DEPOSIT]: 'Đã xem nhà',
    [SPSttEnum.NOTARIZE]: 'Đã cọc',
    [SPSttEnum.SIGNING]: 'Đã công chứng',
    [SPSttEnum.DONE]: 'Đã giao dịch',
    [SPSttEnum.OWN_CANCEL]: 'Chủ tạm hoãn',
    [SPSttEnum.CUS_CANCEL]: 'Khách tạm hoãn',
}

export const SP_STATUS_AD_RENT = {
    [SPSttEnum.WAITING]: 'Tư vấn',
    [SPSttEnum.DEPOSIT]: 'Đã xem nhà',
    [SPSttEnum.NOTARIZE]: 'Đã cọc',
    [SPSttEnum.SIGNING]: 'Đã cọc',
    [SPSttEnum.DONE]: 'Đã giao dịch',
    [SPSttEnum.OWN_CANCEL]: 'Chủ tạm hoãn',
    [SPSttEnum.CUS_CANCEL]: 'Khách tạm hoãn',
}


const GENDERS = [
    ['male', 'Nam'],
    ['female', 'Nữ'],
    ['other', 'Khác'],
    ['notShare', 'Không chia sẻ'],
]

const CUSTOMER_SOURCE = [
    ['zalo', 'Zalo'],
    ['fb', 'Facebook'],
    ['bds', 'Batdongsan.com.vn'],
    ['chotot', 'Chotot'],
    ['website', 'Website'],
    ['data', 'Data mua'],
    ['other', 'Khác'],
]

enum PjHocEnum {
    NONE = 0,
    PROCESSING = 10,
    DONE = 20
}

const PJ_HOC_STATUS = {
    [PjHocEnum.NONE]: 'Không có sổ',
    [PjHocEnum.PROCESSING]: 'Đang làm sổ',
    [PjHocEnum.DONE]: 'Có sổ',
}

export const getPjHocSts = (stt: PjHocEnum) => {
    return PJ_HOC_STATUS[stt]
};

const INTERNET_PROVIDER = [
    ['fpt', 'FPT'],
    ['viettel', 'Viettel'],
    ['vnpt', 'VNPT'],
]


const viewsTranslate = (views:Array<any>) => {
    let view = ''
    if (views && views.length) {
        views.map(el => {
            view = view + translate(VIEW, el) + ' '
        })
    }
    return view
}

export {
    SALE_PROCESS_STATUS, FURNITURE, CONTACTOR_STATUS,
    HEIGHT, VIEW, POINTING, UNIT_STATUS,
    GENDERS, CUSTOMER_SOURCE,
    PJ_HOC_STATUS, U_REQUEST_STT, INTERNET_PROVIDER, UNIT_TYPE,viewsTranslate
}
