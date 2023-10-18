import type {PjData, UserData} from "@/types/interface";
import type {ChatType} from "@/utils/chatConstants";
import type {DetailUnit} from "@/models/unit";

export interface unitRequestRepo extends Partial<DetailUnit> {}

export interface State {
    isLoggedIn: boolean;
    cartItems: { inqId: number, cards: Card[] }[];
    pjLibData: PjData,
    totalNewPrcChat: number,
    spChatData: ChatType [];
    reqChatData: any ,
    unitRequestChatRepo: any ,
    currentUserData:  UserData,
}


export interface Card {
    id: number;
    name: string;
    price: number;
    inqId: number;
}

const state: State = {
    isLoggedIn: false,
    cartItems: [],
    pjLibData: {
        id: -1,
        code: "",
        name: "",
        projectColor: "",
    },
    spChatData: [],
    reqChatData: [],
    totalNewPrcChat: 0,
    unitRequestChatRepo: [],
    currentUserData: {} as UserData,
};


export default state;
