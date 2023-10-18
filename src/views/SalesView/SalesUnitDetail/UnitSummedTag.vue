<template>
  <div class="p-3 p-xl-4 card-gray-teal">
    <div class="row d-flex justify-content-between p-2 p-lg-1">
      <div class="col-auto">
        <span class="font-weight-600" style="font-size: 18px;line-height: 28px;color:#1C1C1C">{{statusText.text}}</span>
      </div>
      <div class="col-auto justify-content-end d-flex">
        <div class="row">
          <div class="col-auto cursor-pointer">
            <div class="d-flex justify-content-end copy-btn" @click="copyUnitContent">
                  <span class="col-auto pe-0">
                         <FpIcon srcIcon="CopySimple.svg" :size="20" ></FpIcon>
                   </span>
              <span class="col-auto ps-1  text-content">Sao chép</span>
            </div>
          </div>
          <div class="col-auto border8 copy-btn" style="padding: 4px;background:rgba(0, 0, 0, 0.05);" @click="onPairedCus">
                    <FpIcon srcIcon="Handshake.svg" :size="20"></FpIcon>
                    <span class="text-content">Tư vấn khách</span>
          </div>
        </div>
        <TextNotification v-if='copy_notification' message='Đã sao chép!' @close='removeNotifications'/>
      </div>
    </div>
    <div class="row mt-1 p-2">
      <div class="col-auto border-end border-gray pe-3">
        <span class="text-content text-color-black">Mức giá</span>
        <span class="text-title font-weight-600 d-block">{{ unitPrice }} {{statusText.unitText}}</span>
      </div>
      <div class="col-6 ps-4">
        <span class="text-content text-color-black">Hoa hồng</span>
        <span class="text-title font-weight-600 d-block"> {{ commission }} Triệu</span>
      </div>
    </div>
    <div class="row mt-2">
      <div v-if="managementCoverage || feeCoverage || transferringCoverage" class="col-auto text-gray text-12"><FpIcon srcIcon="Checks.svg" :size="20"> </FpIcon> Bao phí:
        <span class="text-color-black text-content">{{feeText}}</span>
      </div>
      <div class="col-auto" v-if="contractExpiry">
        <FpIcon srcIcon="CalendarBlankGray.svg" :size="20"></FpIcon>
        <span class="text-color-black text-content ms-1">{{calculateWeeks(contractExpiry)}} Tuần</span>
      </div>
    </div>
  </div>
</template>

<script>
import TextNotification from "@/components/Misc/TextNotification.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {calculateWeeks} from "@/utils/dateTimeUtils";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {goToURL} from "@/utils/utils";
import {S_INQ_DETAIL_URL} from "@/router/URLs";

export default {
  components: {FpIcon,TextNotification},
  data()
  {
    return {
      copy_notification:false
    }
  },
  methods:{
    goToURL,
    calculateWeeks,
    removeNotifications()
    {
      this.copy_notification=false
    },
    copyUnitContent()
    {
      this.copy_notification=true
      this.$emit('copyUnitContent')
    },
    onPairedCus()
    {
      this.$emit('onPairedCus')
    },

  },
  emits:['copyUnitContent','onPairedCus'],
  computed:{
    statusText()
    {
      if(this.renting)
      {
        return {
          text:'Cho thuê',
          unitText:'Tr / Tháng'
        }
      }
      else if(this.selling)
      {
        return {
          text:'Rao bán',
          unitText:'Tỷ'
        }
      }
      return ''
    },
    feeText()
    {
      const coverages = [];
      if (this.managementCoverage) {
        coverages.push('Phí quản lý');
      }
      if (this.transferringCoverage) {
        coverages.push('Bao sổ');
      }
      if (this.feeCoverage) {
        coverages.push('Bao thuế phí');
      }
      return coverages.join(', ');
    },
  },
  props:{
    id:{
      type:Number,
    },
    renting:{
      type:Boolean,
    },
    selling:{
      type:Boolean
    },
    unitPrice:{
      type:[String,Number],
    },
    commission:{
      type:[String,Number],
    },
    managementCoverage:{
      type:Boolean
    },
    feeCoverage:{
      type:Boolean
    },
    transferringCoverage:{
      type:Boolean
    },
    contractExpiry:{
      type:String,
    }
  }
}
</script>

<style scoped>
.copy-btn {
  padding: 4px 8px 4px 4px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
}
.copy-btn:active {
  background: black !important;
  color: white;
}
.copy-btn:active img{
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(1deg) brightness(102%) contrast(104%);
}

</style>