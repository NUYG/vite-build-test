<template>
  <div class="h-100 card-gray-active p-0">
    <div class="row p-2" :style="notAvailable ? 'filter: saturate(0);':''">
      <div class="col-12 pe-1" :class="minorVersion ? 'col-lg-9' : 'col-lg-6'">
        <UnitImg :imgSrc="unitFirstImg.thumb" :showFurText="!minorVersion"
                 :ratioImg="[3,2]" :highLightTag="true" :high-light-tag-content="highLightTag.highLightTagContent"
                 :h-lt-tag-color="highLightTag.hLtTagColor" :unitTag="unitTag">
          <template #extComp>
              <slot name="imgTagExt"></slot>
          </template>
        </UnitImg>
      </div>
      <div class="ps-1" :class=" minorVersion ? 'col-lg-3' : 'col-lg-2'">
        <div class="d-lg-flex d-none flex-lg-wrap">
          <div  v-for="(index) in range" :class="thumbClass">
            <UnitImg :imgSrc="getThumbImg(index)" :ratioImg="[3, 2]" :lastImg="index===lastImgCountNumb" :ttImg="ttImg"
                     :bottomTag="false" :class="{'mt-lg-2': index > 0}"/>
        </div>
        </div>
      </div>
      <div class="px-lg-3 px-2 " :class="minorVersion ? 'col-lg-12' : 'col'">
        <div class="row d-flex justify-content-between px-lg-2 mt-3">
          <div class="col-auto pe-0" :class="{'px-2':!minorVersion}">
          <span :style="`font-size: ${(minorVersion&& isMobile  ) ? 16 : 24}px`" class="ms-1 font-weight-600">{{ unitInformation.price }}
            <span class="font-weight-600 text-content"
                  :class="{'text-decoration-line-through': notAvailable}">{{ unitInformation.priceText }}</span></span>
          </div>
          <div class="col-auto ps-0">
             <span class="me-2" v-if="freshLv">
                 <FpIcon :srcIcon="getUnitFreshIcon(freshLv)" :size="minorVersion&&isMobile ? 24 : 36"></FpIcon>
              </span>
            <span class="border8" @click="onFavClick" style="background: #F2F2F2;" :style="`padding:${paddingFavIcon}`">
                <FpIcon :srcIcon="favIcon" :size="minorVersion&&isMobile ? 16 : 24"></FpIcon>
            </span>
          </div>
        </div>
        <div v-if="unitInformation.fee" class="px-2 text-gray" style="font-size: 12px;">Đã bao phí</div>
        <div class="row px-1 mt-2">
          <div class="col-12 pe-0">
            <FpUnitInfoView v-bind="unitInformation" :iconSize="minorVersion&& isMobile ? 16 :24 "
                            :small-size="minorVersion&& isMobile"></FpUnitInfoView>
          </div>
        </div>
        <div class="px-2 mt-2 text-gray" :style="`font-size: ${minorVersion&& isMobile ?10:14}px`">
          <div v-if="unitInformation.desc">{{ unitInformation.desc }}</div>
          <div v-if="unitInformation.freshTime">Xác minh {{ unitInformation.freshTime }} trước</div>
        </div>
        <slot name="extContent"></slot>

      </div>

    </div>


  </div>
</template>

<script>

import UnitImg from "@/components/FpUnit/UnitImg.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import {getUnitFreshIcon, pjInformationBotUnitImg, unitPriceTextExt} from "@/utils/unit";
import {favObj, favObjAPI} from "@/utils/favAPI";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import FpUnitInfoView from "@/components/FpUnit/FpUnitInfoView.vue";
import FpTag from "@/components/FpTag/FpTag.vue";


export default {
  data() {
    return {
      fav: false
    }
  },
  methods: {
    getUnitFreshIcon,
    unitPriceTextExt,
    pjInformationBotUnitImg,
    getThumbImg(index) {
      if (this.unitImgs && Object.keys(this.unitImgs).length) {
        return this.unitImgs[index] ? this.unitImgs[index].thumb : ''
      }
      return ''
    },
    async onFavClick(event) {
      event.stopPropagation()
      this.fav = !this.fav
      const res = await favObjAPI(favObj.UNIT, this.unitInformation.id, this.fav)
    }
  },
  mounted() {
    this.fav = this.favUnit
  },
  watch: {
    favUnit(newVal) {
      this.fav = newVal
    }
  },
  components: {
    FpTag,
    FpUnitInfoView,
    FpPjInformationTag,
    FpIcon,
    UnitImg
  },
  computed: {
    lastImgCountNumb() {
      // 2 is the last index has css and count img total in thumbnail
      return this.minorVersion ? '' : 2
    },
    projectInformationText() {
      return pjInformationBotUnitImg(this.unitInformation, 'block')
    },
    range() {
      return [0, 1, 2];
    },
    favIcon() {
      return this.fav ? 'Heart-red.svg' : `Heart.svg`
    },
    unitInformationHeight() {
      return scrWdtFrom(scrWdtEnum.XL) ? '40%' : '10%'
    },
    isMobile() {
      return !scrWdtFrom(scrWdtEnum.MD)
    },
    thumbClass() {
      if (this.minorVersion && !this.isMobile) {
        return 'col-12'
      }
      return  'col-12'
    },
    highLightTag() {
      return this.isTopUnit ? {hLtTagColor: "#FF4747", highLightTagContent: 'Căn hot'} : {
        hLtTagColor: "#59A8D4",
        highLightTagContent: 'Nổi bật'
      }
    },
    paddingFavIcon() {
      return this.minorVersion && this.isMobile ? '0.2rem' : '0.5rem'
    }
  },
  props: {
    unitInformation: {
      type: Object,
      default: () => {
      }
    },
    unitFirstImg: {
      type: Object,
      default: () => {
      }
    },
    unitImgs: {
      type: Array,
      default: () => []
    },
    freshLv: {
      type: Number
    },
    favUnit: {
      type: Boolean,
    },
    ttImg: {
      type: Number
    },
    unitTag: {
      type: Array,
      default: []
    },
    minorVersion: {
      type: Boolean,
      default: false
    },
    isTopUnit: {
      type: Boolean,
    },
    notAvailable:{
      type:Boolean,
      default:false
    }
  }
}
</script>

<style>
.font-16-12 {
  font-size: 16px;
}

@media only screen and (max-width: 767px) {
  .font-16-12 {
    font-size: 12px;
  }

}

.font-size-9 {
  font-size: 9px !important;
}

</style>
