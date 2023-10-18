<template>
  <div class="w-100">
    <div class="d-flex justify-content-between">
      <div class="col-8">
        <div class="d-flex">
          <FpIcon v-if="favShow" :srcIcon="favIcon" :size="20" @click="onFavClick" class="me-2"/>
          <b v-if="cusName">{{ cusName }}</b>
          <FpIcon class="ms-3" v-if="phoneNumber && zaloDirect" srcIcon="zalo.svg" :size="20"
                  @click="onZaloSvgClick(phoneNumber)"></FpIcon>
        </div>
        <div class="d-flex">
          <FpIcon v-if="phoneNumber" srcIcon="PhoneCall.svg" :size="20"/>
          <span v-if="phoneNumber" class="px-2">{{ phoneNumber }}</span>
        </div>
        <span v-if="lastInteract">Tương tác
            <span :style="{'color':getLastUpdateColor(lastInteract)}">{{ formatTimeMaxIsWeek(lastInteract) }}</span>
         </span>
        <div v-if="!editNote" class="col-auto d-flex py-1">
              <span  class="text-gray text-content d-flex flex-wrap overflow-hidden "
                     :style="`height:${cusNoteMaxHeight}px !important;align-items: flex-start;`"
                     @click="updateNote ? editNote=!editNote : false">
                      {{ cusNoteData }}
                    <FpIcon v-if="editNote"  srcIcon="PencilSimple.svg" :size="12" class="mt-1 ms-2"></FpIcon>
              </span>

        </div>
        <div class="col-auto  d-flex p-1" v-if="editNote" v-on:keyup.enter="onEnter">
            <textarea style="height: 48px !important;" v-model="cusNote" placeholder="Ghi chú" name="note"
                      class="form-control small-text-box border-white text-content p-0">
            </textarea>
        </div>
      </div>
      <div class="col-auto d-flex justify-content-end">
        <FpUserAvt :size="avtSize" :anotherUser="true" :anotherAvt="avt" :dotSize="dotSize" :dotColor="dotColor"
                   :avtOutline="avtOutline" class="position-relative" @click="goToCusUrl"/>
        <FpIcon v-if="phoneNumber && socialDirect" srcIcon="zalo.svg" :size="28" class="icon outLineSocialIcon"
                @click="onZaloSvgClick(phoneNumber)"/>
        <FpIcon v-if="socialDirect && facebook" srcIcon="MessengerLogo.svg" :size="28" class="icon outLineSocialIcon"
                @click="onFbClick(facebook)"/>
        <FpIcon v-if="socialDirect&& phoneNumber" srcIcon="viberLogo.svg" :size="28" class="icon outLineSocialIcon" @click="onTelNumber(phoneNumber)"/>
      </div>
    </div>


  </div>
</template>

<script>
import FpUserAvt from "@/components/FpImg/FpUserAvt.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {
  goZaloWebWithPhoneNumbInMobile,
  goZaloWebWithPhoneNumbInDesktop,
  formatTimeMaxIsWeek,
  getUserIdFromFb, goMsgerWithIdFacebookDesktop, goMsgerWithIdFacebookMobile, getIconUrl,
} from "@/utils/utils";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {getLastUpdateColor} from "@/utils/utils";
import {debounce} from 'lodash'
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import {S_CUS_UPDATE_URL} from "@/router/URLs";

export default {
  methods: {
    getIconUrl,
    formatTimeMaxIsWeek,
    getLastUpdateColor,
    onZaloSvgClick(phoneNumb) {
      if (scrWdtFrom(scrWdtEnum.LG)) {
        goZaloWebWithPhoneNumbInDesktop(phoneNumb)
      } else {
        goZaloWebWithPhoneNumbInMobile(phoneNumb)
      }
    },
    goToCusUrl()
    {
      if(this.canGoCusDetail && this.cusId)
      {
        this.$router.push({name:'update cus data',params:{cusID: this.cusId}})
      }
    },
    onFbClick(fb) {
      if (scrWdtFrom(scrWdtEnum.LG)) {
        goMsgerWithIdFacebookDesktop(getUserIdFromFb(fb))
      } else {
        goMsgerWithIdFacebookMobile(getUserIdFromFb(fb))
      }
    },
    onFavClick() {
      this.$emit('favClick', !this.fav)
    },
    onEnter() {
      this.editNote = !this.editNote
    },
    onTelNumber(phoneNumb)
    {
      if(phoneNumb)
      {
        window.location.href = `tel:${phoneNumb}`;
      }
    },
    async getIndexOfSocialIcon() {
      const icons = await document.querySelectorAll('.icon');
      const iconCount = icons.length;
      const radius = 50;
      const defaultAngle=Math.PI/4;
      const iconRadius = 14;
      const minIcon = 7;
      icons.forEach((icon, index) => {
        const angle = (2 * Math.PI * index) / Math.max(minIcon,iconCount) - defaultAngle;
        const x = Math.cos(angle) * (radius) + iconRadius ;
        const y = Math.sin(angle) * (radius) - iconRadius;
        icon.style.transform = `translate(${x - radius}px, ${y+ radius}px)`;
      });
    }
  },
  data() {
    return {
      avt: this.avtSrc,
      editNote: false,
      cusNote: '',
      firstRun: true,
    }
  },
  components: {
    FpDot,
    FpIcon,
    FpUserAvt
  },
  computed: {
    favIcon() {
      return this.fav ? 'star-solid.svg' : 'star.svg'
    },
    cusNoteData()
    {
      if(this.updateNote)
      {
        return this.cusNote || 'Thêm ghi chú'
      }
      else {
        return this.cusNote
      }
    }
  },
  props: {
    cusId: {
      type: Number,
    },
    avtSrc: {
      type: Object,
      default: () => {
      }
    },
    fav: {
      type: Boolean,
      default: false
    },
    favShow: {
      type: Boolean,
      default: false
    },
    phoneNumber: {
      type: [Number,String]
    },
    contact: {
      type: String,
    },
    facebook: {
      type: String
    },
    note: {
      type: String,
    },
    updateNote: {
      type: Boolean,
      default: false
    },
    lastInteract: {
      type: String
    },
    cusName: {
      type: String,
    },
    avtSize: {
      type: Number,
      default: 50
    },
    dotSize: {
      type: Number,
    },
    dotColor: {
      type: String,
    },
    avtOutline: {
      type: String,
    },
    zaloDirect: {
      type: Boolean,
      default: false
    },
    activeDot: {
      type: Boolean,
      default: false
    },
    activeColor: {
      type: String,
    },
    socialDirect: {
      type: Boolean,
      default: false
    },
    cusNoteMaxHeight:{
      type:Number,
      default:48
    },
    canGoCusDetail:{
      type:Boolean,
      default:false
    }
  },
  watch: {
    avtSrc() {
      this.avt = this.avtSrc
    },
    cusNote: {
      handler: debounce(function (newVal) {
        this.$emit('editCusNote', newVal);
      }, 500),
      immediate: true
    },
    note() {
      this.cusNote = this.note
    },
    phoneNumber()
    {
      this.$nextTick(() => {
        this.getIndexOfSocialIcon()
      });
    }
  },
  emits: ['editCusNote', 'favClick'],
  mounted() {
    this.cusNote = this.note
     this.getIndexOfSocialIcon()
  }
}
</script>


<style scoped>
.outLineSocialIcon {
  box-shadow:  rgba(0, 0, 0, 0.1) 0 0 0 7px;
  border-radius: 100%;
  position: absolute;
}

</style>
