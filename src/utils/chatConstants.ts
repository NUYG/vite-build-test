import type {FPUser} from "@/models/fpUser";
import type {BasicContactor} from "@/models/fpUser";
import type {UnitData} from "@/types/interface";

export enum sendingMsgStatus {
    PENDING,
    OK,
    ERROR,
}

export enum detailPageDirect {
    cusDetail = 'cusDetail',
    spDetail = 'spDetail'
}

export enum SetChatDataEnum {
    spChat = 'spChat',
    requestChat = 'requestChat'
}
export interface ChatExtData {
    chatType: string,
    imgList: { imgId: number, imgName: string }[],
    id: number,
    init_time: string,
    role: string,
    seenBy: number[],
    short_msg: string,
}

export interface ChatData {
    a_seen: boolean ,
    hasMsg: boolean ,
    id: number,
    last_seen_msg: number ,
    msg_data: ChatExtData []
    sMsg: ChatExtData []
    s_seen: true
    tt_unseen_msg: 0
}

export interface ChatType {
    agentData: FPUser,
    chatData: ChatData,
    cusData: BasicContactor,
    id: number,
    price: number,
    rent: boolean,
    unitData: UnitData
}
