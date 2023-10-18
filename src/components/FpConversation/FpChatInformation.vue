<template>
  <div class="row p-2">
    <div class="col d-flex align-items-center conv-title overflow-hidden">
      <div class="row">
        <div class="col-auto px-1">
            <FpUserImg :url="getUrlTypeAvtOfCusData(partner?.extData).url"
                 :type="getUrlTypeAvtOfCusData(partner?.extData).type" :size="50" :borderRound="100"/>
        </div>
        <div class="col d-lg-flex align-items-center overflow-hidden">
          <div class="mt-2 mt-lg-0 row">
            <div class="row d-flex justify-content-between ">
              <div class="col-auto ">
                <span class="col-auto" :class="{'font-weight-600':!seen}">{{ partner.name }}</span>
                <span :class="codeStyle" v-if="partner.code">{{ partner.code }}</span>
              </div>
              <div class="col-auto pe-0" v-if="isLastMsgView">
                <span class="seen-msg small">{{formatTimeMaxIsWeek(partner?.chatData?.sMsg?.init_time)}}</span>
              </div>
            </div>
            <div class="row d-flex justify-content-between" v-if="formatAllMsg(partner?.chatData?.msg_data) && isLastMsgView">
                <span class="col-auto" :class="{'seen-msg':seen}">{{formatAllMsg(partner?.chatData?.msg_data).slice(-1)[0]?.msg.substring(0,20)}}</span>
                <FpDot v-if="isLastMsgView && !seen" class="col-auto mt-1 " dotColor="gray" :dotSize="8" :class="{'hidden':seen}"></FpDot>
            </div>
            <div class="row" v-if="!hideInq" @click="directDetailPage" :class="{'cursor-pointer':partner.cusID>0}">
              <span :class="{'text-small': isLastMsgView }">{{ inqStatus }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-2  d-flex justify-content-end align-items-center" v-if="!isLastMsgView">
      <slot name="iconExt"></slot>
      <ButtonView :btnIcon="getIconUrl('PhoneCall.svg')" status="no-bg-btn" :iconSize="24"
                  @click="callToPartner(partner.phone)" v-if="!isReqChat"/>
      <slot name="rightIcon"></slot>
    </div>
  </div>
</template>

<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import {formatLastDayTime, formatTimeMaxIsWeek, getIconUrl} from "@/utils/utils";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import {S_CUS_DETAIL_URL, S_SP_DETAIL_URL, spDetail} from "@/router/URLs";
import {detailPageDirect} from "@/utils/chatConstants";
import {baseUrl, Roles} from "@/utils/constants";
import {getTime} from "@/utils/dateTimeUtils";
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";

export default {
  computed: {
    Roles() {
      return Roles
    },
    inqStatus() {
      return `${this.partner?.cusData} ${this.partner?.status} ${this.partner?.pjName} ${this.partner?.bedRoom}PN ${this.partner?.price}`
    },
    codeStyle() {
      const bold = (this.seen || !this.isLastMsgView)  ? '' : 'fw-bolder'
      const textColor = this.isLastMsgView ? ( this.partner?.rent ?  'rent-text' : 'textSellColor' ) : ''
      return `${bold}  ${textColor}`
    },
  },
  components: {
    FpDot,
    ButtonView,
    FpUserImg
  },
  props: {
    partner: {
      type: Object,
      default: () => {}
    },
    descDirect: {
      type: String,
    },
    hideInq:{
      type:Boolean,
      default:false
    },
    role: {
      type: String,
    },
    isReqChat: {
      type: Boolean,
      default: false
    },
    isLastMsgView: {
      type: Boolean,
      default: true
    },
    seen:{
      type:Boolean,
    }
  },
  methods: {
    formatAllMsg(msg)
    {
      return  msg?.unseen_msgs?.concat(msg?.seen_msgs)
    },
    formatTimeMaxIsWeek,
    getTime,
    getUrlTypeAvtOfCusData,
    getIconUrl,
    callToPartner(phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    },
    directDetailPage() {
      if (this.partner?.cusID > 0 && this.descDirect === detailPageDirect.cusDetail) {
        this.$router.push({name: 'Sales cus detail general', params: {cusID: this.partner?.cusID}})
      } else if (this.partner?.spId > 0 && this.descDirect === detailPageDirect.spDetail) {
        const compName = this.role === Roles.Sales ? 'Sales SP' : 'Agent SP detail'
        this.$router.push({name:compName,params:{spID:this.partner?.spId}})
      }
    }
  }
}
</script>

<style scoped>
.conv-title span {
  margin-right: 10px;
}
.seen-msg{
  font-weight: 400;
  color: #999999
}
</style>
