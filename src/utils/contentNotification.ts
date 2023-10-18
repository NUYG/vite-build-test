import {fixDateTime} from '@/utils/dateTimeUtils'
import {Roles} from "@/utils/constants";
import {getParamFromPathname} from "@/utils/utils";

export interface DataParams {
   id: number;
   name: string;
   code: string;
   day: string;
   status: string,
   bedroom: number,
   rent: boolean,
   pj: string,
   price: number,
   count: number,
   msg: string
}

export interface OptDataParams extends Partial<DataParams> {
}

export interface DayDataParams extends Partial<DataParams> {
   day: string
}

export interface RentDataParams extends Partial<DataParams> {
   rent: boolean
}

const renting = (rent: boolean) => {
   return rent ? 'thuê' : 'mua'
}

// expiring unit
const A1 = (data: DayDataParams) => {
   return {
      title: `Đến lúc chăm lại chủ rồi ${data.name} ơi`,
      body: `Căn hộ ${data.code} sắp hết hạn hợp đồng vào ${fixDateTime(data.day)}.`
   }
}
// message chat
const A2 = (data: OptDataParams) => {
   return {
      title: `#${data.id} ${data.code}`,
      body: `${data.name}: ${data.msg}`
   }
}
// suggest an appointment
const A3 = (data: DayDataParams) => {
   return {
      title: `#${data.id} ${data.code} `,
      body: `${data.name} vừa đề xuất một lịch hẹn vào ${fixDateTime(data.day)}.`
   }
}

// confirm next step sp
const A4 = (data: OptDataParams) => {
   return {
      title: `#${data.id} ${data.code} `,
      body: `${data.name} vừa xác nhận đã ${data.status}. Vui lòng xác nhận nếu thông tin này chính xác`
   }
}
// pause sp
const A5 = (data: RentDataParams) => {
   return {
      title: `#${data.id} ${data.code} `,
      body: `${data.name} đã tiếp tục liên kết ${renting(data.rent)} căn hộ này`
   }
}

// restore sp
const A6 = (data: RentDataParams) => {
   return {
      title: `#${data.id} ${data.code} `,
      body: `${data.name} đã tiếp tục liên kết ${renting(data.rent)} căn hộ này`
   }
}

// permission has been granted by Mn
const A7 = (data: RentDataParams) => {
   return {
      title: `#${data.id} ${data.code} `,
      body: `Bạn vừa liên kết với ${data.name}  ${renting(data.rent)} căn hộ này. Nhấn vào đây để bắt đầu đặt lịch hẹn `
   }
}

// today appointment
const A8 = (data: OptDataParams) => {
   return {
      title: `lịch hẹn hôm nay`,
      body: `Chào buổi sáng ${data.name}, bạn có ${data.count} lịch hẹn diễn ra vào hôm nay. `
   }
}

// appointment upcoming
const A9 = (data: DayDataParams) => {
   return {
      title: `Sắp có hẹn tại ${data.pj} vào ${fixDateTime(data.day)}!`,
      body: `Đừng quên bạn có hẹn tại dự án ${data.pj}. Nhớ sắp xếp thời gian để đến dự án đúng giờ hẹn nhé! `
   }
}

// appointment has been canceled
const A10 = (data: OptDataParams) => {
   return {
      title: `#${data.id} ${data.code}`,
      body: `${data.name} đã huỷ lịch ${data.status}. Sắp xếp và đặt lại lịch hẹn mới nhé! `
   }
}


export const agentNotification = {
   'A1': A1,
   'A2': A2,
   'A3': A3,
   'A4': A4,
   'A5': A5,
   'A6': A6,
   'A7': A7,
   'A8': A8,
   'A9': A9,
   'A10': A10,
}

//Sales Content Notification

const salesTitleNotification = (data: OptDataParams) => {
   return `#GD ${data.id} < ${data.code} >`
}
//Sales message
const S1 = (data: OptDataParams) => {
   return {
      title: salesTitleNotification(data),
      body: `${data.name}: ${data.msg}`
   }
}
// suggest an appointment
const S2 = (data: DayDataParams) => {
   return {
      title: salesTitleNotification(data),
      body: `${data.name} vừa đề xuất một lịch hẹn vào ${fixDateTime(data.day)}`
   }
}

// confirm next step
const S3 = (data: OptDataParams) => {
   return {
      title: salesTitleNotification(data),
      body: `${data.name} vừa xác nhận đã ${data.status}`
   }
}

// pause sp
const S4 = (data: RentDataParams) => {
   return {
      title: salesTitleNotification(data),
      body: `${data.name} đã dừng liên kết ${renting(data.rent)} căn hộ này`
   }
}

// restore sp
const S5 = (data: RentDataParams) => {
   return {
      title: salesTitleNotification(data),
      body: `${data.name} đã tiếp tục liên kết  ${renting(data.rent)} căn hộ căn hộ này`
   }
}

const S6 = (data: RentDataParams) => {
   return {
      title: salesTitleNotification(data),
      body: `Bạn vừa được kết nối với ${data.name}  ${renting(data.rent)} căn hộ này. Nhấn vào đây để bắt đầu đặt lịch hẹn.`
   }
}

// S7 = A8
// S8 = A9

const S9 = (data: OptDataParams) => {
   return {
      title: salesTitleNotification(data),
      body: `${data.name} đã huỷ lịch ${data.status}. Sắp xếp và đặt lại lịch hẹn mới nhé!`
   }
}

export const salesNotification = {
   'S1': S1,
   'S2': S2,
   'S3': S3,
   'S4': S4,
   'S5': S5,
   'S6': S6,
   'S7': A8,
   'S8': A9,
   'S9': S9
}


//MANAGER NOTIFICATION

const M1 = (data: OptDataParams) => {
   return {
      title: `#GD ${data.code} ${data.id} vừa được tạo`,
      body: `Hãy bổ nhiệm Agent phù hợp vào giao dịch để có thể thương lượng thành công.`
   }
}
const M2 = (data: RentDataParams) => {
   return {
      title: `#GD ${data.code} [Cho thuê/Bán] thành công!`,
      body: `Căn hộ ${data.code} ${data.price} đã ${renting(data.rent)} thành công với Khách hàng [Tên Khách].`
   }
}

const mnNotification = {
   'M1': M1,
   'M2': M2
}


export const roleNotification = {
   [Roles.Agent]: agentNotification,
   [Roles.Sales]: salesNotification,
   [Roles.Manager]: mnNotification
}


export const notifyNewChatCode = ['S1', 'A2','URS1']
