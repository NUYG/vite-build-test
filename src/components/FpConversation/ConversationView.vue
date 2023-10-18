<template>
  <div class="h-100">
    <div class="border-bottom px-3">
      <ConversationHeader :partner="partner" v-if="partner" :hideInq="hideInq" :is-req-chat="isReqChat"
                          :desc-direct="detailPageDirect" :role="role" :is-last-msg-view="false">
        <template #iconExt>
          <slot name="iconExt"></slot>
        </template>
        <template #rightIcon>
          <slot name="rightIcon"></slot>
        </template>
      </ConversationHeader>
    </div>
    <FpDragOpacityLayout drag-box-class="h-100">
      <template #floatContent>
        <div class="h-100 w-100  justify-content-center align-items-center">
          <div class="w-100 h-100 text-white" style="background:  rgba(0, 0, 0, 0.3)">
            <ImgDropZone @file-uploaded="onImgUpload" @finish-upload="submitInputFile" rule-text-class="text-white"
                         content-class="text-white"
                         text-content="Thả vào đây nếu bạn muốn gửi ảnh ngay"></ImgDropZone>
          </div>
          <div class="mt-2 text-white" style="background: rgba(0, 0, 0, 0.3)">
            <ImgDropZone @file-uploaded="onReviewUpload" rule-text-class="text-white text-content"
                         content-class="text-white text-content"
                         text-content="Thả vào đây nếu bạn muốn xem trước khi gửi"
            ></ImgDropZone>
          </div>
        </div>
      </template>
      <template #defaultContent>
            <ConversationItems :messages="messages" :sendingMsgs="sendingMsgs" :username="userName" :partner="partner" :role="role"
                               :last-msg-seen="partner?.last_seen_msg" :sp-id="partner?.spId" :isSpChat="independent"
                               :widthLineChat="widthLineChat" @remove-chat="handlerRemoveChat" v-if="unitType===chatObjType.SALE_PROCESS"/>
            <ConversationRequestUnitItem :messages="messages" :sendingMsgs="sendingMsgs" :username="userName" v-else
                                         :partner="partner" :request-data="partner"
                                         :widthLineChat="widthLineChat" :unit-msg-data="unitChatRepo"
                                         :role="role" />
        <div class="px-3 w-100">
          <div class="row" v-if="(imgList.length > 0) && previewImg">
            <ImgPreviewHandler removeTarget="name" target-url="dataUrl" after-src-url="" :img-data="imgList"
                               @new-arr-img="onPreviewListChange" ></ImgPreviewHandler>
          </div>
          <FpInputChat @input-chat-blur="scrollToTop" ref="inputChat" :disableInput="role===Roles.Manager"
                       @input-chat-click="onInputClick" :preview-data="imgList"
                       @input-chat-submit="handleSubmit"
                       :id="roomId" @chat-img-content="sendingImgMsg">
          </FpInputChat>
        </div>
      </template>
    </FpDragOpacityLayout>
  </div>
</template>

<script>
import {post} from "@/utils/dataQuery";
import {db} from '@/utils/firebaseConfig';
import {onSnapshot, getDoc, doc, updateDoc, arrayUnion, setDoc} from 'firebase/firestore'
import ConversationItems from "@/components/FpConversation/ConversationItems.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl} from "@/utils/utils";
import {IMG_URL, Roles} from "@/utils/constants";
import ChatManager, {getCollectionNameByEnv} from "@/utils/conversationsLib";
import ConversationHeader from "@/components/FpConversation/FpChatInformation.vue";
import {detailPageDirect, sendingMsgStatus, SetChatDataEnum} from "@/utils/chatConstants";
import {chatObjType} from "@/models/fpChat";
import FpInputChat from "@/components/FpInput/FpInputChat.vue";
import FpDragOpacityLayout from "@/components/DragDrop/FpDragOpacityLayout.vue";
import ImgDropZone from "@/components/FpImg/ImgDropZone.vue";
import ImgPreviewHandler from "@/components/FpImg/ImgPreviewHandler.vue";
import SocketConnectHandler from "@/socketIO/chatListenSocket.vue";
import {state} from "@/main";
import {mapActions, mapGetters} from "vuex";
import ConversationRequestUnitItem from "@/components/FpConversation/ConversationRequestUnitItem.vue";
import LoadingAnimContainer from "@/components/FpAnimation/LoadingAnimContainer.vue";
const chatManager = new ChatManager(getCollectionNameByEnv());

