import {SPSttEnum} from "@/utils/TransContent";

export const SPSttLevel: {[index: string]: number} = {
    [SPSttEnum.OWN_CANCEL]: -10,
    [SPSttEnum.CUS_CANCEL]: -10,
    [SPSttEnum.WAITING]: 0,
    [SPSttEnum.DEPOSIT]: 2,
    [SPSttEnum.NOTARIZE]: 4,
    [SPSttEnum.SIGNING]: 6,
    [SPSttEnum.DONE]: 8,
};


export const ProgressLevel: {[index: number]: string} = {
    0: "waiting",
    1: "depositing",
    3: "notarizing",
    5: "signing",
    7: "done",
};


export const NextBtnTxt: {[index: number]: string} = {
    0: "Đã xem nhà",
    2: "Đã cọc",
    4: "Đã công chứng",
    6: "Đã ký hợp đồng",
};

