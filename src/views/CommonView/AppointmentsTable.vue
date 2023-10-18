<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-auto">
        <ProjectSelected  @projectSelected="onPjPick" default-data="Tất cả dự án" :projectsPick="project"></ProjectSelected>
      </div>
      <div class="col-auto h-100">
        <div class="row">
          <ButtonView content="Thuê" status="gray-btn" on-btn-color="#48BD48" class="col-auto mx-2" :active-btn="renting && renting!==''" @click="onRentingPick(true)"></ButtonView>
          <ButtonView content="Bán" status="gray-btn" on-btn-color="#ff4747" class="col-auto mx-2" :active-btn="renting===false" @click="onRentingPick(false)"></ButtonView>
        </div>
      </div>
      <section class="col-auto">
        <date-picker
            format="DD-MM-YYYY"
            type="date"
            v-model:value="timePicked"
            range
            placeholder="Lọc ngày"
        ></date-picker>
      </section>
      <div class="col">
          <ButtonView content="Lọc" status="more-btn" @click="getAppointments"></ButtonView>
      </div>
    </div>

    <div class="col-lg-5 col-12 text-content mt-4"  v-for="(data, index) in appointments" :key="index" >
      <div class="row mt-3 sidebar-menu_item p-3 cursor-pointer"
           @click="goToDetail(data.id)">
        <FpUserImg :size="60" :borderRound="30" class="col-auto" :url="getInformationCard(data).url"
                   :type="getInformationCard(data).type"/>
        <div class="col">
          <div class="row mt-1">
            <span>{{ statusCard(data) }}</span>
          </div>
          <div class="row mt-1 d-flex ">
            <span class="col-auto font-weight-600">{{ getFullDateTime(data.nextMeetingDate) }}</span>
            <span class="col-auto font-weight-600">{{ getInformationCard(data).pjText }}</span>
            <span class="col-auto font-weight-600">{{ getInformationCard(data).code }}</span>
          </div>
          <div class="row mt-1" v-if="isManager">
            <span class="col-auto">Sales: {{data.salesData.first_name}}</span>
            <span class="col-auto">Agent: {{data?.agentData?.first_name}}</span>
          </div>
        </div>
        <div class="col-auto">
          <div class="row mt-2 d-flex ">
            <div class="col-auto btn-padding-gray" @click.stop="shareSchedule(data)">
              <FpIcon srcIcon="ShareNetwork.svg" :size="16"></FpIcon>
            </div>
            <div class="col-auto btn-padding-gray" @click.stop="clipboardSchedule(data)">
              <FpIcon srcIcon="CopySimple.svg" :size="16"></FpIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <FPPaginator
          @to-page="toPage"
          :current-page="currentPage"
          :total-item="totalItems"
          :item-per-page="listLen"
      ></FPPaginator>
    </div>

  </div>
</template>

<script>

import {copyTextToClipboard, getIconUrl, mobileShare, translate, uncapitalizeFirstLetter} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {addZeroToDateTime, getFullDateTime} from "@/utils/dateTimeUtils";
import {baseUrl} from "@/utils/constants";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import {shareAgentSPSchedule} from "@/utils/saleProcess";
import {SALE_PROCESS_STATUS} from "@/utils/TransContent";
import {spDetail} from "@/router/URLs";
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import FPPaginator from "@/components/Misc/FPPaginator.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import ProjectSelected from "@/components/FpFilter/AgentFilter/LayoutResidence/ProjectSelected.vue";
import FpIconRotate from "@/components/FpIcon/FpIconRotate.vue";


export default {
  components: {FpIconRotate, ProjectSelected, FPPaginator, FpIcon, FpUserImg, DatePicker, ButtonView },
  data() {
    return {
      appointments: [],
      list: [],
      sundayFormat: "",
      formatDate: new Date().toISOString().slice(0, 10),
      nearestSunDay: "",
      today: new Date(),
      SALE_PROCESS_STATUS,
      timePicked: [],
      listLen: 10,
      currentPage: 1,
      totalItems: 4,
      renting: undefined,
      project: ''
    }
  },
  props: {
    role: {
      type: String,
      required: true,
    }
  },
  computed: {
    isSales() {
      return this.role === 'Sales'
    },
    isAgent() {
      return this.role === 'Agent'
    },
    isManager() {
      return this.role === 'Manager'
    },

  },
  methods: {
    onRentingPick(val)
    {
      this.renting = this.renting === val ? undefined : val
    },
    getFullDateTime,
    getUrlTypeAvtOfCusData,
    getIconUrl,
    goToURL,
    onPjPick(val) {
      this.project = val.pj_id
    },
    toPage(pageNum) {
      this.currentPage = pageNum;
      this.getAppointments();
    },
    goToDetail(id) {
      this.$router.push(`${baseUrl[this.role]}${spDetail}-${id}`);
    },
    shareScheduleContent(spData) {
      return !this.isSales ? shareAgentSPSchedule(spData) : '';
    },
    clipboardSchedule(spData){
      if (this.isSales){
        return;
      }
      copyTextToClipboard(this.shareScheduleContent(spData));
      this.$emit('copy-schedule');
    },
    shareSchedule(spData){
      if (this.isSales){
        return;
      }
      mobileShare([], this.shareScheduleContent(spData));
    },
    getTime(dateTime) {
      const newDate = new Date(dateTime);
      return `${addZeroToDateTime(newDate.getHours())}:${addZeroToDateTime(
        newDate.getMinutes()
      )}`;
    },
    transProcessStatus(stt) {
      return translate(this.SALE_PROCESS_STATUS, stt);
    },
    statusCard(data) {
      const status = ' ' + uncapitalizeFirstLetter(this.transProcessStatus(data.status))
      if (this.isAgent) {
        return data.salesData.first_name + status
      } else if (this.isSales ) {
        return data.agentData.first_name + status
      }
      else if(this.isManager)
      {
        return data?.ownerData?.name + status
      }
      return ''
    },
    getInformationCard(data) {
      if (this.isAgent || this.isManager) {
        return {
          pjText: data.pjData.code,
          code: data.unitCode.substring(data.unitCode.indexOf('-') + 1),
          url: getUrlTypeAvtOfCusData(data.salesData.extData[0]).url,
          type: getUrlTypeAvtOfCusData(data.salesData.extData[0]).type
        }
      } else if (this.isSales) {
        return {
          pjText: data.pjData.name,
          code: `#${data.salesData.id}${data.id}`,
          url: getUrlTypeAvtOfCusData(data.customerData).url,
          type: getUrlTypeAvtOfCusData(data.customerData).type
        }
      }
    },
    async getAppointments() {
      let meetingFrom ;
      let meetingTo ;
      if(this.timePicked.length)
      {
         meetingFrom =this.timePicked[0]
         meetingTo = this.timePicked[1]
      }
      const res = await post("/sale_process/get_sp_appointments", {
        meetingFrom: meetingFrom ||  new Date().toISOString().slice(0, 10),
        role: this.role,
        meetingTo: meetingTo || '',
        page: this.currentPage,
        listLen: this.listLen,
        project: this.project,
        rent: this.renting,
      });
      this.appointments = res.returnData;
      this.totalItems = res.totalResult
    },

  },
  emits: ['copy-schedule'],
  watch: {
  },
  mounted() {
    this.getAppointments();
  }
}
</script>

<style scoped>
</style>
