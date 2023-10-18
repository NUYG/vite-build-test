import {apiUrls, IMG_URL} from "@/utils/constants";
import type {anyObj} from "@/types/objTypes";
import moment from "moment/moment";
import {addZeroToDateTime, fixDateTime} from "@/utils/dateTimeUtils";
import type {StatusRepo} from "@/types/interface";
import {API_BASE_URL, post} from "@/utils/dataQuery";
import type {PjData} from "@/types/interface";
import axios from "axios";


export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);


export const floatBugFixed = (num: number|undefined) => {
    if(!num)
    {
        return 0
    }
    return floatFixedNum(parseFloat(num.toString()).toFixed(3), 3);
}

export enum TypeName {
    NUMBER = 'number',
    DATE = 'Date',
    BOOLEAN = 'boolean',
    STRING = 'string',
    SYMBOL = 'symbol',
    OBJECT = 'object',
}


const typeCheck = (variable: any) => {
    if (variable == null) {
        return null;
    }
    if (typeof variable == 'number') {
        return TypeName.NUMBER;
    }
    if (typeof variable == 'boolean') {
        return TypeName.BOOLEAN;
    }
    if (moment(variable).isValid()) {
        return TypeName.DATE;
    }
    return TypeName.STRING
}

export const checkValidValue = (value:any) => {
        if (!value) {
            return false;
        }
        if (typeof value === 'string') {
            return value.trim() !== '';
        }
        if (typeof value === 'number') {
            return value > 0;
        }
        if (typeof value === 'object') {
            return Object.keys(value).length > 0;
        }
        return false;
}

const calendarMinDate = (date: Date = new Date()) => {
    const toDate: Date = new Date();
    return `${toDate.getFullYear()}-${addZeroToDateTime(
        toDate.getMonth() + 1
    )}-${addZeroToDateTime(toDate.getDate())}`;
}


const mobileShare = async (imgs: string[], text: string) => {
    copyTextToClipboard(text);
    try {
        if (navigator.share) {
            const chunkSize = 10;
            const chunk = imgs.slice(0, chunkSize);
            const tempImgs = await Promise.all(
                chunk.map(async (url) => {
                    const res = await fetch(IMG_URL + url);
                    const blob = await res.blob();
                    return new File([blob], url, {
                        type: "image/jpeg"
                    })
                })
            );

            const shareData = {
                files: tempImgs,
                title: "a",
                text: text,
            }

            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log(err);
            }
        }
    } catch (err) {
        console.log(err);
    }
};


const copyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    navigator.clipboard.writeText(textArea.value)
        .then(() => {
            // console.log('clipboard copy succeed, ', text);
        })
        .catch((error) => {
            console.error('Failed to copy text to clipboard:', error);
        })
        .finally(() => {
            // Remove the textarea element from the DOM
            document.body.removeChild(textArea);
        });
};


const translate = (dict: string[][], value: string, defaultVal: string | null = null) => {
    if (dict) {
        for (let i = 0; i < dict.length; i++) {
            if (dict[i][0] === value) {
                return dict[i][1];
            }
        }
    }
    return defaultVal == null ? value : defaultVal;
};


const dictTranslate = (dict: { [key: string]: string }, value: string, defaultVal: string | null = null) => {
    try {
        return dict[value];
    } catch (err) {
        return defaultVal == null ? value : defaultVal;
    }
};


const floatFixedNum = (num: number | string, maxFrac: number = 2) => {
    return parseFloat(floatFixed(num, maxFrac));
};


const floatFixed = (num: number | string, maxFrac: number = 2) => {
    if(num)
    {
        if (typeof num === 'string') {
            num = parseFloat(num);
        }

        for (let frac = 0; frac < maxFrac; frac++) {
            const trimmed: string = num.toFixed(frac);
            if (parseFloat(trimmed) === num) {
                return trimmed;
            }
        }
        return num.toFixed(maxFrac);
    }
    else return ''

};

const fixedUnitCode = (block: string, floor: string, unit: string) => {
    const checkBlock = block ? block + "-" : "";
    return checkBlock + floor + "." + unit;
}

const floatTrimmed = (num: number | string, maxFrac: number = 2) => {
    // Alias of floatFixed
    return floatFixed(num, maxFrac);
};

const arrToObj = (arr: string[]) => {
    const obj: anyObj = {};
    arr.forEach((el) => {
        obj[el] = true;
    });
    return obj;
}

const joinUrl = (root: string, url: string) => {
    return root + url;
};

