import type {Project} from "@/models/pj";
import type {BasicContactor} from "@/models/fpUser";
import type {SwipeBoxImg} from "@/models/fpImg";

export interface DetailUnit {
    id: number,
    unitCode?: string,
    pjData: Project,
    rentingPrice: number,
    sellingPrice: number,
    rentingFeeSale: number,
    sellingFeeSale: number,
    r_fee_num?: number,
    s_fee_num?: number,
    bedroom: string,
    bathroom: number,
    size: number,
    furniture: string,
    feeCoverage: boolean,
    transferringCoverage: boolean,
    managementCoverage: boolean,
    view: string,
    view2: string,
    balcony: string,
    ownerData: BasicContactor,
    imgs?: SwipeBoxImg[],
    contractExpiry:string,
    renting:boolean,
    selling:boolean,
    new_selling:boolean,
    new_renting:boolean
}

export interface SPDetailUnit extends Partial<DetailUnit>{
    id: number,
    unitCode?: string,
    pjData: Project,
    rentingPrice: number,
    sellingPrice: number,
    bedroom: string,
    bathroom: number,
    size: number,
    furniture: string,
    feeCoverage: boolean,
    transferringCoverage: boolean,
    managementCoverage: boolean,
    view: string,
    view2: string,
    balcony: string,
    ownerData: BasicContactor,
    imgs?: SwipeBoxImg[],
    r_fee_num: number,
    s_fee_num: number,
}


export interface Unit extends Partial<DetailUnit> {
    id: number,
    unitCode?: string,
    pjData: Project,
    rentingPrice: number;
    block: string,
    height: string,
    sellingPrice: number;
    bedroom: string,
    bathroom: number,
    size: number,
    furniture: string,
    feeCoverage: boolean,
    transferringCoverage: boolean,
    managementCoverage: boolean,
    view: string,
    view2: string,
    balcony: string,
}


export interface unitPrices extends Partial<Unit> {
    rentingPrice: number;
    sellingPrice: number;
}


export interface agentBasicUnit extends Partial<Unit> {
    unitCode: string,
    pjData: Project,
    block?: string,
}

export const getOwnerData =(unitData:DetailUnit , dataName: keyof BasicContactor, defValue: string = '' ) => {
    return unitData?.ownerData[dataName] || defValue;
}

