import type { GetterTree } from 'vuex';
import type { State, Card } from './state';

const getters: GetterTree<State, State> = {
    getAllStore: (state) => {
     return state
    },
    getCardsByInqId: (state) => (inqId: number): Card[] => {
        return state.cartItems.find(item => item.inqId === inqId)?.cards || [];
    },
    getPjLibData: (state) => {
        return state.pjLibData;
    },
    getTotalNewPrcChat : (state) => {
        return state.totalNewPrcChat
    },
    getIsLoggedIn : (state) => {
        return state.isLoggedIn
    },
    getSpChatData: (state) => {
        return state.spChatData
    },
    getRequestChatData: (state) => {
        return state.reqChatData
    },
    getChatDataById: (state) => (id: number) => {
        return state.spChatData.find((item) => item.id === id) || null;
    },
    getUnitRequestChatRepo: (state ) => {
        return state.unitRequestChatRepo
    }
};

export default getters;
