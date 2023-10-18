<template>
  <FpDefLayout
      :bcProps="pgMeta" ref="pgLayoutComp" :rBWidth="4"
      :mainVh100="true" >
    <template #comp>
      <div class="h-100">
        <div class="chat-view">
           <ConversationView
               :unit-type="chatType"
               :msg-default="chatDefaultData" :roomId="roomID"
               :partner="currentChat" :is-req-chat="requestChat" :role="role">
           </ConversationView>
        </div>
      </div>
    </template>
    <template #rightBar>
      <div class="vh-100">
        <div class="container-fluid d-flex justify-content-around text-content mt-3 font-weight-600" style="height: 5%"
             v-if="role===Roles.Sales">
          <ButtonBadge :badge-numb="ttUnSChat">
            <template #objectBadged>
              <ButtonView class="col-auto" content="Giao dịch" status="gray-btn" on-btn-color="#5E52FF"
                          :active-btn="!requestChat" @click="requestChat=false"></ButtonView>
            </template>
          </ButtonBadge>
          <ButtonBadge :badge-numb="ttUnSReqChat">
            <template #objectBadged>
              <ButtonView class="col-auto" content="Yêu cầu tìm căn" status="gray-btn" on-btn-color="#5E52FF"
                          :active-btn="requestChat" @click="showRequestChatTab"></ButtonView>
            </template>
          </ButtonBadge>
        </div>
        <div class="overflow-scroll m-2 row" style="height: 93%">
          <LoadingAnimContainer :is-loading="!finishLoading">
              <template #content>
                <div class="ps-3 mt-2" v-if="chatDataList.length > 0">
                  <div v-for="(data,index) in chatDataList" class="ps-2 py-1 cursor-pointer chat-list-hover"
                       :key="index" :class="{'active-box': index === activeChatIndex}" @click="chatCLickHandler(index)">
                    <ConversationHeader  :partner="data" :seen="activeChatIndex=== index || checkSeenChat(data?.chatData)"></ConversationHeader>
                  </div>
                </div>
                <div v-else>
                  <p  class="text-center font-weight-600 " style="font-size: 20px;color: #D9D9D9">Hộp thư trống</p>
                  <div class="row d-flex justify-content-center">
                    <FpIcon src-icon="blankmessage.png" :size="400" class="col-auto p-0"></FpIcon>
                  </div>
                </div>
              </template>
          </LoadingAnimContainer>

        </div>
      </div>
    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import ConversationView from "@/components/FpConversation/ConversationView.vue";
import {post} from "@/utils/dataQuery";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import ConversationList from "@/components/FpConversation/ConversationList.vue";
import {floatFixed} from "@/utils/utils";
import {scrWdtEnum, scrWdtFrom, scrWdtTo} from "@/utils/windowWidth";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "@/utils/firebaseConfig";
import {getCollectionNameByEnv} from "@/utils/conversationsLib";
import {Roles} from "@/utils/constants";
import ConversationRequestUnit from "@/components/FpConversation/ConversationRequestUnit.vue";
import {getPjNameInPjData, unitPrice, uPricePfxExt} from "@/utils/unit";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
import ButtonBadge from "@/components/FpButton/ButtonBadge.vue";
import ConversationHeader from "@/components/FpConversation/FpChatInformation.vue";
import SocketConnectHandler from "@/socketIO/chatListenSocket.vue";
import actions from "@/store/actions";
import {mapActions, mapGetters} from "vuex";
import {SetChatDataEnum} from "@/utils/chatConstants";
import {chatObjType} from "@/models/fpChat";
import LoadingAnimContainer from "@/components/FpAnimation/LoadingAnimContainer.vue";

