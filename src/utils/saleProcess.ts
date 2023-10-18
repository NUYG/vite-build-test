import type {
    AgentSPSchedule,
    negoOnlyData,
    NegoSnapshot,
    Negotiate,
    NegotiateCategory,
    NegotiateItem, SaleProcessDetail, spAppointmentData,
    spNegoData, SPPrice, spSttData,
} from "@/models/saleProcess";
import {NegotiateCategoryEnum, NegotiateItemEnum, NegotiateSttEnum} from "@/models/saleProcess";
import {unitPrice} from "@/utils/unit";
import {post} from "@/utils/dataQuery";
import {Roles} from "@/utils/constants";
import type {SPDetailUnit} from "@/models/unit";
import {
    clamp,
    dictTranslate,
    floatBugFixed,
    getObjField,
    translate,
    TypeName,
    uncapitalizeFirstLetter
} from "@/utils/utils";
import {HEIGHT, SALE_PROCESS_STATUS, SP_STATUS_AD_RENT, SP_STATUS_AD_SELL} from "@/utils/TransContent";
import {ProgressLevel, SPSttLevel} from "@/utils/spConstants";
import type {FPUser} from "@/models/fpUser";
import {fixDateTime, getFullDateTime} from "@/utils/dateTimeUtils";


const DefRentContractDur: number = 12


export const sugDelNegoItem = (negoItem: NegotiateItem, byAgent: boolean) => {
    updateNegoItem(negoItem, null, byAgent);
}


export const revertDoneNegoItem = (negoItem: NegotiateItem) => {
    const tempVal = negoItem.val;
    negoItem.val = negoItem.oldVal;
    negoItem.oldVal = tempVal;
    negoItem.cusStt = NegotiateSttEnum.APPROVED;
    negoItem.ownStt = NegotiateSttEnum.APPROVED;
}


export const revertDoneSPPrice = (spNegoData: spNegoData) => {
    const tempASF = spNegoData.aSF;
    const tempSSF = spNegoData.sSF;
    const price = spNegoData.price;
    spNegoData.aSF = price.oldASF;
    spNegoData.sSF = price.oldSSF;
    price.oldASF = tempASF;
    price.oldSSF = tempSSF;

    revertDoneNegoItem(price);
}


export const resetSPPrice = (spData: SaleProcessDetail, spNegoData: spNegoData) => {
    snapshotSPPrice(spNegoData);
    let price: SPPrice = spNegoData.price;
    price.val = unitPrice(spData.rent, spData.unitData);
    spNegoData.aSF = 0;
    spNegoData.sSF = 0;
    price.cusStt = NegotiateSttEnum.APPROVED;
    price.ownStt = NegotiateSttEnum.APPROVED;
}


export const descEditableCategory = (category: string) => {
    return [NegotiateCategoryEnum.OTHER.toString(), NegotiateCategoryEnum.FURNITURE].includes(category);
};


export const valueEditableCategory = (category: string) => {
    return ![NegotiateCategoryEnum.OTHER.toString()].includes(category);
};


export const negoCateTranslator: { [key: string]: string } = {
    [NegotiateCategoryEnum.PRICE]: 'Giá',
    [NegotiateCategoryEnum.DEPOSIT]: 'Đặt cọc',
    [NegotiateCategoryEnum.OTHER]: 'Khác',
    [NegotiateCategoryEnum.CONTRACT_DURATION]: 'Thời hạn hợp đồng',
    [NegotiateCategoryEnum.FURNITURE]: 'Nội thất',
    [NegotiateCategoryEnum.FEE]: 'Các loại phí',
    [NegotiateCategoryEnum.MOVE_IN_DAY]: 'Ngày ở',
}


