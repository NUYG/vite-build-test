import type {BasicContactor, BasicFPUser, FPUser} from "@/models/fpUser";
import type {agentBasicUnit, SPDetailUnit} from "@/models/unit";
import {date} from "yup";


export interface NegoSnapshot {
    snapshot: Negotiate,
    time: string | Date,
}


export interface SPHistory {
    id: number,
    lastStatus: string,
    lastANote?: string,
    lastAFreeTime?: Date[][] | string[][],
    lastSNote?: string,
    lastSFreeTime?: Date[][] | string[][],
}


export interface SPReceipt {
    id: number,
    ownerData: BasicContactor,
    ownerName: string,
    cusData: BasicContactor,
    cusName: string,
    agentData: FPUser,
    salesData: FPUser,
    unitData?: SPDetailUnit,
    unitCode?: string,
    bedroom: string,
    rent: boolean,
    price: number,
    sSF: number,
    aSF: number,
    fee: number,
    feeSales: number,
    feeAgent: number,
    otherFee: number,
    salesVerified: boolean,
    mgmtCov: boolean,
    transCov: boolean,
    feeCov: boolean,
    scoutingDate: Date | string | null,
    depositDate: Date | string | null,
    notarizeDate: Date | string | null,
    signingDate: Date | string | null,
    contractDuration: number,
    negotiate: Negotiate,
}


export interface SPTemplate {
    name?: string,
    id: number,
    rent: boolean,
    status: string,
    salesNote?: string,
    scoutingDate: Date | string | null,
    depositDate: Date | string | null,
    notarizeDate: Date | string | null,
    signingDate: Date | string | null,
    peakStatus: string,
    moveDay?: Date | string | null,
    sales_can_restore?: boolean,
    nextMeetingDate: Date | string | null,
    customerData?: BasicContactor,
    fav: boolean,
    negotiate: Negotiate,
}


export interface SaleProcessDetail extends SPTemplate{
    agentNote?: string,
    aFreeTime: string[][] | Date[][],
    sFreeTime: string[][] | Date[][],
    sugStatus: string,
    sugDepDate: Date | string | null,
    sugNotDate: Date | string | null,
    sugSigDate: Date | string | null,
    sugByAgent: boolean,
    aLastUpdate: Date | string,
    sLastUpdate: Date | string,
    agent_can_restore?: boolean,
    totalFee?: number,
    salesData?: FPUser,
    unitData: SPDetailUnit,
    agentData?: FPUser,
    partnerUpdate: SPHistory,
    receiptData: null | SPReceipt,
    one_man: boolean,
    sSF: number,
    aSF: number,
    price: SPPrice,
    sFeePercent: number,
}


export interface spSttData extends Partial<SaleProcessDetail>{
    aFreeTime: string[][] | Date[][],
    sFreeTime: string[][] | Date[][],
    sugStatus: string,
    agentData?: FPUser,
    id: number,
    rent: boolean,
    status: string,
    peakStatus: string,
    nextMeetingDate: Date | string | null,
}


export interface spAppointmentData extends Partial<SaleProcessDetail>{
    aFreeTime: string[][] | Date[][],
    sFreeTime: string[][] | Date[][],
    sugStatus: string,
    scoutingDate: Date | string | null,
    sugDepDate: Date | string | null,
    sugNotDate: Date | string | null,
    sugSigDate: Date | string | null,
    sugByAgent: boolean,
    id: number,
    rent: boolean,
    status: string,
    peakStatus: string,
    nextMeetingDate: Date | string | null,
}


export interface negoOnlyData extends Partial<spNegoData>{
    negotiate: Negotiate,
}


export interface spNegoData extends Partial<SaleProcessDetail>{
    id: number,
    sSF: number,
    aSF: number,
    price: SPPrice,
    negotiate: Negotiate,
    sFeePercent: number,
    totalFee?: number,
}


export enum NegotiateSttEnum {
    PENDING = 'pending',
    DENIED = 'denied',
    APPROVED = 'approved',
}

export enum NegotiateCategoryEnum {
    PRICE = 'price',
    FURNITURE = 'furniture',
    MOVE_IN_DAY = 'moveInDay',
    DEPOSIT = 'deposit',
    CONTRACT_DURATION = 'contractDur',
    OTHER = 'other',
    FEE = 'fee'
}


export enum NegotiateItemEnum {
    PRICE = 'price',
    MOVE_IN_DAY = 'moveInDay',
    DEPOSIT = 'deposit',
    CONTRACT_DURATION = 'contractDur',
    MGMT_COVERAGE = 'mgmtCoverage',
    FEE_COVERAGE = 'feeCoverage',
    TRANSFER_COVERAGE = 'transferCoverage',
}


export interface NegotiateCategory {
    [index: string]: NegotiateItem
}


export interface Negotiate {
    [index: string]: NegotiateCategory
}


export interface FullNegotiateItem {
    desc: string,
    oldVal: string | number | Date | boolean | null,
    val: string | number | Date | boolean | null,
    unit: string,
    done: boolean,
    cusStt: string,
    ownStt: string,
}


export interface NegotiateItem extends Partial<FullNegotiateItem> {
    desc: string,
    oldVal: string | number | Date | boolean | null,
    val: string | number | Date | boolean | null,
    done: boolean,
    cusStt: string,
    ownStt: string,
}


export interface SPPrice extends NegotiateItem {
    oldVal: number | null,
    val: number | null,
    oldSSF: number,
    oldASF: number,
}


export interface AgentSPSchedule extends Partial<SPTemplate>{
    salesData: BasicFPUser,
    unitData: agentBasicUnit,
    agentData?: BasicFPUser,
    nextMeetingDate: Date | string | null,
    status: string,
    rent: boolean,
}
