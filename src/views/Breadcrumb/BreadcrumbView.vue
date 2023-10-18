<template>
  <div class="d-flex justify-content-between  row">
    <div class="col overflow-hidden ms-1">
       <FpIcon srcIcon="arrowLeft.svg" alt="check_icon" :size="24" @click="handleGoBack" v-if="!hiddenBackIcon" />
      <span v-for="(crumb, index) in crumbs" :key="index">
          <span v-if="crumb">
              <router-link v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</router-link>
              <span v-if="index < crumbs.length - 1 && crumbs[index + 1]">/&nbsp;</span>
          </span>
      </span>
    </div>

    <div class="d-flex col-auto align-items-center">
      <slot name="extIcon"></slot>
      <div class="form-check form-switch col-auto mt-1" style="padding-bottom: 0!important;">
        <input class="form-check-input" type="checkbox" v-model="usdCurr">
        <label class="form-check-label">USD</label>
      </div>
      <FpNotificationIcon class="img-responsive right-tab-icon px-2 me-4 cursor-pointer d-flex"
                          :notificationTime="notificationTime" :size="25" v-if="!isGuest"
                          :notificationNotSeen="notificationNotSeen"/>
      <img v-if="canFav" class="img-responsive right-tab-icon" @click="onFavIconClk" alt="favIcon"
           :src="getIconUrl(favIcon)">
      <FpIconRotate class="img-responsive right-tab-icon sale-process-sales-2" v-show="enableRB" :srcIcon="rBIcon" :size="26"
                    @svgClick="showRightBar(!rBShow)"/>
      <!--        <FpIcon src-icon="Question.svg" :size="25" @click="$emit('conciergeClick')"></FpIcon>-->
      <div class='mt-2' v-if="linkIcon !== ''">
        <a :href='linkHref'>
          <img class="img-responsive right-tab-icon" alt="linkIcon" :src="getIconUrl(linkIcon)"/>
        </a>
      </div>
    </div>
  </div>
</template>


<script>
import FpIconRotate from "@/components/FpIcon/FpIconRotate.vue";
import {getIconUrl, getItemFromLocalStorage, setLocalStorageItem} from "@/utils/utils";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {favObjAPI} from "@/utils/favAPI";
import FpNotificationIcon from "@/components/FpNotification/FpNotificationIcon.vue";
import {defLayoutBehaType} from "@/models/customProp";
import {ternary} from "@/utils/constants";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {getCurrentCurrencyName, getCurrentCurrencyUnit, getSeverCurrencyRate} from "@/models/currency";

export default {
  data() {
    return {
      favorited: false,
      usdCurr: false
    }
  },
  components: {
    FpIcon,
    FpIconRotate,
    FpNotificationIcon
  },
  props: {
    title: {
      type: String,
      default: 'Trang chủ'
    },
    enableFav: {
      type: Boolean,
      default: false,
    },
    defFav: {
      type: Boolean,
      default: false,
    },
    favObjType: {
      type: String,
      default: '',
    },
    favObjId: {
      type: Number,
      default: -1,
    },
    enableRB: {
      type: Boolean,
      default: false,
    },
    showRB: {
      type: Number,
      default: ternary.normal,
    },
    rBIcon: {
      type: String,
      default: 'Sliders.svg',
    },
    linkIcon: {
      type: String,
      default: ''
    },
    linkHref: {
      type: String,
      default: ''
    },
    rBShow: {
      type: Boolean,
      default: false,
    },
    notificationTime: {
      type: String,
    },
    behaviorType: {
      type: Number,
      default: defLayoutBehaType.normal,
    },
    hiddenBackIcon: {
      type: Boolean
    },
    isGuest: {
      type: Boolean,
      default: false
    },
    notificationNotSeen: Number

  },
  computed: {
    favIcon() {
      return this.favorited ? 'star-solid.svg' : 'star.svg';
    },
    canFav() {
      return this.enableFav && this.favObjType && (this.favObjId > 0);
    },
    isPC() {
      return scrWdtFrom(scrWdtEnum.MD);
    },
    defaultShowRB() {
      return this.showRB > 0 || (this.showRB === 0 && this.enableRB && this.isPC)
    },
    crumbs() {
      const matched = this.$route.matched;
      return matched.map(route => {
        if (route.meta?.breadcrumb) {
          const breadcrumbProps = route.meta?.matchedProps ? route : this.$route
          const breadcrumb = typeof route.meta.breadcrumb === 'function' ? route.meta.breadcrumb(breadcrumbProps) : route.meta.breadcrumb;
          return {
            label: breadcrumb.label,
            to: breadcrumb.path,
          };
        } else if (route.meta?.title) {
          return {
            label: route.meta.title,
            to: route.path,
          };
        }
      });
    },
  },
  methods: {
    getIconUrl,
    normalGoBack() {
      if (scrWdtFrom(scrWdtEnum.XL) || !this.rBShow) {
        this.$router.back();
      } else {
        this.showRightBar(false);
      }
    },
    chatHubGoBack() {
      if (scrWdtFrom(scrWdtEnum.XL) || this.rBShow) {
        this.$router.back();
      } else {
        this.showRightBar(true);
      }
    },
    emitSignal() {
      this.$emit('backIconClick')
    },
    handleGoBack() {
      const goBackFuncs = {
        [defLayoutBehaType.normal]: this.normalGoBack,
        [defLayoutBehaType.chatHub]: this.chatHubGoBack,
        [defLayoutBehaType.signal]: this.emitSignal
      }
      try {
        goBackFuncs[this.behaviorType]();
      } catch (err) {
      }
    },
    showRightBar(val) {
      this.$emit('openRightBar', val);
    },
    async onFavIconClk() {
      if (!this.canFav) {
        return;
      }
      const favSucceed = await favObjAPI(
          this.favObjType, this.favObjId, !this.favorited);
      if (favSucceed) {
        this.favorited = !this.favorited;
      }
    },
  },
  emits: ['openRightBar', 'backIconClick', 'conciergeClick','changeCur'],
  watch: {
    defFav(val) {
      this.favorited = val;
    },
    async usdCurr(newVal)
    {
      const currency = newVal ? 'USD' : 'VND';
      setLocalStorageItem('currency', currency);
      const getCurSucceed = await getSeverCurrencyRate(getCurrentCurrencyName());
      if (newVal && !getCurSucceed) {
        window.alert('Gặp sự cố trong việc lấy tỷ giá');
        this.usdCurr = false;
      }else {
        this.$emit('changeCur')
      }
    }
  },
  mounted() {
    this.showRightBar(this.defaultShowRB);
    this.usdCurr = getItemFromLocalStorage('currency') !== 'VND'
  }
}
</script>


<style scoped>
</style>
