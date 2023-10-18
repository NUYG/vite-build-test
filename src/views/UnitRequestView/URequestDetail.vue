<template>
  <FpDefLayout
    :bc-props="pgMeta" @showRB="onShowRB"
    :rBWidth="4"
    @breadcrumb-back-icon="onBrcmBack"
    :main-vh100="true">

    <template #comp>
      <div class="container h-100">
              <div class="row" v-show="!isChat">
                <div class="col-12">
                  <div class="row mt-3 d-flex justify-content-center" >
                    <SearchUnit @search-val="onSearchValChange" class="col-auto"></SearchUnit>
                    <ButtonView status="more-btn" content="Tìm căn" class="col-auto" @click="onFilterUnit"></ButtonView>
                  </div>
                  <LoadingAnimContainer  :is-loading="!doneAvailUnitsLoad">
                    <template #content>
                  <div class="row mt-5" v-if="availUnits.length">
                    <div class='col-12 col-lg-4 mt-3' v-for="(data,index) in availUnits" :key="index">
                      <div class="card-gray-teal p-4 h-100">
                        <FpProposalUnitTag :unitData="data" :renting="requestData?.inquiryData?.rent"
                                           @proposal-unit="sendUnitMsg"></FpProposalUnitTag>
                      </div>
                    </div>
                  </div>
                    </template>
                  </LoadingAnimContainer>
                </div>
              </div>
        <div v-show="isChat" style="height: 85%">
          <ConversationView :role="role" :partner="partnerData" :is-req-chat="true" :room-id="requestData?.id" :msg-default="reqChatData?.msg_data"
                            :unit-type="chatObjType.UNIT_REQUEST" >
            <template #iconExt>
              <ButtonView status="no-bg-btn" :btnIcon="getIconUrl('Storefront.svg')" :iconSize="24" @click="onChangeView"/>
            </template>
            <template #rightIcon >
              <FpDropDown :box-shadow="true" :show-dropdown-icon="false">
                <template #modalClick>
                  <FpIcon src-icon="DotsThreeVertical.svg" :size="24" class=""></FpIcon>
                </template>
                <template #dropContent>
                  <div class="sidebar-menu_item p-2" @click="callToNumber(partnerData?.phone)">Gọi</div>
                  <div class="sidebar-menu_item p-2" @click="onZaloDirect(partnerData?.phone)">Đến zalo</div>
                  <div class="sidebar-menu_item p-2" @click="onCancelRequest">Dừng hổ trợ</div>
                </template>
              </FpDropDown>
            </template>
          </ConversationView>
        </div>
      </div>
    </template>
  </FpDefLayout>
</template>

<script>

import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import FpDefLayout from "@/views/FpDefLayout.vue";
import ConversationView from "@/components/FpConversation/ConversationView.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {Roles} from "@/utils/constants";
import {post} from "@/utils/dataQuery";
import {chatObjType} from "@/models/fpChat";
import SearchUnit from "@/components/FpFilter/AgentFilter/LayoutResearch/SearchUnit.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import ConversationRequestUnit from "@/components/FpConversation/ConversationRequestUnit.vue";
import FpProposalUnitTag from "@/components/FpCard/FpProposalUnitTag.vue";
import {getPjNameInPjData, getStatusTextByRent} from "@/utils/unit";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {convertVndToUserCurrency, UnitCurrency} from "@/models/currency";
import FpDropDown from "@/components/FpPopup/FpDropDown.vue";
import {callToNumber, getIconUrl, goZaloWebWithPhoneNumbInDesktop, goZaloWebWithPhoneNumbInMobile} from "@/utils/utils";
import {mapActions, mapGetters} from "vuex";
import {SetChatDataEnum} from "@/utils/chatConstants";
import LoadingAnimContainer from "@/components/FpAnimation/LoadingAnimContainer.vue";