export const negoItemTranslator: { [key: string]: string } = {
    [NegotiateItemEnum.FEE_COVERAGE]: 'Bao thuế phí',
    [NegotiateItemEnum.TRANSFER_COVERAGE]: 'Bao sổ',
    [NegotiateItemEnum.MGMT_COVERAGE]: 'Bao phí quản lý',
    [NegotiateItemEnum.PRICE]: 'Giá',
    [NegotiateItemEnum.DEPOSIT]: 'Đặt cọc',
    [NegotiateItemEnum.CONTRACT_DURATION]: 'Thời hạn hợp đồng',
    [NegotiateItemEnum.MOVE_IN_DAY]: 'Ngày ở',
}


export const negoItemUnit: { [key: string]: string } = {
    [NegotiateItemEnum.PRICE + 'r']: 'Tr/tháng',
    [NegotiateItemEnum.PRICE + 's']: 'Tỷ',
    [NegotiateItemEnum.DEPOSIT]: 'Tr',
    [NegotiateItemEnum.CONTRACT_DURATION]: 'Tháng',
    [NegotiateItemEnum.MOVE_IN_DAY]: '',
}


export const DefNegotiateItem: { [key: string]: NegotiateItem } = {
    [NegotiateItemEnum.MOVE_IN_DAY]: {
        desc: 'Ngày ở: ',
        oldVal: '',
        val: '',
        done: false,
        cusStt: NegotiateSttEnum.PENDING,
        ownStt: NegotiateSttEnum.PENDING,
    },
    [NegotiateItemEnum.MGMT_COVERAGE]: {
        desc: 'Bao phí quản lý: ',
        oldVal: false,
        val: true,
        done: false,
        cusStt: NegotiateSttEnum.PENDING,
        ownStt: NegotiateSttEnum.PENDING,
    },
    [NegotiateItemEnum.FEE_COVERAGE]: {
        desc: 'Bao thuế phí: ',
        oldVal: false,
        val: true,
        done: false,
        cusStt: NegotiateSttEnum.PENDING,
        ownStt: NegotiateSttEnum.PENDING,
    },
    [NegotiateItemEnum.TRANSFER_COVERAGE]: {
        desc: 'Bao sổ: ',
        oldVal: false,
        val: true,
        done: false,
        cusStt: NegotiateSttEnum.PENDING,
        ownStt: NegotiateSttEnum.PENDING,
    },
    [NegotiateItemEnum.DEPOSIT]: {
        desc: 'Đặt cọc: ',
        oldVal: 0,
        val: 0,
        done: false,
        cusStt: NegotiateSttEnum.PENDING,
        ownStt: NegotiateSttEnum.PENDING,
    },
    [NegotiateItemEnum.CONTRACT_DURATION]: {
        desc: 'Hạn hợp đồng: ',
        oldVal: 12,
        val: 12,
        done: false,
        cusStt: NegotiateSttEnum.PENDING,
        ownStt: NegotiateSttEnum.PENDING,
    },
    'other': {
        desc: '',
        oldVal: '',
        val: '',
        done: false,
        cusStt: NegotiateSttEnum.PENDING,
        ownStt: NegotiateSttEnum.PENDING,
    },
    'furniture': {
        desc: '',
        oldVal: 1,
        val: 1,
        done: false,
        cusStt: NegotiateSttEnum.PENDING,
        ownStt: NegotiateSttEnum.PENDING,
    },
}


export const DefNegotiateItemType: { [key: string]: string } = {
    [NegotiateItemEnum.MOVE_IN_DAY]: TypeName.DATE,
    [NegotiateItemEnum.MGMT_COVERAGE]: TypeName.BOOLEAN,
    [NegotiateItemEnum.FEE_COVERAGE]: TypeName.BOOLEAN,
    [NegotiateItemEnum.TRANSFER_COVERAGE]: TypeName.BOOLEAN,
    [NegotiateItemEnum.DEPOSIT]: TypeName.NUMBER,
    [NegotiateItemEnum.CONTRACT_DURATION]: TypeName.NUMBER,
    'other': TypeName.STRING,
    'furniture': TypeName.NUMBER,
}


