import {DataLibType} from "@/utils/dataLib";
import {UnitType} from "@/utils/dataLib";

const POINTING = [
    ['east', 'Đông'],
    ['west', 'Tây'],
    ['south', 'Nam'],
    ['north', 'Bắc'],
    ['southeast', 'Đông Nam'],
    ['northeast', 'Đông Bắc'],
    ['southwest', 'Tây Nam'],
    ['northwest', 'Tây Bắc'],
]
const Renting = [
    {
        id: 'rent',
        content: 'Thuê',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 'buy',
        content: 'Bán',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
]
const Furniture = [
    {
        id: 'partly',
        content: 'Nội thất cơ bản',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 'fully',
        content: 'Full nội thất',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
]
const Bedroom = [
    {
        id: '1',
        content: '1',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: '1+',
        content: '1+',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: '2',
        content: '2',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: '2+',
        content: '2+',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: '3',
        content: '3',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: '3+',
        content: '3+',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: '4',
        content: '4',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: '4+',
        content: '4+',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: '5',
        content: '5+',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
]
const View = [
    {
        id: 'pool',
        content: 'Hồ bơi',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 'city',
        content: 'Thành Phố',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 'inner',
        content: 'Nội Khu',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 'river',
        content: 'Sông',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 'landmark',
        content: 'Biểu tượng',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 'park',
        content: 'Công viên',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 'road',
        content: 'Đại lộ',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
]

const UnType= [
    {
        id: UnitType.OFFICETEL,
        content: 'Officetel',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: UnitType.STUDIO,
        content: 'Studio',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: UnitType.SHOPHOUSE,
        content: 'Shophouse',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: UnitType.DUPLEX,
        content: 'Duplex',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: UnitType.PENTHOUSE,
        content: 'Penhouse',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
]

export const FreeUnit = [
    {
        id: 30,
        content: 'Sau 1 tháng',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 60,
        content: 'Sau 2 tháng',
        status: 'gray-btn',
        onBtnColor: 'black',
    },
    {
        id: 90,
        content: 'Sau 3 tháng',
        status: 'gray-btn',
        onBtnColor: 'black',
    }
]
const Pointing:any = []

POINTING.map(point => {
    Pointing.push({id:point[0],content:point[1],status:'gray-btn', onBtnColor: 'black'})
})


export {
    Furniture, Renting, Bedroom, View, Pointing,UnType
}