const getIconUrl = (iconName: string) => {
    return apiUrls.ICON_URL + iconName

};
const getAnimJson = (jsonFileName:string) => {
    return apiUrls.ANIMATION_JSON + jsonFileName
}

const goToURL = (url: string) => {
    window.location.href = url;
};

const removeSessionItem = (ssKey: string) => {
    return sessionStorage.removeItem(ssKey);
}

const removeLocalItem = (ssKey: string) => {
    return localStorage.removeItem(ssKey);
}

const setLocalStorageItem = (key: string, value: string): void  => {
    localStorage.setItem(key, value);
}

const changeLocalStorageItem = (key: string, newValue: string): void =>{
    if (localStorage.getItem(key) !== null) {
        localStorage.setItem(key, newValue);
    }
}
const getItemFromLocalStorage = (key: string): string | null =>{
    try {
        const item = localStorage.getItem(key);
        return item !== null ? item : null;
    } catch (error) {
        console.error('Error retrieving item from localStorage:', error);
        return null;
    }
}

const getParamFromPathname = (paramName: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

const phoneCall = (phoneNumber: string) => {
    return window.location.href = `tel:${phoneNumber}`;
}

const goZaloWebWithPhoneNumbInMobile = (phoneNumber: number | string) => {
    return window.location.href = `https://zalo.me/${phoneNumber}`
}
const goZaloWebWithPhoneNumbInDesktop = (phoneNumber: number | string) => {
    return window.location.href = `zalo://conversation?phone=${phoneNumber}`
}
const goMsgerWithIdFacebookDesktop = (id: string) => {
    return window.location.href = `https://www.facebook.com/messages/t/${id}`
}

const goMsgerWithIdFacebookMobile = (id: string) => {
    return window.location.href = `https://www.messenger.com/t/${id}`
}

const getObjField = (object: { [key: string]: any }, field: string, defaultVal: any = '') => {
    return object && (field in object) ? object[field] : defaultVal;
};


export const diffDays = (time: string, from: string | Date = new Date()) => {
    return moment(from).diff(moment(time), 'days');
}

export const diffHours = (time: string, from: string | Date = new Date()) => {
    return moment(from).diff(moment(time), 'hours');
}

export const diffMins = (time: string, from: string | Date = new Date()) => {
    return moment(from).diff(moment(time), 'minutes');
}


const formatLastDayTime = (time: string) => {
    if (!time) {
        return 'Chưa bắt đầu';
    }
    const specificDate = moment(time);
    const now = moment();
    const diffMinutes = now.diff(specificDate, 'minutes');
    const diffHours = now.diff(specificDate, 'hours');
    const diffDays = now.diff(specificDate, 'days');
    if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
        return `vài giây`;
    } else if (diffDays === 0 && diffHours === 0) {
        return `${diffMinutes} phút`;
    } else if (diffDays === 0) {
        return `${diffHours} giờ`;
    } else if (diffDays < 7) {
        return `${diffDays} ngày`;
    } else {
        return fixDateTime(time)
    }
}

const formatTimeMaxIsWeek = (time: string) => {
    if (!time) {
        return 'Chưa bắt đầu';
    }
    const specificDate = moment(time);
    const now = moment();
    const diffMinutes = now.diff(specificDate, 'minutes');
    const diffHours = now.diff(specificDate, 'hours');
    const diffDays = now.diff(specificDate, 'days');
    const diffWeeks = now.diff(specificDate, 'weeks');
    if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
        return `vài giây`;
    } else if (diffDays === 0 && diffHours === 0) {
        return `${diffMinutes} phút`;
    } else if (diffDays === 0) {
        return `${diffHours} giờ`;
    } else if (diffDays < 7) {
        return `${diffDays} ngày`;
    } else if (diffWeeks === 1) {
        return `1 tuần`;
    } else if (diffWeeks > 1) {
        return `${diffWeeks} tuần`;
    } else {
        const remainingTime = specificDate.diff(now, 'days');
        const remainingWeeks = Math.ceil(remainingTime / 7);
        return remainingWeeks > 0 ? `${remainingWeeks} tuần` : '';
    }
}
const getLastUpdateColor = (time: string) => {
    if (!time) {
        return '#1c1c1c';
    }
    const specificDate = moment(time);
    const now = moment();
    const diffDays = now.diff(specificDate, 'days');
    if (diffDays < 14) {
        return '#1c1c1c';
    } else if (diffDays > 14 && diffDays < 30) {
        return '#FFA928';
    } else {
        return `#FF4747`;
    }
}

