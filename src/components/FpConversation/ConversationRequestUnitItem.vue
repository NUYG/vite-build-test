<template>
  <div class="conversation-height position-relative">
    <div class="p-3 h-100 overflow-scroll" ref="messageContainer" @scroll="onScrollChat">
      <template v-if="allChat?.length || sendingMsgs.length">
        <div v-for="(mes, index) in allChat" :key="index" class="mt-2 d-flex flex-wrap justify-content-center"
             ref="requestChat">
          <div v-if="showChatTime(index)" :class="index !== 0 ? 'mt-3' : ''" class="mb-2 col-12 p-0 m-0">
            <div class="d-flex flex-wrap justify-content-between">
              <div class=" col">
                <span class="text-small"></span>
              </div>
              <div class="col-auto">
                <span class="text-small px-2">{{ getChatTime(mes.init_time) }}</span>
              </div>
              <div class="col">
                <span class="text-small"></span>
              </div>
            </div>
          </div>
          <div class="col-12 p-0 m-0" @mouseover="onShowChatTooltip(index)" @mouseleave="handlerChat=-1">
            <div class="d-flex flex-wrap justify-content-between">
              <div class="friend-chat border8 p-2 col-lg-6 col-10"
                   :class="{'user-chat order-2':role===mes.role}">

                <div class="col-12 p-0 m-0 m  t-2" v-if="checkChatType(mes)==='img'" @mouseover="onShowChatTooltip(index)"
                     @mouseleave="handlerChat=-1">
                  <div class="d-flex flex-wrap justify-content-between">
                    <div class="friend-chat border8 p-2 "
                         :class="{'user-chat order-2':role===mes.role}">
                      <div v-if="mes?.extData?.imgList && Array.isArray(mes?.extData?.imgList)" class="dynamic-image-grid" @click="slideShowImgList = mes?.extData?.imgList">
                        <div v-for="(url, mesIndex) in mes?.extData?.imgList.slice(0,5)" :key="mesIndex" class="dynamic-image-item" :class="{'lastImg': (mesIndex === 4 && mes?.extData?.imgList.length > 5)}">
                          <img :src="IMG_URL() + url.imgName" alt="img msg"  style="width: 100%; height: 100%; object-fit: cover;border-radius: 8px" />
                          <span class="position-absolute top-50 start-50 text-white" v-if="mesIndex === 4">
                          <span v-if="(mes?.extData?.imgList.length - 5) > 0">
                             {{mes?.extData?.imgList.length - 5}}+
                          </span>
                        </span>
                        </div>
                      </div>
                      <div v-if="mes?.extData?.imgName">
                        <img :src="IMG_URL() + mes?.extData?.imgName" alt="img msg" class="w-100"/>
                      </div>
                      <SlideShow :imgs="slideShowImgList.map((item) => item.imgName)" :key="index" v-if="slideShowImgList.length>0" @close="slideShowImgList=[]"></SlideShow>


                    </div>
                  </div>
                </div>

                <!--              region:  unit message -->
                <div class="text-content p-3" v-if="checkChatType(mes) ==='unit'">
                  <div class="text-content">
                    <FpProposalUnitTag :unit-data="getUnitByID(mes?.extData?.unitID)" :in-chat="true"
                                       :is-sales="isSales" :renting="requestData?.rent"
                                       :canDirectUnitDetail="checkAvailableUnit(getUnitByID(mes.extData.unitID))"
                    ></FpProposalUnitTag>
                  </div>
                  <div class="row mt-3" v-if=" role!==Roles.Manager && (checkAvailableUnit(getUnitByID(mes.extData.unitID)))">
                  <span class="col-auto ps-0">
                    <FpIcon v-show="favIcon(mes.extData.unitID)" :src-icon="favIcon(mes.extData.unitID)" :size="24"
                            @click="onUnitFavClick(mes.extData.unitID)"></FpIcon>
                  </span>
                    <span class="col-auto ps-0" v-if="isSales">
                    <FpIcon :src-icon="cartIcon(getUnitByID(mes.extData.unitID))"
                            :size="24" @click="handleUnitToPairArchive(getUnitByID(mes.extData.unitID))"></FpIcon>
                  </span>
                    <span class="col-auto ps-0" @click="onCreateSp(getUnitByID(mes.extData.unitID))"
                          v-if="!checkUnitCreatedSp(getUnitByID(mes.extData.unitID))">
                    <FpIcon src-icon="Handshake.svg" :size="24"></FpIcon>
                  </span>
                    <span class="col-auto ps-0">
                    <FpIcon src-icon="ShareNetwork.svg" :size="24"
                            @click="onShareClick(getUnitByID(mes.extData.unitID))"></FpIcon>
                  </span>
                  </div>
                  <p v-if="isSales && !(checkAvailableUnit(getUnitByID(mes.extData.unitID)))" class="mt-2 sell-text">
                    {{ inqRent ? 'Đã cho thuê' : 'Đã bán' }}</p>
                </div>
                <!--                end region-->

                <span class="text-content" v-if="checkChatType(mes)==='textMsg'">{{ mes.msg }} </span>
                <!--                <FpChatHandlerTooltip :id="index" :is-user-name="role===mes.role" @remove-chat="removeChat"-->
                <!--                                      v-if="handlerChat===index"-->
                <!--                ></FpChatHandlerTooltip>-->

              </div>
              <div class="col d-flex align-items-center "
                   :class="{'order-1 justify-content-end':role===mes.role}">
              </div>
            </div>
          </div>
        </div>

        <div v-for="(mes, index) in sendingMsgs" :key="index" class="mt-2 d-flex flex-wrap justify-content-center">
          <div v-if="mes.status !== sendingMsgStatus.OK" class="col-12 p-0 m-0">
            <div class="d-flex flex-wrap justify-content-between">
              <div  class="friend-chat border8 p-2 col-6"
                   :class="{'user-chat order-2':role===mes.role}">
                <span class="text-content "> {{
                    mes.status === sendingMsgStatus.ERROR ? 'Gửi tin nhắn không thành công!! ' : ''
                  }}{{ mes.message }} </span>
              </div>
              <div class="col d-flex align-items-center "
                   :class="{'order-1 justify-content-end':role===mes.role}">
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="d-flex justify-content-center align-items-center w-100 h-100">
        <FpIcon src-icon="blankmessage.png" :size="200"></FpIcon>
      </div>

    </div>
    <div v-if="popGoEndChat"
         class="w-100 position-absolute bottom-0 more-bg cursor-pointer"
         style="height: 5%" @click="goToEndChatNow">
      <div class="d-flex justify-content-between row px-3 text-white ">
        <span class="col-auto small">Bạn đang xem tin nhắn cũ </span>
        <span class="col-auto small">Nhảy đến hiện tại</span>
      </div>
    </div>
  </div>
  <TextNotification v-if='copy_notification' :message='toastMsg' @close='removeNotifications'/>
  <PopupTemplate v-if="confirmCreatedSp" @close-popup="confirmCreatedSp=false" popup-class="border8">
    <template #contentPopup>
      <div class="row  d-flex justify-content-center ">
        <span class="col-8 text-center text-title">{{ confirmCreateSpText }}</span>
      </div>
      <div class="row d-flex justify-content-center mt-3">
        <ButtonView content="Hủy bỏ" class="col-auto me-4" status="gray-btn"
                    @click="confirmCreatedSp=false"></ButtonView>
        <ButtonView content="Xác nhận" class="col-auto" status="gray-btn" @click="createSp"></ButtonView>
      </div>
    </template>
  </PopupTemplate>