export const itemUnit = (itemData: NegotiateItem, itemName: string, rent: boolean) => {
    let unit = itemData.unit;
    if (unit) {
        return unit;
    }

    try {
        let name: string = itemName;
        if (name == NegotiateItemEnum.PRICE) {
            name = name + (rent ? 'r' : 's');
        }
        return negoItemUnit[name];
    } catch (err) {
        return '';
    }
}


export const spNegoItemVal = (
    nego: Negotiate, cateName: string, itemName: string, defVal: any) => {
    let item: NegotiateItem = getObjField(getObjField(nego, cateName, {}), itemName, {});
    if (!Object.keys(item).length) {
        return defVal;
    }

    return getSPVerifiedNegoItem(item, defVal)
}


export const negoCateTrans = (name: string) => {
    return dictTranslate(negoCateTranslator, name);
}


export const negoItemTrans = (name: string) => {
    return dictTranslate(negoItemTranslator, name);
}


const snapshotNegoItem = (item: NegotiateItem) => {
    item.oldVal = item.val;
    item.ownStt = NegotiateSttEnum.PENDING;
    item.cusStt = NegotiateSttEnum.PENDING;
}


const snapshotSPPrice = (spData: spNegoData) => {
    spData.price.oldVal = spData.price.val;
    spData.price.oldSSF = spData.sSF;
    spData.price.oldASF = spData.aSF;
    spData.price.ownStt = NegotiateSttEnum.PENDING;
    spData.price.cusStt = NegotiateSttEnum.PENDING;
}


export const justApproveNegoItem = (item: NegotiateItem, byAgent: boolean, create: boolean = false) => {
    if (byAgent) {
        item.ownStt = NegotiateSttEnum.APPROVED;
    } else {
        item.cusStt = NegotiateSttEnum.APPROVED;
    }
    item.done = !create;
}


export const approveNegoItem = (
    spData: spNegoData, item: NegotiateItem, byAgent: boolean, autoUpdate: boolean = false) => {

    justApproveNegoItem(item, byAgent);
    if (negotiateDone(spData) && autoUpdate) {
        takeSPSnapshot(spData, byAgent).then();
    }
}


export const denyNegoItem = (item: NegotiateItem, byAgent: boolean) => {
    if (byAgent) {
        item.ownStt = NegotiateSttEnum.DENIED;
    } else {
        item.cusStt = NegotiateSttEnum.DENIED;
    }
}


export const updateNegoItem = (item: NegotiateItem, newVal: (number | string | Date | null), byAgent: boolean) => {
    if (shouldSnapshotNegoItem(byAgent, item)) {
        snapshotNegoItem(item);
    }
    item.val = newVal;
    if (byAgent) {
        item.ownStt = NegotiateSttEnum.APPROVED;
        item.cusStt = NegotiateSttEnum.PENDING;
    } else {
        item.cusStt = NegotiateSttEnum.APPROVED;
        item.ownStt = NegotiateSttEnum.PENDING;
    }
}


export const canDelNegoItem = (item: NegotiateItem) => {
    return item.val == null && item.cusStt === NegotiateSttEnum.APPROVED && item.ownStt === NegotiateSttEnum.APPROVED;
}


export const shouldSnapshotNegoItem = (byAgent: boolean, item: NegotiateItem) => {
    return byAgent ? (item.cusStt != NegotiateSttEnum.PENDING) : (item.ownStt != NegotiateSttEnum.PENDING);
}


export const negoItemApproved = (item: NegotiateItem) => {
    return item.val != null && item.cusStt === NegotiateSttEnum.APPROVED && item.ownStt === NegotiateSttEnum.APPROVED;
}


export const negoItemDenied = (item: NegotiateItem) => {
    return item.cusStt === NegotiateSttEnum.DENIED || item.ownStt === NegotiateSttEnum.DENIED;
}


