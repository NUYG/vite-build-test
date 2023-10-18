interface DataLib {
    POINTING: string[][],
    FURNITURE: string[][],
    UNIT_STATUS: string[][],
    INQUIRY_STATUS: string[][],
    REQUEST_STATUS: string[][],
    HEIGHT: string[][],
    GENDERS: string[][],
    CONTACTOR_STATUS: string[][],
    CUSTOMER_SOURCE: string[][],
    VIEW: string[][],
    SALE_PROCESS_STATUS: string[][],
    projects: string,
    userTotalCall: number,
    teleCallPjs: string[],
    UNIT_TYPE: string[][],
    SP_STATUS_AD_SELL: { [key: string]: string },
    SP_STATUS_AD_RENT: { [key: string]: string },
}

export interface DataLibRes extends Partial<DataLib> {
}