const sendMsgEPs = {
  [chatObjType.SALE_PROCESS]: '/sale_process/sp_msg_sent',
  [chatObjType.UNIT_REQUEST]: '/u_request/request_msg_sent'
}

export default {
  components: {
    LoadingAnimContainer,
    ConversationRequestUnitItem,
    SocketConnectHandler,
    ImgPreviewHandler,
    ImgDropZone,
    FpDragOpacityLayout,
    FpInputChat,
    ConversationItems,
    ButtonView,
    ConversationHeader
  },
  data() {
    return {
      db,
      messages: [],
      sendingMsgs: [], //normal msg data + status: 'sendingMsgStatus' enum
      inputData: '',
      // userName: '',
      sendLocking: false,
      IMG_URL,
      isFirstSnapshot: true,
      chatManager,
      imgList: [],
      previewImg: false,
      finishLoading: false
      // userId: -1,
    }
  },
  props: {
    msgDefault:{
      type:Array,
      default: () => []
    },
    roomId: Number,
    role: {
      type: String,
      required: true
    },
    partner: {
      type: Object,
      default: () => {}
    },
    widthLineChat: {
      type: Number,
    },
    independent: {
      type: Boolean,
      default: true,
    },
    unitType: {
      type: String,
      default: chatObjType.SALE_PROCESS,
    },
    hideInq: {
      type: Boolean,
      default: false
    },
    isReqChat: {
      type: Boolean,
      default: false
    },
  },
  inject: ['socket'],
  computed: {
    Roles() {
      return Roles
    },
    chatObjType() {
      return chatObjType
    },
    ...mapGetters(['getChatDataById','getAllStore','getRequestChatData']),
    detailPageDirect() {
      return this.isReqChat ? detailPageDirect.cusDetail : detailPageDirect.spDetail
    },
    unitChatRepo()
    {
      return this.getRequestChatData?.find(item => item.id === this.roomId)?.unitData
    },
    sendMsgEP() {
      try {
        return sendMsgEPs[this.unitType];
      } catch (err) {
        return '';
      }
    },
    requestDataEP() {
      if (this.role === Roles.Sales) {
        return "/u_request/get_sales_u_request_data";
      } else if (this.role === Roles.Manager) {
        return '/u_request/get_manager_u_request_data'
      }
      return "/u_request/get_agent_u_request_data";
    },
    roomChat()
    {
      return this.unitType===chatObjType.SALE_PROCESS ? `sp${this.roomId}` : `ur${this.roomId}`
    },
    userName()
    {
      return this.getAllStore?.currentUserData?.first_name
    },
    userId(){
      return this.getAllStore?.currentUserData?.id
    },
    allChat()
    {
      return this.msgDefault
    }
  },
  methods: {
    ...mapActions(['setDefaultChatData']),
    onPreviewListChange(newArr) {
      this.imgList = newArr
    },
    onInputImgChange(val) {
      this.imgList.push(val)
    },
    async submitInputFile() {
      await this.$refs?.inputChat.handleSubmit()
    },
    onImgUpload(val) {
      this.onInputImgChange(val)
    },
    onReviewUpload(val) {
      this.onInputImgChange(val)
      this.previewImg = true
    },
    getIconUrl,
    getCollectionNameByEnv,
    async handlerRemoveChat(indexChat) {
      try {
        await this.chatManager.deleteMessageInConversation(
            this.documentName,
            indexChat
        );
        console.log('Message deleted successfully.');
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    },
    handleSubmit(inputVal) {
      // syntax to proposal unit in to request chat
      if (inputVal.startsWith("@canho") && this.role === Roles.Agent && this.unitType===chatObjType.UNIT_REQUEST) {
        const str = inputVal.slice(6);
        const splitFloorUnit = str.split('-')
        const floor = splitFloorUnit[1].split('.')[0]
        const unit = splitFloorUnit[1].split('.')[1]
        const splitBlock = splitFloorUnit[0].split('_')
        const block = splitBlock[1]
        const pjName = splitBlock[0]

        this.getUnitWithSyntax(pjName, block, floor, unit);
      } else {
        if (this.previewImg) {
          this.submitInputFile()
        } else {
          this.submitData(inputVal, this.userName)
        }
      }
    },
    async getUnitWithSyntax(projectCode, block, floor, unit) {
      const res = await post('/unit/u_request_get_unit_from_code', {
        pjCode: projectCode,
        block: block || '',
        floor: floor,
        unit: unit,
        id: this.roomId
      })
      if (res) {
        const unitData = res.returnData
        this.$store.commit('addUnitToRequestChatRepo',{ reqChatId: this.roomId, unitData: unitData})
        this.sendingUnitMsg(unitData?.id)
        console.log('data mới từ cú fap nò', res)
      }
    },
    sendingUnitMsg(unitID)
    {
      console.log(unitID,'unitID nhận vào')
      const extData =  {
        unitID: unitID,
        chatType: 'unit'
      }
      this.submitData('căn hộ đề xuất', this.userName, extData)
    },
    sendingImgMsg(imgListData) {
      if (imgListData.length > 0) {
        const extData = {
          imgList: imgListData,
          chatType: 'img'
        }
        this.submitData('Hình ảnh', this.userName, extData)
        this.imgList = []
      }
    },
    async senderName() {
      const res = await post('/fp_user/get_detail_data', {})
      if(res.returnData)
      {
        this.$store.commit('setCurrentUserData',res.returnData)
      }
    },
    async submitData(message, senderName, extData) {
      if (message) {
        this.inputData = ''
        this.sendLocking = true
        const newMessage = {
          msg:{
            msg: message,
            senderName: senderName,
            time: new Date().toISOString(),
            role: this.role,
            extData: {...extData},
          },
          role: this.role,
          chatId: this.partner?.chatData?.id,
          userId: this.userId,
          room: this.roomChat,
          id: this.roomId
        };
        this.sendNewMsg(newMessage)
      }
    },
    sendNewMsg(newData)
    {
      const env = this.isReqChat ? 'send_new_ur_msg' : 'send_new_sp_msg'
      console.log(newData,'Data gửi về env:', env)
      this.socket.emit(env, newData)
      this.socket.on('send_msg_success',args => {
        if(args)
        {
          console.log('SEVER TRẢ LÊN TỪ CHAT CON BÊN TRONG',args)
          this.addChatToStore(newData)
        }
        this.socket.off('send_msg_success')
      })
    },
    clearSendingMsg() {
      let i = this.sendingMsgs.length;
      while (i--) {
        if (this.sendingMsgs[i].status !== sendingMsgStatus.ERROR) {
          this.sendingMsgs.splice(i, 1);
        }
      }
    },
    addChatToStore(newData)
    {
      this.$store.commit('updateMsgData', {
        id: this.roomId,
        newMsgData: newData.msg,
        isRequestChat: this.unitType === chatObjType.UNIT_REQUEST
      })
    },
    onInputClick() {
      this.scrollToBottom()
    },
    scrollToBottom() {
      window.scrollTo(0, document.body.scrollHeight);
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    async getUnitRequests(urID) {
      console.log(urID,'gửi urID')
      if (urID > 0) {
        const res = await post(this.requestDataEP, {
          id: urID
        });
        console.log(res.returnData,'unit repo')
        this.$store.commit('setUnitRequestChatRepo', res.returnData)
      }
    },

  },
  mounted() {
    if(this.unitType === chatObjType.UNIT_REQUEST)
    {
      this.getUnitRequests(this.partner?.urID)
    }
    this.messages = this.msgDefault
    this.senderName()
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollToBottom)
    window.removeEventListener("scroll", this.scrollToTop)
  },
  emits: ['newMessage', 'refreshRBData'],
  watch: {
    partner(newVal)
    {
      if(newVal?.urID)
      {
        this.getUnitRequests(newVal.urID)
      }
    },
    msgDefault(newVal) {
      this.messages = newVal
    },
  }
}
</script>

<style scoped>

.form-chat {
  border-radius: 16px;
  background-color: #F7F7F7;
}

.input-chat {
  background-color: #F7F7F7 !important;
  width: 80% !important;
}

.input-chat:focus {
  outline: none;
  box-shadow: none;
}
</style>