export const ownDeniedNegoItem = (item: NegotiateItem, byAgent: boolean) => {
    return negoItemDenied(item) && (byAgent ? (item.ownStt == NegotiateSttEnum.APPROVED) : (item.cusStt == NegotiateSttEnum.APPROVED));
}


export const negoItemPending = (item: NegotiateItem) => {
    return !negoItemApproved(item) && !negoItemDenied(item);
}


export const ownNegoItemPending = (item: NegotiateItem, isAgent: boolean) => {
    return negoItemPending(item) && ((isAgent ?
        item.ownStt : item.cusStt) == NegotiateSttEnum.APPROVED)
}


export const otherNegoItemPending = (item: NegotiateItem, isAgent: boolean) => {
    return negoItemPending(item) && ((!isAgent ?
        item.ownStt : item.cusStt) == NegotiateSttEnum.APPROVED)
}


export const negotiateDone = (negoData: negoOnlyData) => {
    return (!negoData.price || negoItemApproved(negoData.price)) && negotiateApproved(negoData.negotiate);
}


export const negoSnapshotData: (negoData: spNegoData) => Negotiate = (negoData: spNegoData) => {
    return {
        [NegotiateCategoryEnum.PRICE]: {
            [NegotiateCategoryEnum.PRICE]: {
                ...negoData.price,
                aSF: negoData.aSF,
                sSF: negoData.sSF,
            }
        },
        ...negoData.negotiate,
    }
}


const createNegoSnapshot: (negoData: spNegoData) => NegoSnapshot = (negoData: spNegoData) => {
    return {
        snapshot: negoSnapshotData(negoData),
        time: new Date(),
    }
}


export const negotiateApproved = (negotiateData: Negotiate) => {
    let approved: boolean = true;
    for (let negoCategory in negotiateData) {
        const categoryData: NegotiateCategory = negotiateData[negoCategory];
        for (let negoItemName in categoryData) {
            const itemData: NegotiateItem = categoryData[negoItemName];
            approved = approved && !negoItemPending(itemData);
        }
    }

    return approved;
}


export const checkAndDelNegoItem = (negoData: Negotiate, cateName: string, itemName: string) => {
    try {
        let category: NegotiateCategory = negoData[cateName];
        let item: NegotiateItem = category[itemName];
        if (canDelNegoItem(item)) {
            deleteNegoItem(negoData, cateName, itemName);
        }
    } catch (err) {
        console.log(err);
    }
}


export const deleteNegoItem = (negoData: Negotiate, cateName: string, itemName: string) => {
    delete negoData[cateName][itemName];
    if (Object.keys(negoData[cateName]).length <= 0) {
        delete negoData[cateName];
    }
}


export const getSPPriceVal = (spData: SaleProcessDetail) => {
    return getSPPriceVal2(spData.price, spData.rent, spData.unitData);
}


export const getSPPriceVal2 = (priceData: SPPrice, rent: boolean, unitData: SPDetailUnit) => {
    if (priceData.val == null || priceData.val <= 0) {
        return unitPrice(rent, unitData);
    }
    return priceData.val;
}


export const getSPPriceOldVal = (spData: SaleProcessDetail) => {
    return getSPPriceOldVal2(spData.price, spData.rent, spData.unitData);
}


export const getSPPriceOldVal2 = (priceData: SPPrice, rent: boolean, unitData: SPDetailUnit) => {
    if (priceData.oldVal == null || priceData.oldVal <= 0) {
        return unitPrice(rent, unitData);
    }
    return priceData.oldVal;
}


export const getCusFinalPrice2 = (negoData: spNegoData, rent: boolean, unitData: SPDetailUnit) => {
    const price: number = getSPPriceVal2(negoData.price, rent, unitData);
    return cusFinalPriceCalculate(negoData.aSF, rent, negoData.sSF, price);
}


export const getCusFinalPrice = (spData: SaleProcessDetail) => {
    const price: number = getSPPriceVal(spData);
    return floatBugFixed(price - spData.aSF - spData.sSF);
}


