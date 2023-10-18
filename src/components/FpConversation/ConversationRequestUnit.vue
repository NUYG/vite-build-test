<template>
  <div class="h-100">
    <ConversationHeader :partner="partner" v-if="partner" class="w-100 " :desc-direct="detailPageDirect.cusDetail"
                        :isReqChat="true">
      <template #iconExt v-if="role===Roles.Agent">
        <ButtonView status="no-bg-btn" :btnIcon="getIconUrl('Storefront.svg')" :iconSize="24" @click="openPickUnitMsg"/>
      </template>
      <template #rightIcon v-if="role!==Roles.Sales">
        <FpDropDown :box-shadow="true" :show-dropdown-icon="false">
          <template #modalClick>
            <FpIcon src-icon="DotsThreeVertical.svg" :size="24" class=""></FpIcon>
          </template>
          <template #dropContent>
            <div class="sidebar-menu_item p-2" @click="callToNumber(partner?.phone)">Gọi</div>
            <div class="sidebar-menu_item p-2" @click="onZaloDirect(partner?.phone)">Đến zalo</div>
            <div class="sidebar-menu_item p-2" @click="onCancelRequest">Dừng hổ trợ</div>
          </template>
        </FpDropDown>
      </template>
    </ConversationHeader>

    <FpDragOpacityLayout drag-box-class="h-75">
      <template #floatContent>
        <div class="h-100 w-100  justify-content-center align-items-center">
          <div class="w-100 h-100 text-white" style="background:  rgba(0, 0, 0, 0.3)">
            <ImgDropZone @file-uploaded="onImgUpload" @finish-upload="submitInputFile" rule-text-class="text-white" content-class="text-white"
                         text-content="Thả vào đây nếu bạn muốn gửi ảnh ngay"></ImgDropZone>
          </div>
          <div class="mt-2 text-white" style="background: rgba(0, 0, 0, 0.3)">
            <ImgDropZone @file-uploaded="onReviewUpload" rule-text-class="text-white text-content" content-class="text-white text-content"
                         text-content="Thả vào đây nếu bạn muốn xem trước khi gửi"
            ></ImgDropZone>
          </div>
        </div>
      </template>
      <template #defaultContent>
        <ConversationRequestUnitItem :messages="messages" :sendingMsgs="sendingMsgs" :username="userName"
                                     :partner="partner"
                                     @remove-chat="deleteMessage"
                                     :widthLineChat="widthLineChat" :unitMsgData="unitMsgData || []"
                                     :role="role" :request-data="requestChat"/>
        <div class="px-3 w-100">
          <div class="row" v-if="(imgList.length > 0) && previewImg">
            <ImgPreviewHandler removeTarget="name" target-url="dataUrl" after-src-url="" :img-data="imgList.slice(0,5)"
                               @new-arr-img="onPreviewListChange"></ImgPreviewHandler>
          </div>
          <FpInputChat @input-chat-blur="scrollToTop" @input-chat-click="onInputClick" @input-chat-submit="handleSubmit"
                       :id="objId" @chat-img-content="sendingImgChat" ref="inputChat"
                       :disable-input="disableInput" :preview-data="imgList">
          </FpInputChat>
        </div>
      </template>
    </FpDragOpacityLayout>
  </div>

</template>

<script>
import {post} from "@/utils/dataQuery";
import {db} from '@/utils/firebaseConfig';
import {onSnapshot, getDoc, doc, updateDoc, arrayUnion, setDoc} from 'firebase/firestore';
import ConversationRequestUnitItem from "@/components/FpConversation/ConversationRequestUnitItem.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {callToNumber, getIconUrl, goZaloWebWithPhoneNumbInDesktop, goZaloWebWithPhoneNumbInMobile} from "@/utils/utils";
import {IMG_URL, Roles} from "@/utils/constants";
import ChatManager, {getCollectionNameByEnv} from "@/utils/conversationsLib";
import ConversationHeader from "@/components/FpConversation/FpChatInformation.vue";
import {detailPageDirect, sendingMsgStatus} from "@/utils/chatConstants";
import {URequestSttEnum} from "@/models/unitRequest";
import FpInputChat from "@/components/FpInput/FpInputChat.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import PopupTemplate from "@/components/FpPopup/PopupTemplate.vue";
import FpDropDown from "@/components/FpPopup/FpDropDown.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import FpDragOpacityLayout from "@/components/DragDrop/FpDragOpacityLayout.vue";
import ImgDropZone from "@/components/FpImg/ImgDropZone.vue";
import ImgPreviewHandler from "@/components/FpImg/ImgPreviewHandler.vue";