</template>

<script>
import {getFullDateTime, getTime, minutesApart, sameDay} from "@/utils/dateTimeUtils";
import {sendingMsgStatus} from "@/utils/chatConstants";
import FpProposalUnitTag from "@/components/FpCard/FpProposalUnitTag.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {favObj, favObjAPI} from "@/utils/favAPI";
import {salesCreateSp, shareContent} from "@/utils/unit";
import {copyTextToClipboard, mobileShare} from "@/utils/utils";
import {VIEW, POINTING} from "@/utils/TransContent";
import TextNotification from "@/components/Misc/TextNotification.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {mapActions, mapGetters} from 'vuex';
import PopupTemplate from "@/components/FpPopup/PopupTemplate.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import FpChatHandlerTooltip from "@/components/FpTooltip/FpChatHandlerTooltip.vue";
import {IMG_URL, Roles} from "@/utils/constants";
import {post} from "@/utils/dataQuery";
import {end} from "@popperjs/core";
import SlideShow from "@/components/FpImg/SlideShow.vue";

export default {
  components: {
    SlideShow,
    FpChatHandlerTooltip,
    PopupTemplate,
    TextNotification,
    FpIcon,
    FpProposalUnitTag,
    ButtonView
  },
  data() {
    return {
      sendingMsgStatus,
      VIEW,
      POINTING,
      copy_notification: false,
      confirmCreatedSp: false,
      confirmCreateSpText: '',
      unitPicked: {},
      toastMsg: '',
      handlerChat: -1,
      popGoEndChat: true,
      slideShowImgList: []
    }
  },
  props: {
    messages: {
      type: Array,
      default: () => ([])
    },
    sendingMsgs: {
      type: Array,
      default: () => ([])
    },
    username: {
      type: String,
      default: ''
    },
    widthLineChat: {
      type: Number,
    },
    unitMsgData: {
      type: Array,
      default: () => []
    },
    role: {
      type: String
    },
    requestData: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    isSales() {
      return this.role === Roles.Sales
    },
    Roles() {
      return Roles
    },
    wLineChat() {
      return this.widthLineChat ? `width:${this.widthLineChat}%` : 'width:50%'
    },
    ...mapGetters(['getCardsByInqId']),
    getCartItems() {
      return this.getCardsByInqId(this.requestData?.inquiryData?.id);
    },
    inqRent() {
      return this.requestData?.rent
    },
    allChat()
    {
      return this.messages?.seen_msgs?.concat(this.messages?.unseen_msgs)
    }
  },
  emits: ['removeChat'],
  methods: {
    IMG_URL() {
      return IMG_URL
    },
    checkUnitCreatedSp(unit) {
      return this.requestData?.pairedUnits?.includes(unit?.id)
    },
    salesCreateSp,
    isUserName(name) {
      return this.username === name
    },
    checkChatType(mes) {
      if (mes?.extData?.chatType) {
        return mes?.extData?.chatType
      } else {
        return 'textMsg'
      }
    },
    getTime,
    getFullDateTime,
    sameDay,
    favObjAPI,
    onShowChatTooltip(index) {
      this.handlerChat = index
    },
    removeChat(index) {
      this.$emit('removeChat', index)
    },
    openHandlerChatTooltip(index) {
      this.handlerChat = this.handlerChat === index ? -1 : index
    },
    favIcon(unitID) {
      const unit = this.getUnitByID(unitID)
      if (unit) {
        return unit.fav ? 'Heart-red.svg' : 'Heart.svg'
      }
    },
    async onUnitFavClick(unitID) {
      const unit = this.getUnitByID(unitID)
      this.getUnitByID(unitID).fav = !unit.fav
      const favSucceed = await favObjAPI(favObj.UNIT, unitID, this.getUnitByID(unitID).fav);
    },
    onShareClick(unit) {
      if (scrWdtFrom(scrWdtEnum.MD)) {
        this.copyUnitContent(this.requestData.rent, unit)
      } else {
        return mobileShare(unit.imgs.map((item) => item.wm_url), this.getShareContent(this.requestData.rent, unit));
      }
    },
    removeNotifications() {
      this.copy_notification = false
    },
    getShareContent(rent, unit) {
      return shareContent(
          rent, unit, this.FURNITURE, this.VIEW, this.POINTING
      )
    },
    copyUnitContent(rent, unit) {
      copyTextToClipboard(this.getShareContent(rent, unit));
      this.copy_notification = true
      this.toastMsg = 'Đã sao chép!'
    },
    showChatTime(curId) {
      return curId <= 0 || minutesApart(
          this.allChat[curId].init_time, this.allChat[curId - 1].init_time, 20
      )
    },
    getChatTime(time) {
      if (!sameDay(time, new Date())) {
        return getFullDateTime(time);
      }
      return getTime(time);
    },
    async sendSeenMsgToSever(id) {
      if(id)
      {
        const res = await post('/u_request/request_msgs_seen', {id: id})
      }
    },
    async goToEndChatNow() {
      const chatBox = this.$refs.messageContainer
      chatBox.scrollTo({
        top: chatBox.scrollHeight + 700,
      })
      this.popGoEndChat = false
      await this.sendSeenMsgToSever(this.requestData?.urID)
    },
    getUnitByID(id) {
      return this.unitMsgData?.filter(unit => unit.id === id)[0]
    },
    checkUnitArchived(unit) {
      if (unit?.id) {
        console.log('archived unit',unit)
        return this.getCartItems.some(item => item.id === unit.id)
      }
    },
    handleUnitToPairArchive(unit) {
      if (this.checkUnitArchived(unit)) {
        this.removeFromCart(unit)
      } else {
        this.addToCart({...unit})
      }
    },
    ...mapActions(['addCardToCart', 'removeCardFromCart']),
    addToCart(card) {
      this.addCardToCart({card, inqId: this.requestData?.inquiryData?.id});
    },
    removeFromCart(card) {
      this.removeCardFromCart({card, inqId: this.requestData?.inquiryData?.id});
    },
    cartIcon(unit) {
      return this.checkUnitArchived(unit) ? 'ShoppingCartBlack.svg' : 'ShoppingCart.svg'
    },
    onCreateSp(unit) {
      this.confirmCreatedSp = true
      this.confirmCreateSpText = `Bạn vừa ghép với khách ${this.requestData?.inquiryData?.cusData?.name}, bạn xác nhận tiếp tục ghép khách này không?`
      this.unitPicked = unit
    },
    async createSp() {
      const res = await salesCreateSp(this.requestData?.inquiryData?.id, this.unitPicked?.id, {requestId: this.requestData?.urID}, !this.isSales)
      if (res.succeed) {
        this.copy_notification = true
        this.toastMsg = 'Tạo tiến trình thành công!'
      } else {
        this.copy_notification = true
        this.toastMsg = 'Tạo tiến trình thất bại!'
      }
      this.confirmCreatedSp = false
    },
    checkAvailableUnit(unit) {
      if (unit && this.inqRent) {
        return unit.rent_available
      } else if (unit && !this.inqRent) {
        return unit.sell_available
      }
    },
    goToLastSeenMsg()
    {
      if(this.seenMsgLength < this.allChat?.length){
        this.popGoEndChat = true
        const messageContainer = this.$refs.messageContainer;
        const lastSeenMsgIndex = this.seenMsgLength - 1  ;

        if (messageContainer && lastSeenMsgIndex >= 0) {
          const lastSeenMsgElement = this.$refs[`requestChat`][lastSeenMsgIndex];

          if (lastSeenMsgElement) {
            const containerHeight = messageContainer.clientHeight;
            const lastMsgHeight = lastSeenMsgElement.clientHeight;
            messageContainer.scrollTop = lastSeenMsgElement.offsetTop + lastMsgHeight - containerHeight;
          }
        }
      }
      else {
        this.popGoEndChat = false
        this.goToEndChatNow()
      }
    },
    async handleMsgContainerScroll(position) {
      const messageContainer = this.$refs.messageContainer;
      if (messageContainer) {
        messageContainer.scrollTop =  position;
      }
    },
    onScrollChat(event) {
      const isEndChat = event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight
      if (isEndChat) {
        this.sendSeenMsgToSever(this.requestData?.urID)
        this.popGoEndChat = false
      }
    }
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.goToLastSeenMsg()
      })
    },
    sendingMsgs: {
      handler() {
        this.goToEndChatNow()
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.goToLastSeenMsg()
    })
  }
}
</script>

<style scoped>


.friend-chat {
  background-color: #F7F9FB;
  border-radius: 16px 16px 16px 0;
  word-break: break-word
}

.user-chat {
  background-color: #E3F5FF;
  border-radius: 16px 16px 0 16px;
}

.conversation-height {
  //height: 78%;
  height: 100%;
  /*padding-bottom: 30px;*/
}
.dynamic-image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.dynamic-image-item {
  flex: 1;
}
.lastImg img{
  filter: brightness(50%);
}

</style>
