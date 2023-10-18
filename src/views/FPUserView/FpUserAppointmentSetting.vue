<template>
      <div class="container-fluid">
        <div class="col-lg-6 p-3 px-2">
          <div class="row d-flex justify-content-between mt-2  align-items-center">
            <span class="font-weight-600 text-title col-auto">Thông báo lịch hẹn</span>
            <div class="form-check form-switch col-auto" style="padding-bottom: 0!important;">
              <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" v-model="allowNotification">
              <label class="form-check-label" for="flexSwitchCheckChecked">Bật</label>
            </div>
          </div>
          <div class="row d-flex justify-content-between mt-2">
            <span class="col-12">Nhắc lịch hẹn</span>
            <div class="row">
              <div class="col-auto">
                <span v-if="appointmentPickedList.length" class="font-weight-600">Trước </span>
                <span v-for="(item, index) in appointmentPickedList" :key="index">
                    <span class="font-weight-600">{{ getItemContent(item) }}</span>
                    <span v-if="index < appointmentPickedList.length - 1">; </span>
                  </span>
        </div>
        <div class="col d-flex justify-content-end">
                <span class="cursor-pointer" style="color: #549FF7;"
                      @click="showPickedTime = !showPickedTime">{{ editText }}</span>
              </div>
            </div>
          </div>
          <div class="mt-3" v-show="showPickedTime">
            <span class="fst-italic">Chọn các khung thời gian phù hợp</span>
            <PreAppointmentNotiSetting :options="addTextToContent" @appointment-time="onPickedAppointment" class="mt-2"
                                       :selected-item="appointmentPickedList">
            </PreAppointmentNotiSetting>
          </div>
          <div class="row d-flex justify-content-between mt-5 align-items-center">
            <span class="font-weight-600 text-title col-auto">Thông báo căn hot</span>
            <div class="form-check form-switch col-auto" style="padding-bottom: 0!important;">
              <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" v-model="allowHotUnitNotify">
              <label class="form-check-label" for="flexSwitchCheckChecked">Bật</label>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import PreAppointmentNotiSetting from "@/components/FpNotification/PreAppointmentNotiSetting.vue";
import {post} from "@/utils/dataQuery";

export default {
  components: {PreAppointmentNotiSetting, FpDefLayout},
  data() {
    return {

      items: [
        {
          id: '120',
          content: '2h'
        },
        {
          id: '60',
          content: '1h'
        },
        {
          id: '30',
          content: '30p'
        },
        {
          id: '10',
          content: '10p'
        }
      ],
      showPickedTime: false,
      appointmentPickedList: [60],
      allowNotification: false,
      allowHotUnitNotify: false,
      // Controller
      upLocking: false,
      upWaiting: false,
    }
  },
  methods: {
    onPickedAppointment(val) {
      this.appointmentPickedList = [...val];
    },
    getItemContent(selectedId) {
      return this.items.filter(item => parseInt(item.id) === parseInt(selectedId))[0].content + ' '
    },
    // APIs
    async specificUpdateSP(endpoint, data = {
      ...this.validateData,
    }) {
      const res = await post(endpoint, data);
      if (!res) {
        return;
      }
      // console.log(res.resText);
      this.serverResText = res.resText;
      if (res.succeed) {
        await this.getDynamicData();
      }
    },
    async updateUserSettings() {
      if (this.upLocking) {
        this.upWaiting = true;
        return;
      }
      this.upLocking = true;

      await this.updateUserSettingsAPI();
    },
    async getUserSettingsData() {
      const res = await post('/fp_user/get_user_settings_data', {})
      if (!res || !res.succeed) {
        return;
      }
      this.appointmentPickedList = res.returnData.appoint_noti_ahead.map(x => String(x));
      this.allowNotification = res.returnData.appoint_noti_allow;
      this.allowHotUnitNotify = res.returnData.hot_unit_noti_allow;
    },
    async updateUserSettingsAPI() {
      // console.log({
      //   appointNotiAhead: this.refinedAppointmentTime,
      //   appointNotiAllow: this.allowNotification,
      // })
      const res = await post('/fp_user/update_user_settings', {
        appointNotiAhead: this.refinedAppointmentTime,
        appointNotiAllow: this.allowNotification,
        hotUnitNotiAllow: this.allowHotUnitNotify,
      })

      if (this.upWaiting) {
        this.upWaiting = false;
        await this.updateUserSettingsAPI();
      } else {
        this.upLocking = false;
      }
    },
  },
  computed: {
    refinedAppointmentTime() {
      return this.appointmentPickedList.map(x => parseInt(x));
    },
    editText() {
      return this.showPickedTime ? 'Hoàn thành' : 'Chỉnh sửa';
    },
    addTextToContent() {
      return this.items.map(function (item) {
        return {id: item.id, content: "Trước " + item.content};
      });
    },
  },
  watch: {
    allowNotification() {
      this.updateUserSettings();
    },
    refinedAppointmentTime() {
      this.updateUserSettings();
    },
    allowHotUnitNotify(){
      this.updateUserSettings();
    },
  },
  mounted() {
    this.getUserSettingsData();
  }
}
</script>
