import type {ActionTree} from 'vuex';
import type {Card, State} from './state';
import { post} from "@/utils/dataQuery";
import {hasLogin} from "@/utils/utils";
import {SetChatDataEnum} from "@/utils/chatConstants";

const actions: ActionTree<State, State> = {
    addCardToCart({commit}, payload: { card: Card; inqId: number }) {
        commit('addToCart', payload);
    },
    removeCardFromCart({commit}, payload: { card: Card; inqId: number }) {
        commit('removeFromCart', payload);
    },
    async getPjDataLib({commit}) {
        try {
            const data = await post('/sales/get_pjs_filter',{});
            commit('updatePjData', data.returnData);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    },
    setTotalNewPrcChat({commit},payload: {totalChat:number}) {
        commit('setTotalNewPrcChat', payload)
    },
    async checkLoginStatus({ commit }) {
        const isLoggedIn = await hasLogin();
        commit('setLoginStatus', isLoggedIn)
    },
    setDefaultChatData({ commit }, payload:{ dataType: SetChatDataEnum, newData: any }) {
        if (payload.dataType === SetChatDataEnum.spChat) {
            commit('setSpChatData', payload.newData);
        } else if (payload.dataType === SetChatDataEnum.requestChat) {
            commit('setRequestChatData', payload.newData);
        }
    },
};

export default actions;
