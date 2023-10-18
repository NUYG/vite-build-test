<template>
  <div class="d-flex flex-wrap pj-information" :class="{'span-margin':spanMargin}">

    <div class="d-flex w-100">
          <span v-if="block && block.length && !unitType>0"
                :class="{'text-gray':blockHeightGray}"><FpIcon v-if="!blockHeightGray" srcIcon="Building_Level.svg"
                                                               :size="iconSize" class="col-auto"></FpIcon> Block {{block }}</span>
      <span class="col-auto" v-if="height && !unitType" :class="{'text-gray':blockHeightGray}"><FpIcon v-if="buildingIcon" src-icon="Building_Level.svg" :size="iconSize"></FpIcon> Tầng {{ translate(HEIGHT(), height) }}</span>
    </div>

    <span v-if="price">{{this.rent ? `${this.price} Triệu` : `${this.price} Tỷ`}}</span>
    <span v-if="bedroom && bedroom!== '0' && bedroom!==0">{{ bedroom }}   <FpIcon srcIcon="bed.svg" :size="iconSize"></FpIcon></span>
    <span v-if="bathroom&&bathroom>0">{{ bathroom }} <FpIcon srcIcon="Shower.svg" :size="iconSize"></FpIcon></span>
    <span v-if="size&&size>0"><FpIcon srcIcon="Squaremetre.svg" :size="iconSize"></FpIcon> {{ size }}m²</span>
    <span v-if="unitType" :class="{'red-text':unitTypeRed}">{{ unitType }}</span>
    <span v-if="balcony"><FpIcon srcIcon="Compass.svg" :size="iconSize"/> {{ translate(POINTING(), balcony) }}</span>
    <span v-if="furniture"><FpIcon :srcIcon="getFurIcon(furniture)"
                                   :size="iconSize"/> {{ transFurniture(furniture) }}</span>
    <span v-if="views && views.length">
      <FpIcon src-icon="Eye.svg" :size="iconSize" v-if="viewIcon"></FpIcon>  {{ viewTransle }}
    </span>
    <span v-if="managementCoverage"><FpIcon :size="iconSize" srcIcon="Checks-solid.svg"/> Phí quản lý</span>
    <span v-if="moveInDay"><FpIcon :size="iconSize" srcIcon="moveIndayIcon.svg"/>{{ getDdMm(moveInDay) }}</span>
    <span v-if="heights">{{ heights }}</span>
    <div class="col-12 mt-2">
      <div class="col-auto">
              <span v-if="(view ||view2 ) &&  !unitType" class="text-gray">View:
                <span v-if="view"> <img alt="" :src="getIconUrl(getViewIcon(view))"/>{{ translate(this.VIEW, view) }}</span>
                <span v-if="view2"><img alt="" :src="getIconUrl(getViewIcon(view2))"/> {{ translate(this.VIEW, view2) }}</span>
              </span>
      </div>
    </div>
  </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {transFurniture, getFurIcon, viewlibIcon} from "@/utils/unit";
import {getIconUrl, translate} from "@/utils/utils";
import {getDdMm} from "@/utils/dateTimeUtils";
import {VIEW,HEIGHT, POINTING} from "@/utils/TransContent";

export default {
  props: {
    price: {
      type: [Number,String]
    },
    bedroom: {
      type: [Number,String]
    },
    bathroom: {
      type:  [Number,String]
    },
    size: {
      type: Number
    },
    block: {
      type: String
    },
    furniture: {
      type: String
    },
    balcony: {
      type: String
    },
    rent: {
      type: Boolean,
      default: true
    },
    managementCoverage: {
      type: Boolean,
      default: false
    },
    iconSize: {
      type: Number,
      default: 24
    },
    unitType: {
      type: String,
    },
    heights: {
      type: String,
    },
    moveInDay: {
      type: String,
    },
    views: {
      type: Array,
      default: () => []
    },
    view: {
      type: String
    },
    view2: {
      type: String
    },
    unitTypeRed: {
      type: Boolean,
    },
    height: {
      type: String,
    },
    blockHeightGray: {
      type: Boolean,
      default: false
    },
    viewIcon:{
      type:Boolean,
      default:false
    },
    buildingIcon:{
      type:Boolean,
      default:false
    },
    spanMargin:{
      type:Boolean,
      default:true
    }
  },
  components: {
    FpIcon
  },
  methods: {
    HEIGHT() {
      return HEIGHT
    },
    POINTING() {
      return POINTING
    },
    getIconUrl,
    getDdMm,
    transFurniture,
    getFurIcon,
    translate,
    getViewIcon(view) {
      return viewlibIcon[view];
    },

  },
  computed: {
    viewTransle() {
      let view = ''
      if (this.views && this.views.length) {
        this.views.map(el => {
          view = view + translate(VIEW, el) + ' '
        })
      }
      return view
    }
  },
  data() {
    return {
      VIEW,
    }
  },
  mounted() {
  }
}
</script>

<style>
.pj-information span {
  flex: 0 0 auto;
  width: auto;
  font-weight: 400;
  font-size: 14px;
  padding: 0 4px;
}
.span-margin span{
  margin: 0.5rem;
}

.red-text {
  color: #FF4747;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
}
</style>