export default {
  components: {
    LoadingAnimContainer,
    FpDropDown,
    FpProposalUnitTag,
    ConversationRequestUnit,
    SearchUnit,
    FpIcon,
    FpDefLayout,
    ConversationView,
    ButtonView
  },
  data() {
    return {
      // data
      requestData: {},
      newMessage: true,
      availUnits: [],
      // Meta
      pgMeta: {
        [breadcrumpProp.title]: '',
        [breadcrumpProp.enableRB]: false,
        [breadcrumpProp.rBIcon]: 'chatIcon.svg',
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal,
      },
      // other
      chatObjType,
      search: '',
      isChat: true,
      doneAvailUnitsLoad: false
    }
  },
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  computed: {
    Roles() {
      return Roles
    },
    ...mapGetters(['getRequestChatData','getAllStore']),
    requestID()
    {
      return this.$route?.params?.requestID
    },
    reqChatData()
    {
      return this.getRequestChatData.filter(item => item.id === parseInt(this.requestID))[0]?.chatData
    },
    partnerData() {
      if(this.requestData?.inquiryData)
      {
        return {
          name: this.requestData?.salesData?.first_name,
          phone: this.requestData?.salesData?.extData[0].phone,
          rent: this.requestData?.inquiryData?.rent ,
          extData: this.requestData?.salesData?.extData[0],
          pjName: getPjNameInPjData(this.requestData?.inquiryData?.pjData),
          gender: this.requestData?.salesData?.extData[0].gender,
          status: this.requestData?.inquiryData.rent ? 'thuê' : 'bán',
          cusData: this.requestData?.inquiryData?.cusData?.name,
          bedRoom: this.requestData?.inquiryData.bedroom,
          urID: parseInt(this.requestID) ,
          chatData: this.reqChatData,
          inquiryData: this.requestData?.inquiryData,
          price: convertVndToUserCurrency(this.requestData.inquiryData.ceilingPrice,this.requestData?.inquiryData?.rent,UnitCurrency.simple),
        }
      }
    },
    isAgent() {
      return this.isRole(Roles.Agent);
    },
    isSales() {
      return this.isRole(Roles.Sales);
    },
    isManager() {
      return this.isRole(Roles.Manager);
    },
    requestDataEP() {
      if (this.isSales) {
        return "/u_request/get_sales_u_request_data";
      } else if (this.isManager) {
        return '/u_request/get_manager_u_request_data'
      }
      return "/u_request/get_agent_u_request_data";
    },
    requestChatDataEP() {
      if (this.isSales) {
        return "/u_request/get_sales_u_request_chat_data";
      } else if (this.isManager) {
        return '/u_request/get_agent_u_request_chat_data'
      }
      return "/u_request/get_agent_u_request_chat_data ";
    },
    wLineChat() {
      return scrWdtFrom(scrWdtEnum.MD) ? 40 : 90
    },
    currentUserData()
    {
      return this.getAllStore?.currentUserData
    }
  },
  methods: {
    callToNumber,
    getIconUrl,
    async onChangeView()
    {
      this.isChat = false
      await this.getAvailUnitData();
      this.doneAvailUnitsLoad = true
    },
    onBrcmBack() {
      if (!this.isChat) {
        return this.isChat = true
      } else {
        this.$router.back()
      }
    },
    onZaloDirect(phoneNumb) {
      if (scrWdtFrom(scrWdtEnum.LG)) {
        goZaloWebWithPhoneNumbInDesktop(phoneNumb)
      } else {
        goZaloWebWithPhoneNumbInMobile(phoneNumb)
      }
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
    isRole(role) {
      return this.role === role;
    },
    onShowRB(showRB) {
      this.newMessage = showRB
      this.brcIconMsg()
    },
    brcIconMsg() {
      if (this.newMessage) {
        window.localStorage.removeItem(`uRequest${this.requestID}`)
        this.pgMeta[breadcrumpProp.rBIcon] = 'chatIcon.svg'
      }
      return ''
    },
    sendUnitMsg(id) {
      console.log(id,'chạy')
      const newMessage = {
        msg:{
          msg:'căn hộ đề xuất',
          time: new Date().toISOString(),
          role: this.role,
          extData : {
            unitID: id,
            chatType: 'unit'
          },
        },
        role: this.role,
        chatId: this.getRequestChatData[0]?.chatData?.id,
        userId: this.currentUserData?.id,
        room:`ur${this.requestID}`,
        id: parseInt(this.requestID)
      };
      console.log('gửi về sever',newMessage)
      this.socket.emit('send_new_ur_msg', newMessage)
      this.socket.on('send_msg_success',args => {
        if(args)
        {
          console.log('SEVER TRẢ LÊN từ UREQUEST',args)
          this.$store.commit('updateMsgData',{id: parseInt(this.requestID), newMsgData: newMessage.msg ,isRequestChat: true})
          this.updateClientUnit(id)
        }
        this.socket.off('send_msg_success')
      })

      this.isChat = true
    },
    updateClientUnit(id){
      this.addUnit(id)
      this.migrateAvailUnitToRequestUnit(id)
    },
    addChatToStore(newData)
    {
      this.$store.commit('updateMsgData', {
        id: this.roomId,
        newMsgData: newData.msg,
        isRequestChat: this.unitType === chatObjType.UNIT_REQUEST
      })
    },
    migrateAvailUnitToRequestUnit(id) {
      const index = this.availUnits.findIndex(obj => obj.id === id);
      if (index !== -1) {
        this.$store.commit('addUnitToRequestChatRepo',{
          reqChatId: parseInt(this.requestID),
          unitData: this.availUnits.splice(index, 1)[0]
        })
      }
    },
    newMsg() {
      const localMsg = window.localStorage.getItem(`uRequest${this.requestID}`)
      this.brcIconMsg()
      if (localMsg && !this.newMessage) {
        this.pgMeta[breadcrumpProp.rBIcon] = 'chatIcon-dot.svg'
      }
    },
    // APIs
    async getURequestPartData(endpoint, bodyData) {
      this.loadingItem = true;
      const res = await post(endpoint, bodyData);
      console.log(res,'res dataa')
      this.requestData = {...this.requestData, ...res.returnData};
      this.loadingItem = false;
    },
    async getURequestData() {
      await this.getURequestPartData(this.requestDataEP, {
        id: this.requestID,
      });
    },
    onSearchValChange(val) {
      this.search = val.searchVal
    },
    onFilterUnit() {
      this.getAvailUnitData()
    },
    async getAvailUnitData(){
      const res = await this.getAvailUnitDataAPI();
      this.availUnits = [...res['1'], ...res['2'], ...res['3'], ...res['4'], ...res['5']]
    },
    async getAvailUnitDataAPI() {
      const res = await post('/u_request/get_available_units_request', {
        id: this.requestID,
        // exIds: this.requestData.unitData.map(unit => unit.id),
        search: this.search
      })
      return res.returnData;
    },
    async addUnit(unitId) {
      const res = await post("/u_request/u_request_add_unit", {
        id: this.requestID,
        unitId: unitId,
      });
      if (res && res.succeed) {
        await this.getAvailUnitData()
      }
    },
    ...mapActions(['setDefaultChatData']),
    async getChatData() {
      const res = await post(this.requestChatDataEP, {
        id: this.requestID
      })
      console.log(res,'reqChatData')
      await this.setDefaultChatData({dataType: SetChatDataEnum.requestChat, newData: [res.returnData]})
      console.log('join room đi mà')
      await this.joinRoom()
    },
    async joinRoom()
    {
      console.log(`join_room ur${this.requestData?.id} nè`)
      await this.socket.emit('join_room',{emitEvent: true, room: `ur${this.requestID}`})
      this.socket.on('room_entered',arg => {
        console.log(arg,'đã oke r đó')
      })
    },
    listenNewChat()
    {
      this.socket.on('new_msg',arg => {
        console.log('SEVER TRẢ LÊN NÈ',arg)
        if(arg?.msg?.extData?.unitID)
        {
          const unitID = arg.msg.extData.unitID
          console.log(unitID,'UNIT ID TÌM ĐƯỢC')
          this.updateClientUnit(unitID)
        }
        this.$store.commit('updateMsgData',{id: parseInt(this.requestID), newMsgData: arg.msg, isRequestChat: true})
      })
    }
  },
  watch: {},
  inject:['socket'],
  async mounted() {
    this.$store.commit('resetChatState')
    await this.getURequestData();
    await this.getChatData()
    await this.listenNewChat()
  },
  beforeUnmount() {
  },
}
</script>

<style scoped>
.chat-rightBar {
  height: 100vh;
}

@media only screen and (max-width: 768px) {
  .chat-rightBar {
    height: 82vh !important;
    overflow-y: scroll;
  }
}
</style>