const chatManager = new ChatManager(getCollectionNameByEnv());

export default {
  components: {
    ImgPreviewHandler,
    ImgDropZone,
    FpDragOpacityLayout,
    FpDropDown,
    PopupTemplate,
    FpIcon,
    FpInputChat,
    ConversationRequestUnitItem,
    ButtonView,
    ConversationHeader
  },
  data() {
    return {
      db,
      messages: [],
      sendingMsgs: [], //normal msg data + status: 'sendingMsgStatus' enum
      inputData: '',
      userName: '',
      sendLocking: false,
      IMG_URL,
      isFirstSnapshot: true,
      chatManager,
      imgList: [],
      previewImg: false
    }
  },
  props: {
    documentName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true
    },
    partner: {
      type: Object,
      default: () => {
      }
    },
    objId: {
      type: Number,
    },
    widthLineChat: {
      type: Number,
    },
    unitRepo: {
      type: Array,
      default: () => []
    },
    requestData: {
      type: Object,
      default: () => {
      }
    },
  },
  computed: {
    detailPageDirect() {
      return detailPageDirect
    },
    URequestSttEnum() {
      return URequestSttEnum
    },
    Roles() {
      return Roles
    },
    unitMsgData() {
      return this.unitRepo
    },
    requestChat() {
      return this.requestData
    },
    disableInput() {
      return this.role === Roles.Manager ||
          this.requestData?.status === URequestSttEnum.CANCELED ||
          this.requestData?.status === URequestSttEnum.DONE
    }
  },
  methods: {
    callToNumber,
    getIconUrl,
    getCollectionNameByEnv,
    handleSubmit(inputVal) {
      // syntax to proposal unit in to request chat
      if (inputVal.startsWith("@canho") && this.role === Roles.Agent) {
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
          this.sendMessage(this.documentName, inputVal, this.userName)
        }
      }
    },
    async deleteMessage(index) {
      try {
        await this.chatManager.deleteMessageInConversation(
            this.documentName,
            index
        );
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    },
    async getUnitWithSyntax(projectCode, block, floor, unit) {
      const res = await post('/unit/u_request_get_unit_from_code', {
        pjCode: projectCode,
        block: block || '',
        floor: floor,
        unit: unit,
        id: this.objId
      })
      if (res) {
        this.unitRepo.push(res.returnData)
        this.sendUnitMsg(res.returnData?.id)
      }
    },
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
    sendUnitMsg(unitID) {
      const extData = {
        unitID: unitID,
        chatType: 'unit'
      }
      this.sendMessage(this.documentName, 'unitMsg', this.userName, extData)
    },
    sendingImgChat(imgListData) {
      console.log(imgListData,'khúc này submit xong và lên lại r')
      if (imgListData.length > 0) {
        const extData = {
          imgList: imgListData,
          chatType: 'img'
        }
        this.sendMessage(this.documentName, 'Hình ảnh', this.userName, extData)
        this.imgList = []
      }
    },
    async senderName() {
      const res = await post('/fp_user/get_detail_data', {})
      this.userName = res.returnData.first_name
      this.userName = this.userName ? this.userName : this.role

    },
    async sendMessage(conversationName, message, senderName, extData) {
      if (message && !this.sendLocking) {
        this.inputData = ''
        this.sendLocking = true

        const newMessage = {
          firebaseId: (this.messages?.length || 0) + 1,
          extData: extData ? {...extData} : null,
          message: message,
          senderName: senderName,
          time: new Date().toISOString()

        };
        let sendingMsg = {
          ...newMessage,
          status: sendingMsgStatus.PENDING,
        }
        this.sendingMsgs.push(sendingMsg);
        await this.sendMessageToSever(newMessage);

        try {
          await this.chatManager.sendMessage(
              this.documentName,
              newMessage
          )
          sendingMsg.status = sendingMsgStatus.OK;
        } catch (e) {
          console.error("Error sending message: ", e);
          sendingMsg.status = sendingMsgStatus.ERROR;
        }
        this.sendLocking = false;
      }
    },
    clearSendingMsg() {
      let i = this.sendingMsgs.length;
      while (i--) {
        if (this.sendingMsgs[i].status !== sendingMsgStatus.ERROR) {
          this.sendingMsgs.splice(i, 1);
        }
      }
    },
    async refreshMsg() {
      await this.loadMsgData(this.documentName);
    },
    async loadMsgData(conversationsName) {
      const conversationRef = doc(db, this.getCollectionNameByEnv(), conversationsName);
      const docSnap = await getDoc(conversationRef);
      if (conversationsName === this.documentName) {
        this.clearSendingMsg();
      } else {
        this.sendingMsgs.length = 0; //empty sendingMsgs array
      }
      if (docSnap.exists()) {
        this.messages = docSnap.data().messages;
      } else {
        this.messages = [];
        console.log("No such document!");
      }

    },
    updateChatWindow(msgs, chatName) {
      if (chatName === this.documentName) {
        // if the updated chat is the current open chat
        this.clearSendingMsg();
        this.messages = msgs;
      }
      // this.$emit('refreshRBData');
      // console.log('tin nhan toi', msgs, ' thuoc chat #', chatName);
    },
    async listenToCollection(conversationsName) {
      if (conversationsName) {
        const conversationRef = doc(db, this.getCollectionNameByEnv(), conversationsName);
        const docSnap = await getDoc(conversationRef)
        if (docSnap.exists()) {
          // console.log(docSnap.data(), 'snap snap snap');
        } else {
          this.messages = [];
          console.log("No such document!");
        }
        onSnapshot(conversationRef, (doc) => {
          // console.log(doc.data(), ' doc data')
          if (doc.data()) {
            // console.log(doc.data(), ' doc data')
            this.updateChatWindow(doc.data().messages, conversationsName)
          }
        });
      }
    },
    openPickUnitMsg() {
      this.$emit('openPickUnitMsg')
    },
    async sendMessageToSever(msg) {
      await post('/u_request/request_msg_sent', {
        id: this.objId,
        role: this.role,
        msg: msg
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
    async onCancelRequest() {
      if (this.requestData?.id) {
        const res = await post('/u_request/u_request_cancel', {
          id: this.requestData?.id
        })
        if (res.succeed) {
          window.alert('Hủy yêu cầu thành công')
          this.$router.back()
        }
      }
    },
    onZaloDirect(phoneNumb) {
      if (scrWdtFrom(scrWdtEnum.LG)) {
        goZaloWebWithPhoneNumbInDesktop(phoneNumb)
      } else {
        goZaloWebWithPhoneNumbInMobile(phoneNumb)
      }
    }
  },
  mounted() {
    this.listenToCollection(this.documentName);
    this.senderName()
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollToBottom)
    window.removeEventListener("scroll", this.scrollToTop)
  },
  emits: ['newMessage', 'openPickUnitMsg'],
  watch: {
    messages(newVal) {
      if (this.isFirstSnapshot) {
        this.isFirstSnapshot = false;
      } else {
        window.localStorage.setItem(`sp${this.objId}`, 'true');
        this.$emit('newMessage');
      }
    },
    documentName(newVal) {
      this.loadMsgData(newVal);
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
