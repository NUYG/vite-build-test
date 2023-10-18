import {floatFixed, getObjField, translate} from "@/utils/utils";
import type {DetailUnit, Unit, unitPrices} from "@/models/unit";
import {IMG_URL} from "@/utils/constants";
import {post} from "@/utils/dataQuery";
import {HEIGHT} from "@/utils/TransContent";
import type {ExtData, SalesData} from "@/types/interface";
import moment from "moment";
import {getDdMm} from "@/utils/dateTimeUtils";


const unitPrice = (rent: boolean, unit: unitPrices) => {
    return rent ? unit.rentingPrice : unit.sellingPrice;
}


const unitPriceStr = (rent: boolean, unit: unitPrices) => {
    return floatFixed(unitPrice(rent, unit));
};

const uPricePfx = (rent: boolean) => {
    return rent ? "Tr" : " Tỷ";
};

const uPriceFullPfx = (rent: boolean) => {
    return rent ? " Triệu" : " Tỷ";
};

const uPricePfxExt = (rent: boolean) => {
    return rent ? " Triệu / Tháng" : " Tỷ";
};

const uPricePfxHalfExt = (rent: boolean) => {
    return rent ? " Tr/ Tháng" : " Tỷ";
}

const unitPriceText = (rent: boolean, unit: unitPrices) => {
    return unitPriceStr(rent, unit) + uPricePfx(rent);
};

const unitFullPriceText = (rent: boolean, unit: unitPrices) => {
    return unitPriceStr(rent, unit) + uPriceFullPfx(rent);
};

const unitPriceTextExt = (rent: boolean, unit: unitPrices,millionCheck:boolean=true) => {
    if(millionCheck)
    {
        return  parseInt(unitPriceStr(rent, unit)) > 0 ? unitPriceStr(rent, unit) + uPricePfxExt(rent) : ''
    }
    else {
        return unitPriceStr(rent, unit) + uPricePfxExt(rent)
    }
};


const shareSellContent = (unit: Unit, fur_dict: string[][], view_dict: string[][], dir_dict: string[][]) => {
    return (
        `Căn hộ ${unit.pjData.name}${
            unit.bedroom
                ? " " +
                unit.bedroom +
                "PN" +
                " - " +
                (unit.bathroom ? unit.bathroom + "WC" : "")
                : ""
        }.` +
        `${"\n" + (unit.block ? ("Block " + unit.block + " - ") : "")}` +
        `${(unit.height ? ("Tầng " + translate(HEIGHT, unit.height)) : "")}`
        +
        `${unit.size ? "\nDiện tích: " + unit.size + "m2." : ""}
Giá bán: ` +
        `${unitFullPriceText(false, unit)}, ${
            unit.feeCoverage ? "Có" : "Không"
        } bao thuế phí,` +
        ` ${unit.transferringCoverage ? "có" : "không"} bao sổ.
${unit.furniture === "fully" ? "Full nội thất" : "Nội thất cơ bản"}.` +
        `${unit.view || unit.view2 ? "\nView " : ""}${translate(
            view_dict,
            unit.view
        )?.toLowerCase()}${
            unit.view2 ? (", " + translate(view_dict, unit.view2)).toLowerCase() : ""
        }${unit.view || unit.view2 ? "." : ""}
${
            unit.balcony
                ? "Hướng " + translate(dir_dict, unit.balcony).toLowerCase() + "."
                : ""
        }`
    );
};

