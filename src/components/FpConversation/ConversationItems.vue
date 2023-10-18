<template>
  <div class="conversation-height">
          <div class="p-3 h-100 overflow-scroll" ref="messageContainer" @scroll="onScrollChat">
            <div v-for="(mes, index) in allChat" :key="index"  class="mt-2 d-flex flex-wrap justify-content-center" ref="chatIndex">
              <div v-if="showChatTime(index)" :class="index !== 0 ? 'mt-3' : ''" class="mb-2 col-12 p-0 m-0">
                <div class="d-flex flex-wrap justify-content-between">
                  <div class=" col">
                    <span class="text-small"></span>
                  </div>
                  <div class="col-auto">
                    <span class="text-small px-2">{{ getChatTime(mes.init_time) }}</span>
                  </div>
                  <div class=" col">
                    <span class="text-small"></span>
                  </div>
                </div>
              </div>
              <div class="col-12 p-0 m-0" @mouseover="onShowChatTooltip(index)" @mouseleave="handlerChat=-1">
                <div class="d-flex flex-wrap justify-content-between" v-if="checkChatType(mes)==='textMsg'">
                  <div class="friend-chat border8 p-2 position-relative"
                       :class="{'user-chat order-2':mes?.role === role}">
                    <span class="text-content">{{ mes?.msg }} </span>
      <!--              <FpChatHandlerTooltip :id="index" :is-user-name="isUserName(mes.senderName)" @remove-chat="removeChat"-->
      <!--                                    v-if="handlerChat===index"-->
      <!--              ></FpChatHandlerTooltip>-->
                  </div>
                  <div class="col d-flex align-items-center"
                       :class="{'order-1 justify-content-end':mes?.role === role}">
                  </div>
                </div>
              </div>
              <div class="col-12 p-0 m-0 mt-2" v-if="checkChatType(mes)==='img'" @mouseover="onShowChatTooltip(index)" @mouseleave="handlerChat=-1">
                <div class="d-flex flex-wrap justify-content-between">
                  <div style="width: 80%" class="friend-chat border8 p-2"
                       :class="{'user-chat order-2':mes?.role === role}">
                    <div v-if="mes?.extData?.imgList && Array.isArray(mes?.extData?.imgList)" class="dynamic-image-grid" @click="slideShowImgList = mes?.extData?.imgList">
                      <div v-for="(url, mesIndex) in mes?.extData?.imgList.slice(0,5)" :key="mesIndex" class="dynamic-image-item" :class="{'lastImg': (mesIndex === 4 && mes?.extData?.imgList.length > 5)}">
                        <img :src="IMG_URL() + url.imgName" alt="img msg"  style="width: 100%; height: 100%; object-fit: cover;border-radius: 8px" />
                        <span class="position-absolute text-white" v-if="mesIndex === 4" style="top:40%;left: 40%">
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
                  <div class="col d-flex align-items-center">
                  </div>
                </div>
              </div>
            </div>

            <div v-for="(mes, index) in sendingMsgs" :key="index" class="mt-2 d-flex flex-wrap justify-content-center">
              <div v-if="mes.status !== sendingMsgStatus.OK" class="col-12 p-0 m-0">
                <div class="d-flex flex-wrap justify-content-between">
                  <div :style="wLineChat" class="friend-chat border8 p-2"
                       :class="{'user-chat order-2':mes?.role === role}">
                    <span class="text-content "> {{
                        mes.status === sendingMsgStatus.ERROR ? 'Gửi tin nhắn không thành công!! ' : ''
                      }}{{ mes?.msg }} </span>
                  </div>
                  <div class="col d-flex align-items-center "
                       :class="{'order-1 justify-content-end':mes?.role === role}">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="popGoEndChat && !isEndChat()"
              class="w-100 position-absolute bottom-0 more-bg cursor-pointer"
               style="height: 5%;z-index: 10" @click="goToEndChatNow">
            <div class="d-flex justify-content-between row px-3 text-white ">
                <span class="col-auto small">Bạn đang xem tin nhắn cũ </span>
                <span class="col-auto small">Nhảy đến hiện tại</span>
            </div>
          </div>
  </div>