export const getSPFinalPrice = (negoData: spNegoData, rent: boolean, unitData: SPDetailUnit, isAgent: boolean) => {
    return isAgent ? getSPPriceVal2(negoData.price, rent, unitData) : getCusFinalPrice2(negoData, rent, unitData);
}


export const getCusOldPrice2 = (priceData: SPPrice, rent: boolean, unitData: SPDetailUnit) => {
    const oldPrice: number = getSPPriceOldVal2(priceData, rent, unitData);
    return floatBugFixed(oldPrice - priceData.oldASF / (rent ? 1 : 1000) - priceData.oldSSF / (rent ? 1 : 1000));
}


export const getCusOldPrice = (spData: SaleProcessDetail) => {
    const oldPrice: number = getSPPriceOldVal(spData);
    return floatBugFixed(oldPrice - spData.price.oldASF - spData.price.oldSSF);
}


export const getSPOldFinalPrice = (priceData: SPPrice, rent: boolean, unitData: SPDetailUnit, isAgent: boolean) => {
    return isAgent ? getSPPriceOldVal2(priceData, rent, unitData) : getCusOldPrice2(priceData, rent, unitData);
}


export const getSPVerifiedNegoItem = (negoItem: NegotiateItem, defVal: any) => {
    return (
        negoItemApproved(negoItem) ? getObjField(negoItem, 'val', defVal)
            : getObjField(negoItem, 'oldVal', defVal)
    )
}


export const getSPVerifiedFinalPrice = (negoData: spNegoData, rent: boolean, unitData: SPDetailUnit, isAgent: boolean) => {
    if (negoItemApproved(negoData.price)) {
        return getSPFinalPrice(negoData, rent, unitData, isAgent);
    } else {
        return getSPOldFinalPrice(negoData.price, rent, unitData, isAgent);
    }
}


export const setSPPriceAgent = (
    spData: spNegoData, price: number, aSF: number, sSF: number, rent: boolean, byAgent: boolean) => {

    if (shouldSnapshotNegoItem(byAgent, spData.price)) {
        snapshotSPPrice(spData);
    }
    spData.aSF = aSF;
    spData.sSF = sSF;
    spData.price.val = price;
    if (byAgent) {
        spData.price.ownStt = NegotiateSttEnum.APPROVED;
    } else {
        spData.price.cusStt = NegotiateSttEnum.APPROVED;
    }
}


export const takeSPSnapshot = async (spData: spNegoData, byAgent: boolean) => {
    const role: string = byAgent ? Roles.Agent : Roles.Sales;
    const res = await post("/sale_process/sp_take_snapshot_api", {
        role,
        id: spData.id,
        validate: {},
        negoSnapshot: createNegoSnapshot(spData),
    })
    if (!res) {
        console.log('Err during save snapshot');
    }
};


export const verifiedUnitFee = (negoData: spNegoData, rent: boolean, unitData: SPDetailUnit) => {
    return negoData.totalFee ? negoData.totalFee : (getSPVerifiedFinalPrice(negoData, rent, unitData, true) * (
        rent ? (verifiedContractDuration(negoData.negotiate) / DefRentContractDur) : 10));
}


export const verifiedSarcrifiedFee = (negoData: spNegoData, rent: boolean, isAgent: boolean) => {
    let sF: number;
    if (negoItemApproved(negoData.price)) {
        sF = isAgent ? negoData.aSF : negoData.sSF;
    } else {
        sF = isAgent ? negoData.price.oldASF : negoData.price.oldSSF;
    }

    return sF * (rent ? verifiedContractDuration(negoData.negotiate) : 1);
}


export const getFinalSalesFee = (negoData: spNegoData, rent: boolean, unitData: SPDetailUnit) => {
    return floatBugFixed(verifiedUnitFee(negoData, rent, unitData) * clamp(negoData.sFeePercent, 0, 100) / 100 - verifiedSarcrifiedFee(negoData, rent, false));
}


