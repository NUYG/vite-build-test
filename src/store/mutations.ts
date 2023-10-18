import type {MutationTree} from 'vuex';
import type {Card, State, unitRequestRepo} from './state';
import type {PjData, UserData} from "@/types/interface";
import type {ChatExtData, ChatType} from "@/utils/chatConstants";
import {chatObjType} from "@/models/fpChat";
import type {DetailUnit} from "@/models/unit";
import {Roles} from "@/utils/constants";

const mutations: MutationTree<State> = {
    resetChatState(state)
    {
        state.cartItems = [];
        state.spChatData = [];
        state.reqChatData = [];
        state.totalNewPrcChat = 0;
        state.unitRequestChatRepo = [];
    },
    addToCart(state, payload: { inqId: number; card: Card }) {
        const { inqId, card } = payload;
        const existingCartItem = state.cartItems.find(item => item.inqId === inqId);
        if (existingCartItem) {
            const isCardExists = existingCartItem.cards.some(item => item.id === card.id);
            if (!isCardExists) {
                existingCartItem.cards.push(card);
            }
        } else {
            state.cartItems.push({ inqId, cards: [card] });
        }
    },
    removeFromCart(state, payload: { inqId: number; card: Card }) {
        const { inqId, card } = payload;
        const cartItem = state.cartItems.find(item => item.inqId === inqId);
        if (cartItem) {
            cartItem.cards = cartItem.cards.filter(item => item.id !== card.id);
        }
    },
    setCurrentUserData(state , payload: UserData){
            state.currentUserData = payload
    },
     updatePjData(state, payload: PjData) {
        state.pjLibData = payload;
    },
    setTotalNewPrcChat(state, payload :number ) {
        state.totalNewPrcChat = payload
    },
    setLoginStatus(state, payload: boolean) {
        state.isLoggedIn = payload
    },
    setSpChatData(state, payload: any) {
        state.spChatData.push(...payload)
    },
    setRequestChatData(state, payload: any ) {
        state.reqChatData.push(...payload)
    },
    updateData(state, newData: ChatType[]) {
        state.spChatData = newData;
    },
    filterById(state, id: number) {
        state.spChatData = state.spChatData.filter((item) => item.id === id );
    },
    updateNewChat(state , payload:{ id: number, role: string, status: boolean, isRequestChat: boolean }) {
          const chatType: any = payload.isRequestChat ? state.reqChatData : state.spChatData
          const roleSeen = payload.role === Roles.Sales ? 's_seen' : 'a_seen'
          chatType?.map((chatItem: any) => {
              if(chatItem.id === payload.id && chatItem.chatData)
              {
                    chatItem.chatData[roleSeen] = payload.status
              }
          })
    },
    moveChatDataById(state, payload: {id: number, newPosition: number, isRequestChat: boolean}){
        const array = payload.isRequestChat ? state.reqChatData : state.spChatData
        const index = array.findIndex((item: any) => item.id === payload.id);
        if (index !== -1) {
            const [element] = array.splice(index, 1);
            array.splice(payload.newPosition, 0, element);
        } else {
            console.error(`Không tìm thấy phần tử với id ${payload.id} trong mảng.`);
        }
    },
    updateMsgData(state, payload: { id: number; newMsgData: ChatExtData[], isRequestChat: boolean}) {
        console.log('ưpdate dô store')
        const chatType: any = payload.isRequestChat ? state.reqChatData : state.spChatData
        const chatIndex = chatType.findIndex((item: any) => item.id === payload.id);
        if (chatIndex !== -1) {
            if (!chatType[chatIndex].chatData || !chatType[chatIndex].chatData.msg_data) {
                chatType[chatIndex].chatData = { msg_data: [] };
            }
            chatType[chatIndex].chatData.msg_data?.unseen_msgs?.push(payload.newMsgData);
        }
    },
    setUnitRequestChatRepo(state, payload: unitRequestRepo){
        const existUnit = state.unitRequestChatRepo?.find((item: any) => item.id === payload.id)
        if(!existUnit)
        {
            state.unitRequestChatRepo.push(payload)
        }
    },
    addUnitToRequestChatRepo(state, payload: { reqChatId: number, unitData: DetailUnit}) {
        const reqChatIndex = state.reqChatData.findIndex((item: any) => item.id === payload.reqChatId)
        if (reqChatIndex !== -1) {
            console.log('TÌM THẤY M R ', state.reqChatData[reqChatIndex])
            if (!state.reqChatData[reqChatIndex]?.unitData) {
                state.reqChatData[reqChatIndex].unitData = [];
            }
            state.reqChatData[reqChatIndex].unitData.push(payload.unitData);
        }
        console.log(state.reqChatData[reqChatIndex].unitData , 'sau khi đã push')
    }
};

export default mutations;