</template>

<script>
import {getFullDateTime, getTime, minutesApart, sameDay} from "@/utils/dateTimeUtils";
import {sendingMsgStatus} from "@/utils/chatConstants";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpChatHandlerTooltip from "@/components/FpTooltip/FpChatHandlerTooltip.vue";
import {IMG_URL, Roles} from "@/utils/constants";
import FpDragOpacityLayout from "@/components/DragDrop/FpDragOpacityLayout.vue";
import SlideShow from "@/components/FpImg/SlideShow.vue";
import {post} from "@/utils/dataQuery";

export default {
  components: {SlideShow, FpDragOpacityLayout, FpChatHandlerTooltip, FpIcon, UnitImg},
  data() {
    return {
      sendingMsgStatus,
      handlerChat: -1,
      scrollToIndex: null,
      popGoEndChat:true,
      slideShowImgList:[],
      itemWidth: 0,
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
    spId:{
      type:Number
    },
    role:{
      type:String,
      default:Roles.Sales
    },
    lastMsgSeen:Number,
    isSpChat:Boolean
  },
  computed: {
    wLineChat() {
      return this.widthLineChat ? `width:${this.widthLineChat}%` : 'width:50%'
    },
    allChat()
    {
      return this.messages?.seen_msgs?.concat(this.messages?.unseen_msgs)
    },
    seenMsgLength()
    {
      return this.messages?.seen_msgs?.length
    }
  },
  emits:['removeChat'],
  methods: {
    IMG_URL() {
      return IMG_URL
    },
    removeChat(index)
    {
      this.$emit('removeChat',index)
    },
    onShowChatTooltip(index)
    {
      this.handlerChat=index
    },
    isUserName(name) {
      return this.username === name
    },
    getTime,
    getFullDateTime,
    sameDay,
    showChatTime(curId) {
      return curId <= 0 || minutesApart(
          this.allChat[curId]?.init_time, this.allChat[curId - 1]?.init_time, 20
      )
    },
    getChatTime(time) {
      if (!sameDay(time, new Date())) {
        return getFullDateTime(time);
      }
      return getTime(time);
    },
    async sendLastSeenMsgIdToSever(id)
    {
      if(id)
      {
        const res = await post('/sale_process/sp_msgs_seen',{id})
      }
    },
    async goToEndChatNow()
    {
      const messageContainer = this.$refs.messageContainer;
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
      await this.sendLastSeenMsgIdToSever(this.spId)
      this.popGoEndChat = false
    },
   goToLastSeenMsg()
    {
      if(this.seenMsgLength < this.allChat?.length && this.seenMsgLength !== 0 ){
        this.popGoEndChat = true
        const messageContainer = this.$refs.messageContainer;
        const lastSeenMsgIndex = this.seenMsgLength - 1  ;
        if (messageContainer && lastSeenMsgIndex >= 0) {
          const lastSeenMsgElement = this.$refs[`chatIndex`][lastSeenMsgIndex];
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
    handleMsgContainerScroll(position)
    {
      const messageContainer = this.$refs.messageContainer;
      if (messageContainer) {
        console.log(position,'index chat')
        messageContainer.scrollTop =  position;
      }
    },
    checkChatType(mes)
    {
      if(mes?.extData?.chatType)
      {
        return mes?.extData?.chatType
      }
      else {
        return 'textMsg'
      }
    },
    onScrollChat(event) {
      const isEndChat = event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight
      if (isEndChat){
         this.sendLastSeenMsgIdToSever(this.spId)
         this.popGoEndChat = false
      }
    },
    isEndChat()
    {
      const boxChat  = this.$refs?.messageContainer
      return boxChat?.clientHeight >= boxChat?.scrollHeight
    }
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.goToLastSeenMsg()
      });
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
    });
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
  //height: 76%;
  height: 100%;
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