export const getFinalAgentFee = (negoData: spNegoData, rent: boolean, unitData: SPDetailUnit) => {
    return floatBugFixed(verifiedUnitFee(negoData, rent, unitData) * clamp(100 - negoData.sFeePercent, 0, 100) / 100 - verifiedSarcrifiedFee(negoData, rent, true));
}


export const FinalFeeCalculate = (negoData: spNegoData, rent: boolean, unitData: SPDetailUnit, isAgent: boolean, fee: number, price: number) => {
    const contractDuration: number = verifiedContractDuration(negoData.negotiate);
    return floatBugFixed(price * (rent ? (contractDuration / DefRentContractDur) : 10) * clamp((isAgent ? 100 : 0) + (isAgent ? -1 : 1) * negoData.sFeePercent, 0, 100) / 100 - fee * (rent ? contractDuration : 1));
}

export const cusFinalPriceCalculate = (aSF: number, rent: boolean, fee: number, price: number) => {
    return floatBugFixed(price - aSF / (rent ? 1 : 1000) - fee / (rent ? 1 : 1000));
}


export const verifiedContractDuration = (negoData: Negotiate) => {
    return spNegoItemVal(negoData, NegotiateCategoryEnum.CONTRACT_DURATION,
        NegotiateItemEnum.CONTRACT_DURATION, DefRentContractDur);
}


export const verifiedMgmtCov = (negoData: Negotiate, unitData: SPDetailUnit) => {
    return spNegoItemVal(negoData, NegotiateCategoryEnum.FEE,
        NegotiateItemEnum.MGMT_COVERAGE, unitData.managementCoverage);
}


export const verifiedFeeCov = (negoData: Negotiate, unitData: SPDetailUnit) => {
    return spNegoItemVal(negoData, NegotiateCategoryEnum.FEE,
        NegotiateItemEnum.FEE_COVERAGE, unitData.feeCoverage);
}


export const verifiedTransCov = (negoData: Negotiate, unitData: SPDetailUnit) => {
    return spNegoItemVal(negoData, NegotiateCategoryEnum.FEE,
        NegotiateItemEnum.TRANSFER_COVERAGE, unitData.transferringCoverage);
}

export const unitFeeText = (negoData: Negotiate, unitData: SPDetailUnit, rent: boolean) => {
    if (rent) {
        return verifiedMgmtCov(negoData, unitData) ? 'Bao phí quản lý' : '';
    } else {
        if (verifiedTransCov(negoData, unitData) && verifiedFeeCov(negoData, unitData)) {
            return 'Bao sổ, Bao thuế phí';
        } else if (verifiedTransCov(negoData, unitData)) {
            return 'Bao sổ';
        } else if (verifiedFeeCov(negoData, unitData)) {
            return 'Bao thuế phí';
        }
    }
    return '';
}


export const allFreeTimeEmpty = (spData: spSttData) => {
    return allFreeTimeEmpty2(spData.aFreeTime, spData.sFreeTime);
}


export const allFreeTimeEmpty2 = (aFreeTime: string[][] | Date[][], sFreeTime: string[][] | Date[][]) => {
    return aFreeTime.length == 0 && sFreeTime.length == 0;
}


export const transSPDetailStt2 = (status: string, agentData: FPUser, aFreeTime: string[][] | Date[][], sFreeTime: string[][] | Date[][], nextMeetingDate: Date | string | null, rent: boolean) => {
    if (!agentData) {
        return 'Chờ xác nhận';
    }
    if (appointing2(aFreeTime, sFreeTime, nextMeetingDate)) {
        return translate(SALE_PROCESS_STATUS, status);
    }
    const dict = rent ? SP_STATUS_AD_RENT : SP_STATUS_AD_SELL;
    return dictTranslate(dict, status);
}