const shareRentContent = (unit: Unit, fur_dict: string[][], view_dict: string[][], dir_dict: string[][]) => {
    return (
        `Căn hộ ${unit.pjData.name}${
            unit.bedroom
                ? " " +
                unit.bedroom +
                "PN" +
                " - " +
                (unit.bathroom ? unit.bathroom + "WC" : "")
                : ""
        }.` +
        `${"\n" + (unit.block ? ("Block " + unit.block + " - ") : "")}` +
        `${(unit.height ? ("Tầng " + translate(HEIGHT, unit.height)) : "")}`
        +
        `${unit.size ? "\nDiện tích: " + unit.size + "m2." : ""}
Giá thuê: ${unitFullPriceText(true, unit)},` +
        ` ${unit.managementCoverage ? "có" : "không"} bao phí quản lý.
${unit.furniture === "fully" ? "Full nội thất" : "Nội thất cơ bản"}.` +
        `${unit.view || unit.view2 ? "\nView " : ""}${translate(
            view_dict,
            unit.view
        )?.toLowerCase()}${
            unit.view2 ? (", " + translate(view_dict, unit.view2)).toLowerCase() : ""
        }${unit.view || unit.view2 ? "." : ""}
${
            unit.balcony
                ? "Hướng " + translate(dir_dict, unit.balcony).toLowerCase() + "."
                : ""
        }`
    );
};

const shareContent = (rent: boolean, unit: Unit, fur_dict: string[][], view_dict: string[][], dir_dict: string[][]) => {
    return (rent ? shareRentContent(unit, fur_dict, view_dict, dir_dict) : shareSellContent(unit, fur_dict, view_dict, dir_dict));
};


const transFurniture = (fur: string) => {
    return fur === 'fully' ? 'Full nội thất ' : 'Nội thất cơ bản'
}
const getFurIcon = (fur: string) => {
    return fur === 'fully' ? 'FNT.svg' : 'NTCB.svg'
}
const getStatusTextByRent = (rent: boolean) => {
    return rent ? 'Thuê' : 'Mua'
}

interface ViewlibIcon {
    [key: string]: string;
}

const viewlibIcon: ViewlibIcon = {
    pool: "pool.svg",
    river: "river.svg",
    city: "city.svg",
    road: "road.svg",
    park: "park.svg",
    inner: "inner.svg",
    landmark: "landmark.svg",
}
const getViewIcon = (view: string, solid: boolean): string | undefined => {
    if (view) {
        const icon = viewlibIcon[view];
        if (icon) {
            if (solid) {
                const filename = icon.split('.');
                return `${filename[0]}-solid.${filename[1]}`;
            } else {
                return icon;
            }
        }
    }
    return undefined;
};

const unitInformationIcon = {
    bedroom: 'bed.svg',
    bathroom: 'Shower.svg',
    size: 'Squaremetre.svg',
    block: 'Building_Level.svg',
    balcony: 'Compass.svg',
    managementCoverage: 'Checks-solid.svg',
}


const checkUnitFresh = (lastRefresh: string, renting: boolean, lcr: string) => {
    const today = new Date();
    const freshDate = new Date(lastRefresh);
    const countDate = Math.round((today.getTime() - freshDate.getTime()) / 86400000);
    const fresh = (renting && countDate < 5) || (!renting && countDate < 21)
    if ((lcr === "Agent") && fresh) {
        return 4;
    } else if ((lcr === "A.Assistant") && fresh) {
        return 3;
    } else if (!fresh && (lcr === "A.Assistant" || lcr === "Agent")) {
        return 2;
    }
    return 1
};

const freshUnitContent = {
    4: 'Căn hộ đã được xác minh 2 lớp',
    3: 'Căn hộ đã được xác minh 1 lớp',
    2: 'Căn hộ đã được xác minh',
    1: 'Căn hộ chưa được xác minh'
}
const getUnitFreshIcon = (freshLv: number): string => {
    if ((freshLv === 4) || (freshLv === 3)) {
        return `fresh-lv-3.svg`
    } else if (freshLv === 2) {
        return `fresh-lv-2.svg`
    } else if (freshLv === 1) {
        return `fresh-lv-1.svg`
    }
    return ''

};

const pjInformationBotUnitImg = (pjInformation: any, blockField: keyof typeof pjInformation): string => {
    const block = pjInformation[blockField] ? ` [${pjInformation[blockField]}]` : '';
    if (pjInformation && pjInformation[blockField]) {
        return `${pjInformation.pjData?.name}${block}, ${pjInformation.pjData?.district}`;
    } else if (pjInformation && pjInformation.pjData) {
        return `${pjInformation.pjData?.name}, ${pjInformation.pjData?.district}`;
    }
    return '';
};