const getValueProgressBarWithStatus = (status: string) => {
    const statusRepo: StatusRepo = {
        '': 0,
        waiting: 0.1,
        scouting: 1,
        depositing: 2,
        notarizing: 3,
        signing: 4,
        done: 5,
    };
    return (statusRepo[status] / 4) * 100;
}

const getColorByRentStatus = (rent: boolean) => {
    return rent ? '#48BD48' : '#F76754'
}

const getUserIdFromFb = (link: string) => {
    const parts = link.split('/');
    const userAndId = parts[parts.length - 1];
    return userAndId.split('.')[0];
}

// Convert gray color HEX -> opacity 000000 -> 0, FFFFFF -> 16
const grayToOpacity = (grayScale: number) => {
    return (grayScale) / 16;
}

const calcAngleItem = (originalRadius: number, itemCount: number, itemRadius: number) => {
    const positions = [];
    const angleStep = (2 * Math.PI) / itemCount;

    for (let i = 0; i < itemCount; i++) {
        const angle = i * angleStep;
        const x = Math.cos(angle) * (originalRadius - itemRadius);
        const y = Math.sin(angle) * (originalRadius - itemRadius);
        positions.push({x, y});
    }
    return positions;
}


const getAvatarDataURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch avatar image. Status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const reader = new FileReader();

                reader.onloadend = () => {
                    const dataURL = reader.result as string;
                    resolve(dataURL);
                };

                reader.onerror = (error) => {
                    reject(error);
                };

                reader.readAsDataURL(blob);
            })
            .catch(error => reject(error));
    });
}

const queryImgUserFb = async (facebookUrl: string): Promise<{ dataUrl: string; url: string }> => {
    try {
        const userId = getUserIdFromFb(facebookUrl);
        const url = `https://graph.facebook.com/${userId}/picture?type=large`;
        const dataUrl = await getAvatarDataURL(url);
        return {dataUrl, url}
    } catch (error) {
        throw error;
    }
}


interface SelectedFile {
    name: string;
    dataUrl: string;
}

const updateAvtUser = async (selectedFile: SelectedFile, cusId: number): Promise<void> => {
    const response = await post("/mlib/img/user_avt_upload", {
        objId: cusId,
        imgName: selectedFile.name,
        imgData: selectedFile.dataUrl,
    });
    if (response) {
        window.alert("Cập nhật ảnh thành công");
        return response.imgData;
    }
}

const uncapitalizeFirstLetter=(str:string) =>  {
    return str.substring(0, 1).toLowerCase() + str.substring(1);
}

export const requestToSeverWhenUserCheckIn = async () => {
    return await post('/fp_user/user_online_active', {})
}

export const requestToSeverWhenUserCheckOut = async () => {
    return await post('/fp_user/user_offline_active',{})
}

export const callToNumber = (phoneNumb: number) => {
        return phoneNumb ?  window.location.href = `tel:${phoneNumb}` : ''
}

export const findProjectIdByName = (name: string, projects: PjData[]): number | null => {
    console.log('vô hàm tìm nè cu',projects)
        const project = projects?.find((project) => project.name === name);
        return project ? project.id : null;
}

export const replaceCharacter = (inputString: string, charToReplace: string, replacementChar: string): string  => {
    const regex = new RegExp(charToReplace, 'g');
    return inputString?.replace(regex, replacementChar);
}

export const extractFirstNum = (input: string): number | null => {
    const reMatch = input.match(/\d+/)
    return reMatch ? parseFloat(reMatch[0]) : null
}

export const hasLogin = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}${`/fp_user/check_user_login`}`, {});
        return response.status === 200
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}


export {
    copyTextToClipboard,
    translate,
    dictTranslate,
    floatFixed,
    mobileShare,
    floatTrimmed,
    arrToObj,
    getIconUrl,
    goToURL,
    fixedUnitCode,
    removeSessionItem,
    removeLocalItem,
    getParamFromPathname,
    phoneCall,
    goZaloWebWithPhoneNumbInMobile,
    goZaloWebWithPhoneNumbInDesktop,
    getObjField,
    formatLastDayTime,
    getValueProgressBarWithStatus,
    getColorByRentStatus,
    getLastUpdateColor,
    formatTimeMaxIsWeek,
    getUserIdFromFb,
    goMsgerWithIdFacebookDesktop,
    goMsgerWithIdFacebookMobile,
    calcAngleItem,
    grayToOpacity,
    typeCheck,
    calendarMinDate,
    getAvatarDataURL,
    queryImgUserFb,
    updateAvtUser,
    uncapitalizeFirstLetter,
    setLocalStorageItem,
    changeLocalStorageItem,
    getItemFromLocalStorage,
    getAnimJson
};