export const transSPDetailStt = (spData: spSttData, status: string) => {
    if (!spData.agentData) {
        return 'Chờ xác nhận';
    }
    if (appointing(spData)) {
        return translate(SALE_PROCESS_STATUS, status);
    }
    const dict = spData.rent ? SP_STATUS_AD_RENT : SP_STATUS_AD_SELL;
    return dictTranslate(dict, status);
}


export const currentSPDetailStt = (spData: spSttData) => {
    return transSPDetailStt(spData, spData.status);
}


export const currentSPDetailPeakStt = (spData: spSttData) => {
    return transSPDetailStt(spData, spData.peakStatus);
}


export const currentSttLvl = (spData: spAppointmentData) => {
    return SPSttLevel[spData.status];
}


export const currentPeakSttLvl = (spData: spAppointmentData) => {
    return SPSttLevel[spData.peakStatus];
}


export const currentSugSttLvl = (spData: spAppointmentData) => {
    return SPSttLevel[spData.sugStatus];
}


export const SPSttLvl = (stt: string) => {
    return SPSttLevel[stt];
}


export const nextSttLvl = (stt: string) => {
    return SPSttLvl(stt) + 2;
}


export const setSugData = (spData: spAppointmentData, lvl: number) => {
    if (spData.rent && lvl === 4) {
        lvl = 6;
    }

    spData.sugStatus = ProgressLevel[Math.max(0, lvl - 1)];
    const ddate = spData.nextMeetingDate;
    let sugLvl = SPSttLvl(spData.sugStatus);
    let sugData = {
        scoutingDate: (sugLvl > 2 ? spData.scoutingDate : ddate),
        depositDate: (spData.depositDate ? spData.depositDate : ddate),
        notarizeDate: (spData.notarizeDate ? spData.notarizeDate : ddate),
        signingDate: (spData.signingDate ? spData.signingDate : ddate),
    }
    spData.scoutingDate =
        sugLvl >= 2 ? sugData.scoutingDate : spData.scoutingDate;
    spData.sugDepDate =
        sugLvl >= 4 ? sugData.depositDate : spData.sugDepDate;
    spData.sugNotDate =
        sugLvl >= 6 ? sugData.notarizeDate : spData.sugNotDate;
    spData.sugSigDate =
        sugLvl >= 8 ? sugData.signingDate : spData.sugSigDate;
}


export const resetSFreeTime = (spData: spAppointmentData) => {
    spData.sFreeTime = [];
}


export const resetAFreeTime = (spData: spAppointmentData) => {
    spData.aFreeTime = [];
}


export const resetAppointment = (spData: spAppointmentData) => {
    spData.nextMeetingDate = null;
    resetAFreeTime(spData);
    resetSFreeTime(spData);
}


export const appointing2 = (aFreeTime: string[][] | Date[][], sFreeTime: string[][] | Date[][], nextMeetingDate: Date | string | null) => {
    return !allFreeTimeEmpty2(aFreeTime, sFreeTime) || (nextMeetingDate != null)
}


export const appointing = (spData: spSttData) => {
    return !allFreeTimeEmpty(spData) || (spData.nextMeetingDate != null);
}


export const notHasReceipt = (spData: SaleProcessDetail) => {
    return !spData.receiptData;
}


export const receiptSalesVerified = (spData: SaleProcessDetail) => {
    return !notHasReceipt(spData) && !!spData.receiptData?.salesVerified;
}


export const shareAgentSPSchedule = (spData: AgentSPSchedule) => {
    return (
        `Dự án ${spData.unitData.pjData.name} - ${
            spData.unitData.unitCode}.` +
        `${"\nThời gian hẹn: " + (fixDateTime(spData?.nextMeetingDate || ''))}` +
        `\nSales: ${spData.salesData?.first_name}${spData.salesData.extData?.length ? (' - ' + spData.salesData.extData[0].phone) : ''}`
        +
        `\n${translate(SALE_PROCESS_STATUS, spData.status)}`
    );
};
