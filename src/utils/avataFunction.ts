import {IMG_URL} from "@/utils/constants";
import {getIconUrl} from "@/utils/utils";
import {post} from "@/utils/dataQuery";

export const getImgUrlFromExtData = (extData: {
    avtData?: { imgUrl: string };
    gender?: string;
    preset_avt: string
}): string => {
    if (extData && extData.avtData && Object.keys(extData.avtData).length > 0) {
        return IMG_URL + extData.avtData.imgUrl;
    } else if (extData && extData.preset_avt) {
        return getIconUrl(extData.preset_avt)
    } else if (extData?.gender === "male") {
        return getIconUrl('maleAvatar.png');
    } else if (extData?.gender === "female") {
        return getIconUrl('female.png');
    }
    return getIconUrl('maleAvatar.png');
}


export const getUrlTypeAvtOfCusData = (cusData: {
    avtData?: { imgUrl: string };
    preset_avt: string;
    [key: string]: any
}) => {
    if (cusData && cusData.avtData && Object.keys(cusData.avtData).length > 0) {
        return {url: IMG_URL + cusData.avtData.imgUrl, type: 'default'}
    } else if (cusData && cusData.preset_avt) {
        return {
            url: cusData.preset_avt,
            type: 'icon'
        }
    } else {
        return {url: '', type: 'default'}
    }
}
