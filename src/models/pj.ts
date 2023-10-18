import {URequestSttEnum} from "@/models/unitRequest";
export interface CommonData {
    id: number,
    name: string
}
export enum OWN_DURATION {
    LONG = 'long',
    SHORT = '50',
    Y50 = '50'
}

export const OWN_DUR_STATUS  = [
    [OWN_DURATION.LONG, 'Sở hữu lâu dài'],
    [OWN_DURATION.SHORT, 'Sở hữu 50 năm'],
    [OWN_DURATION.Y50, 'Sở hữu 50 năm'],
]

export const FEES_DATA_STATUS = [
    ['bicy','Phí gửi xe đạp'],
    ['car','Phí xe >6 chỗ'],
    ['elec','Giá điện'],
    ['water','Giá nước'],
    ['mgmt','Phí quản lý'],
    ['smCar','Phí xe 4-5 chỗ'],
    ['moto','Phí gửi xe moto']
]



export interface Project extends CommonData {
    projectColor: string,
    code: string,
}
export interface MgmtCompData extends CommonData {}

export interface InternetData extends CommonData {}

export interface BlkData extends CommonData {}

export interface AvtData {
    alt: string,
    id: number,
    imgUrl: string,
}
export interface FeesData {
    id: number;
    mgmt: number;
    bicy: number;
    motor: number;
    smCar: number;
    car: number;
    elec: number;
    water: number;
}
export interface ProjectData {
    id: number,
    name: string,
    projectColor: string,
    address:string,
    code: string,
    investor:string,
    level:number,
    size:number,
    destiny:number,
    hoc_status:number,
    hoc_date:string,
    own_dur:string,
    district:string,
    mgmtCompData:MgmtCompData,
    internetData: InternetData[],
    blkData:BlkData[],
    avtData:AvtData,
    feesData:FeesData,
    units_count:number
}

export const getProjectInternet = (internet: InternetData[]): string => {
    if(internet && internet.length)
    {
        const stringArray=internet?.map(element => element.name.toString());
        return stringArray.join(', ');
    }
    return ''
}

export const validateValue = (value: string | number, textDefault: string= '',extend:string = ''): string => {
    if (value === undefined) {
         return value+extend;
    }
    if (typeof value === 'number') {
        if (value > 0) {
            return value.toString()+extend;
        }
    } else {
        if (value.trim() !== '') {
            return value+extend;
        }
    }
    return textDefault;
}
