export enum scrWdtEnum {
    XS = 'XS',
    SM = 'SM',
    MD = 'MD',
    LG = 'LG',
    XL = 'XL',
    XXL = 'XXL',
}

const screenWidth = {
    XS: 256,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1400,
}


export const widthXsmall = () => {
    return window.innerWidth < screenWidth.SM;
};
export const widthXl = () => {
    return window.innerWidth >= screenWidth.XL;
};
export const widthMd = () => {
    return window.innerWidth >= screenWidth.MD;
};
export const widthLg = () => {
    return window.innerWidth >= screenWidth.LG;
};
export const widthSm = () => {
    return window.innerWidth >= screenWidth.SM;
};
export const widthXxl = () => {
    return window.innerWidth >= screenWidth.XXL;
};
export const getWidthName = () => {
    if (widthXxl()) {
        return scrWdtEnum.XXL;
    } else if (widthXl()) {
        return scrWdtEnum.XL;
    } else if (widthLg()) {
        return scrWdtEnum.LG;
    } else if (widthMd()) {
        return scrWdtEnum.MD;
    } else if (widthSm()) {
        return scrWdtEnum.SM;
    } else {
        return scrWdtEnum.XS;
    }
};


export const scrWdtFrom = (wName: scrWdtEnum) => {
    return screenWidth[wName] && (window.innerWidth >= screenWidth[wName]);
};


export const scrWdtTo = (wName: scrWdtEnum) => {
    return screenWidth[wName] && (window.innerWidth <= screenWidth[wName]);
};
