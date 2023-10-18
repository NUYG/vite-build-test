<template>
  <div class="row mt-1 cursor-pointer chat-box-hover" :class="{'active-box':activeBoxChat}" @click="activeChatBox">
    <div class="col-auto">
      <FpUserImg :url="getUrlTypeAvtOfCusData(extData).url"
                 :type="getUrlTypeAvtOfCusData(extData).type" :size="50" :borderRound="25"/>
    </div>
    <div class="col p-0 ">
      <div class="row d-flex justify-content-between">
        <div class="col text-content">
          <span :class="{'title-new-msg text-new-msg':seen,'title-seen-msg':!seen}">{{ userName }}</span>
          <span class="px-2" :class="codeStyle">{{isReqChat ? 'YC' : '#' }}{{ code }}</span>
        </div>
        <div class="col-auto d-flex justify-content-center">
          <span class="text-gray text-10">{{ formatTime(lastMsgTime) }}</span>
        </div>
      </div>
      <div class="row d-flex justify-content-between" >
        <span class="col-auto wrap-row text-wrap lasMsg-wrap" :class="{'text-gray text-seen-msg ':seen}" >{{ lastMess }}</span>
        <FpDot v-if="lastMsg" class="col-auto mt-1 " dotColor="gray" :dotSize="8" :class="{'hidden':seen}"></FpDot>
      </div>
      <div class="row">
        <span class="text-small">{{ description }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import moment from 'moment';
import 'moment/locale/vi';
import {fixDateTime} from "@/utils/dateTimeUtils";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";

export default {
  components: {
    FpDot,
    FpUserImg
  },
  props: {
    avtUser: {
      type: Object,
      default:() => {}
    },
    userName: {
      type: String,
      default: ''
    },
    code: {
      type: String,
    },
    description: {
      type: String,
      default: ''
    },
    lastMsg: {
      type: String,
      default: ''
    },
    lastMsgTime: {
      type: String,
    },
    rent: {
      type: Boolean,
      default: true
    },
    activeBoxChat: {
      type: Boolean,
      required: true
    },
    seen: {
      type: Boolean,
      required: true
    },
    isReqChat:{
      type:Boolean,
      default:false
    },
    tt_unseen_msg:Number
  },
  emits: ['activeChatBox'],
  methods: {
    getUrlTypeAvtOfCusData,
    activeChatBox() {
      this.$emit('activeChatBox', this.code)
    },
    formatTime(time) {
      if (!time) {
        return 'Chưa bắt đầu';
      }
      const specificDate = moment(time);
      const now = moment();
      const diffMinutes = now.diff(specificDate, 'minutes');
      const diffHours = now.diff(specificDate, 'hours');
      const diffDays = now.diff(specificDate, 'days');
      if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
        return `vài giây`;
      } else if (diffDays === 0 && diffHours === 0) {
        return `${diffMinutes} phút`;
      } else if (diffDays === 0) {
        return `${diffHours} giờ`;
      } else if (diffDays < 7) {
        return `${diffDays} ngày`;
      } else {
        return fixDateTime(time)
      }
    }
  },
  mounted() {
    this.formatTime()
  },
  computed: {
    codeStyle() {
      const bold = this.seen ? '' : 'fw-bolder'
      return `${bold}  ${this.rent ? 'rent-text' : 'textSellColor'}`
    },
    lastMess()
    {
      return this.lastMsg!=='unitMsg' ? this.lastMsg : 'Đã đề xuất 1 căn hộ'
    },
    extData()
    {
      return this.avtUser
    }
  }
}
</script>

<style scoped>
.text-10 {
  font-size: 10px;
}



.title-new-msg {
  font-weight: 700;
}

.text-new-msg {
  font-weight: 500;
}

.title-seen-msg {
  font-weight: 600;
}

.text-seen-msg {
  font-weight: 400;
}


.wrap-row
{
  overflow-wrap: break-word;
  white-space: nowrap
}
@media screen and (min-width: 768px) and (max-width: 1100px){
  .lasMsg-wrap
  {
    max-width: 100px
  }
}



</style>