export default {
  components: {
    LoadingAnimContainer,
    SocketConnectHandler,
    ConversationHeader,
    ButtonBadge,
    FpIcon,
    ConversationRequestUnit,
    FpDefLayout,
    ConversationView,
    ConversationList,
    ButtonView
  },
  data() {
    return {
      spName: '',
      pjName: '',
      bedRoom: '',
      price: '',
      spID: -1,
      pgMeta: {
        [breadcrumpProp.showRB]: true,
        [breadcrumpProp.behaviorType]: defLayoutBehaType.chatHub,
        [breadcrumpProp.title]: 'Nhắn tin',
      },
      spDataList: [],
      reqChatList: [],
      fetchDataLock: false,
      waitingFetch: false,
      requestChat: false,
      totalResult: 0,
      listLen: 12,
      currentPage: 1,
      page: 1,
      uRequests: [],
      urName: '',
      urID: 0,
      currentReqData: {},
      finishLoading: false,
      chatData: [],
      activeChatIndex: 0,
      isFirstCall: true
    }
  },
  props: {
    role: {
      type: String
    },
    showRequestChatFirst: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapGetters(['getSpChatData','getRequestChatData']),
    Roles() {
      return Roles
    },
    wLineChat() {
      if (scrWdtTo(scrWdtEnum.MD)) {
        return 75
      } else {
        return 25
      }
    },
    chatType()
    {
      return this.requestChat ? chatObjType.UNIT_REQUEST : chatObjType.SALE_PROCESS
    },
    reqChatId() {
      return parseInt(this.$route?.params?.reqChatId)
    },
    isSales() {
      return this.role === Roles.Sales
    },
    currentChat() {
      if(this.chatDataList.length > 0)
      {
        return this.chatDataList[this.activeChatIndex]
      }
    },
    roomID()
    {
      return this.requestChat ? this.currentChat?.urID : this.currentChat?.spId
    },
    chatDefaultData() {
      return this.currentChat?.chatData?.msg_data || []
    },
    chatDataList()
    {
      return this.requestChat ? this.formatDataList(this.getRequestChatData,true) : this.formatDataList(this.getSpChatData)
    },
    roomChat()
    {
      return this.getSpChatData.map(chat => `sp${chat.id}`)
    },
    roomRequest()
    {
      return this.getRequestChatData.map(chat => `ur${chat.id}`)
    },
    ttUnSChat(){
      return  this.filterTotalUnseen(this.getSpChatData)
    },
    ttUnSReqChat()
    {
      return  this.filterTotalUnseen(this.getRequestChatData)
    },
  },
  methods: {
    ...mapActions(['setDefaultChatData','setTotalNewPrcChat']),
    async showRequestChatTab()
    {
      if(this.isFirstCall)
      {
        this.finishLoading = false
        await this.getRequestChat()
        await this.joinRoom(this.roomRequest)
        this.finishLoading = true
        this.isFirstCall = false
      }
      this.requestChat = true
    },
    filterTotalUnseen(chatList)
    {
      return chatList.reduce((total, item) => {
        return total + (item?.chatData?.tt_unseen_msg || 0);
      }, 0);
    },
    formatDataList(chatData,isRequestChat) {
      if(chatData)
      {
        const formatData = []
        chatData.map(data => {
          formatData.push(isRequestChat ? this.partnerReqData(data) : this.partnerData(data))
        })
        return formatData
      }
    },
    checkSeenChat(chatData) {
     return this.isSales ? chatData?.s_seen : chatData?.a_seen
    },
    partnerData(data) {
      if (data) {
        return {
          name: this.isSales ? data.agentData?.first_name : data.salesData?.first_name,
          pjName: this.isSales ? data.unitData?.pjName : data.unitData?.pjData?.name,
          spData: data.id,
          rent: data?.rent,
          cusData: data?.cusData?.name,
          bedRoom: data?.unitData.bedroom,
          price: convertVndToUserCurrency(unitPrice(data.rent, data.unitData), data.rent, UnitCurrency.simple),
          status: data.rent ? 'thuê' : 'bán',
          code: `#${data.id}`,
          phone: this.isSales ? this.getUserData(data.agentData, 'phone') : this.getUserData(data.salesData, 'phone'),
          extData: this.isSales ? data?.agentData?.extData[0] : data?.salesData?.extData[0],
          chatData: data?.chatData,
          spId : data?.id
        };
      }
    },
    partnerReqData(data) {
      if (data) {
        return {
          status: data?.rent ? 'thuê' : 'bán',
          rent: data?.rent,
          cusData: data.inquiryData?.cusData?.name,
          name: data?.agentData?.first_name,
          urName: `ur${data.id}`,
          urID: data.id,
          pjName: getPjNameInPjData(data.inquiryData?.pjData),
          bedRoom: data.inquiryData.bedroom,
          price: convertVndToUserCurrency(data.inquiryData.ceilingPrice, data?.rent, UnitCurrency.simple),
          code: `YC${data.id}`,
          extData:  this.isSales ? data?.agentData?.extData[0] : data?.salesData?.extData[0],
          cusID: data.inquiryData?.cusData?.id,
          chatData: data?.chatData,
          inquiryData: data?.inquiryData,
          pairedUnits: data?.pairedUnits
        }
      }
    },
    getCollectionNameByEnv,
    getUserData(data, field) {
      if (data?.extData.length > 0) {
        return data.extData[0][field]
      } else {
        return ''
      }
    },
    async getChatData() {
      const res = await post('/sale_process/get_user_chats', {
        role: this.role,
        sorting: '-chat__last_update'
      })
      await this.setDefaultChatData({dataType: SetChatDataEnum.spChat, newData: res.returnData})
      this.finishLoading = true
    },
    async getRequestChat(){
      const res = await post('/u_request/get_request_chats', {
        role: this.role,
        sorting: '-chat__last_update'
      })
      await this.setDefaultChatData({dataType: SetChatDataEnum.requestChat, newData: res.returnData})

    },
    showRightBar(show) {
      this.$refs.pgLayoutComp.showRightBar(show);
    },
    activeChatBox() {
       this.$store.commit('updateNewChat', { id: this.roomID, role: this.role, status: true, isRequestChat: this.requestChat })
       this.msgSeen(this.currentChat?.chatData?.id)
    },
    async msgSeen(id) {
      const res = await post('/sale_process/seen_chat', {
        role: this.role,
        id: id
      })
    },
    activeReqChatWParams(id) {
      if(id > 0 && id)
      {
        this.requestChat = true
        this.activeChatBox()
        this.activeChatIndex = this.chatDataList?.findIndex(item => item.urID === id)
      }
    },
    addChatToStore(room,newData,isReqChat) {
      this.$store.commit('updateMsgData',{ id: parseInt(room),newMsgData: newData.msg, isRequestChat: isReqChat})
      if(parseInt(room) === this.roomID)
      {
        this.activeChatBox()
      }
      else {
        this.$store.commit('moveChatDataById',{id: parseInt(room), newPosition: 0 , isRequestChat: isReqChat})
        this.$store.commit('updateNewChat', { id: parseInt(room), role: this.role, status: false, isRequestChat: isReqChat })
        this.activeChatIndex = this.activeChatIndex + 1
      }
    },
    async updateRequestUnitChatRepo(reqId,unitId)
    {
      console.log(reqId,unitId)
      const unitData = await this.getUnitReqChatById(unitId)
      this.$store.commit('addUnitToRequestChatRepo',{ reqChatId: parseInt(reqId), unitData: unitData})
      console.log('đõa commit dô kho khi nhận được thông tin mới nò')
    },
    async getUnitReqChatById(id)
    {
      const res = await post('/u_request/get_unit_chat_data',{id: id})
      return res?.returnData
    },
    liveChatListen() {
      this.socket.on('new_msg',arg => {
        const isReqChat = arg?.room.substring(0,2) === 'ur'
        if(isReqChat)
        {
          const unitId = arg.msg?.extData?.unitID
          this.updateRequestUnitChatRepo(arg.room?.substring(2),unitId)
        }
        this.addChatToStore(arg.room?.substring(2),arg, isReqChat)
      })
    },
    async joinRoom(rooms) {
      if(rooms.length > 0)
      {
        console.log({emitEvent: true, rooms: rooms}, 'Đã gửi yêu cầu vào phòng')
        await this.socket.emit('join_rooms',{emitEvent: true, rooms: rooms})
        this.socket.on('room_entered',arg => {
          console.log(arg,'đã oke r đó')
        })
      }
    },
    chatCLickHandler(index)
    {
      if (scrWdtTo(scrWdtEnum.MD)) {
        this.$refs.pgLayoutComp.showRightBar(false)
      }
      this.activeChatIndex = index
    },
  },
  inject:['socket'],
   async mounted() {
     this.$store.commit('resetChatState')
     this.activeReqChatWParams(this.reqChatId)
     this.liveChatListen()
     await  this.getChatData()
     await this.joinRoom(this.roomChat)
     await this.activeChatBox()
  },
  watch: {
    requestChat() {
      // this.activeChatIndex = 0
    },
    activeChatIndex()
    {
      this.activeChatBox()
    },
    reqChatId(newVal) {
      if (this.role === Roles.Sales) {
        this.activeReqChatWParams(newVal)
      }
    },
  }
}
</script>

<style scoped>

.chat-view {
  height: 90%;
}
@media only screen and (max-width: 768px) {
  .chat-view {
    height: 80%;
  }
}

.chat-list-hover:hover {
  background-color: #F7F9FB;
  border-radius: 10px;
  color: #000;
}

.active-box {
  border-radius: 12px;
  background-color: #e3f5ff;
}
</style>