const downloadImg = (imageUrls: string[]): void => {
    if (imageUrls.length) {
        imageUrls.forEach((url: string) => {
            const link: HTMLAnchorElement = document.createElement("a");
            link.href = IMG_URL + url;
            link.download = url;
            link.click();
        })
    }
}
const getPjDistrict = (pjData: any) => {
    if (pjData) {
        return `${getObjField(pjData, 'name')},${getObjField(pjData, 'district')}`
    }
}

export const getPjNameInPjData = (pjData: any) => {
    let code = ''
    if (pjData.length > 0) {
        pjData.map((pj: any) => {
            code = code + pj.name + ' '
        })
    }
    return code
}


const tagContent = {
    furniture: {content: 'Full nội thất', icon: 'FNT.svg'},
    sh: {content: 'Shophouse'},
    off: {content: 'Officetel'},
    pen: {content: 'Penthouse'},
    dup: {content: 'Duplex'},
    sky: {content: 'Sky'},
    stu: {content: 'stu'},

};

const getImgUnitTag = (unit: {
    unit_type?: keyof typeof tagContent;
    furniture?: boolean;
    renting: boolean
}) => {
    const unitTag: any[] = [];
    Object.keys(tagContent).forEach((tag) => {
        if (unit) {
            if (
                (tag === 'furniture' && unit.furniture === true) ||
                (tag === unit.unit_type)
            ) {
                unitTag.push(tagContent[tag as keyof typeof tagContent]);
            }
        }
    });
    return unitTag;
};
const salesCreateSp = async (inqID: number, unitID: number, extData: object = {} , createByAgent: boolean = false) => {
    return await post("/sale_process/create_sale_process", {
        inquiryId: inqID,
        unitId: unitID,
        createByAgent: createByAgent,
        ...extData
    })
}
export const getUserExtData = <K extends keyof ExtData>(data: SalesData, dataName: K, defValue: string = ''): string => {
    return data.extData && data.extData.length > 0
        ? data.extData[0][dataName]
        : defValue;
}

export const checkFreeUnit = (unit:DetailUnit) => {
    return unit.renting && (!unit?.contractExpiry || (moment(unit?.contractExpiry)).isBefore(moment()))
}

// inqStatus is user filter renting or selling in cart
export const checkNewUnit = (unit:DetailUnit,inqStatus:boolean) => {
    return inqStatus ? unit.new_renting : unit.new_selling
}


export const checkContractExpiryWithinDays = (unit: DetailUnit, daysAhead: number) => {
    if (daysAhead <= 0) {
        throw new Error('daysAhead phải là một số nguyên dương.');
    }
    const now = moment();
    const contractExpiryDate = unit.contractExpiry ? moment(unit.contractExpiry) : null;
    return contractExpiryDate && contractExpiryDate.isAfter(now) && contractExpiryDate.isBefore(now.clone().add(daysAhead, 'days'));
}

export const getStatusOfUnit = (unit:DetailUnit,inqStatus:boolean) => {
    const result=[]
    if(checkNewUnit(unit,inqStatus))
    {
        result.push({content:'Căn mới',color:'blue'})
    }
    if(checkFreeUnit(unit))
    {
        result.push({content:'Nhà trống',color:'green'})
    }
     else if(moment().isBefore(moment(unit.contractExpiry)))
    {
        result.push({content:`Nhà trống ${getDdMm(unit.contractExpiry)}`,color:'purple'})
    }
    return result
}



export {
    unitPrice,
    unitPriceStr,
    uPricePfx,
    shareContent,
    unitPriceText,
    unitFullPriceText,
    uPriceFullPfx,
    transFurniture,
    getFurIcon,
    getStatusTextByRent,
    viewlibIcon,
    tagContent,
    checkUnitFresh,
    unitPriceTextExt,
    pjInformationBotUnitImg,
    getUnitFreshIcon,
    unitInformationIcon,
    getViewIcon,
    downloadImg,
    uPricePfxExt,
    getPjDistrict,
    getImgUnitTag,
    uPricePfxHalfExt,
    salesCreateSp,
    freshUnitContent
};
