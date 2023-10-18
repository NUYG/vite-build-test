<template>
  <div class="mt-4">
    <!--    <SearchUnit/>-->
  </div>
  <div class="chat-list overflow-scroll container-fluid">
    <div class="p-2" v-if="spDataList && spDataList.length">
      <div v-for="(data,index) in spDataList" :key="index">
        <ConversationsOverview class="p-2" v-if="data && data.chatData"
                               :userName="getUserName(data)"
                               :code="data.id" :lastMsg="getChatData(data)?.msg"
                               :lastMsgTime="getChatData(data).time"
                               :description="getDescription(data)" :rent="data.rent"
                               :activeBoxChat="checkIsActiveChat(data.id)"
                               @activeChatBox="activeChatBox"
                               :seen="getChatData(data).seen"
                               :is-req-chat="isReqChat"
                               :avtUser="getAvtData(data)"
                               :tt_unseen_msg="data?.chatData?.tt_unseen_msg"
        />
<!--        <div v-else class="p-5">-->
<!--          <span class="text-content text-gray fst-italic">Chưa có thông tin đoạn chat!</span>-->
<!--        </div>-->
      </div>
    </div>

  </div>

</template>

<script>
// import SearchUnit from "@/components/FpFilter/AgentFilter/LayoutResearch/SearchUnit.vue";
import ConversationsOverview from "@/components/FpConversation/ConversationsOverview.vue";
import {floatFixed} from "@/utils/utils";
import {getPjNameInPjData, unitPrice, uPricePfxExt} from "@/utils/unit";
import {Roles} from "@/utils/constants";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
// import {scrWdtEnum, scrWdtTo} from "@/utils/windowWidth";

export default {
  components: {
    // SearchUnit,
    ConversationsOverview
  },
  data() {
    return {
      activeTab: -1,
    }
  },

  methods: {
    getUserName(data) {
      if (data.agentData) {
        return data.agentData.first_name
      } else if (data.salesData) {
        return data.salesData.first_name
      }
    },
    getChatData(data) {
      const chat = {}
      if (data.chatData) {
        chat.msg = data.chatData?.sMsg?.short_msg
        chat.time = data.chatData?.sMsg?.init_time
        chat.seen = this.role === 'Sales' ? data.chatData.s_seen : data.chatData.a_seen
      }
      return chat
    },
    getDescription(data) {
      let price='' ;
      let pjName='' ;
      let status='' ;
      let cusName = ''
      let bedroom = ''
      if(!this.isReqChat)
      {
         price = convertVndToUserCurrency(unitPrice(data.rent, data.unitData),data.rent,UnitCurrency.simple)
         pjName = data.unitData.pjName ? data.unitData.pjName : data.unitData.pjData.name
         status = data.rent ? 'thuê' : 'bán'
         cusName= this.role===Roles.Sales ? data.cusData?.name : ''
         bedroom= data.unitData.bedroom
      }
      else {
        price = convertVndToUserCurrency(data.inquiryData.ceilingPrice,data?.rent,UnitCurrency.simple)
        pjName = getPjNameInPjData(data.inquiryData.pjData)
        status = data?.rent ? 'thuê' : 'bán'
        bedroom = data.inquiryData.bedroom
        cusName = data.inquiryData?.cusData?.name
      }
      return `${cusName} ${status} ${pjName} ${bedroom>0 ? bedroom + 'PN' : ''} ${price}`
    },
    checkIsActiveChat(data) {
      if (this.spDataList && this.activeTab === -1) {
        this.activeTab = this.spDataList[0].id
      }
      return data === this.activeTab
    },
    activeChatBox(id) {
      this.activeTab = id
      this.$emit('activeChatBox', id,this.isReqChat)
    },
    getAvtData(data)
    {
      return this.role===Roles.Sales ? data.agentData?.extData[0] : data.salesData?.extData[0]
    }
  },
  props: {
    spDataList: {
      type: Array,
      default: () => []
    },
    newNotification: {
      type: String,
    },
    role: {
      type: String
    },
    isReqChat:{
      type:Boolean,
      default:false
    },
    activeTabDefault:{
      type:Number,
    }
  },
  emits: ['activeChatBox'],
  mounted(){
    if(this.activeTabDefault)
    {
      this.activeTab=this.activeTabDefault
    }
  },
  watch: {
    activeTabDefault(newVal)
    {
      this.activeTab=newVal
    }
  },
}
</script>

<style>

.chat-list {
  height: 70vh;
}
</style>
