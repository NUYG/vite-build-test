<template>
  <div :class=" ((!isPC && rBShow) ? ' position-fixed pe-3 top-0' : '')">
    <div class="d-flex row" v-if="!loadingStt">
      <div class="pe-0" :class="mainCol">
        <div class="h-100" id="top-point">
          <breadcrumbView v-bind="bcProps" :rBShow="rBShow" class="navbar fp-header " @openRightBar="showRightBar"
                          @conciergeClick="conciergePopup=true" :notificationNotSeen="notificationNotSeen"
                          :notificationTime="lastNotification" @backIconClick="onBreadcrumbBackIcon"
                          :hiddenBackIcon="hiddenBackIcon" :is-guest="isGuest" @change-cur="reloadContent">
            <template #extIcon>
                <slot name="breadCrumbExtIcon"></slot>
            </template>
          </breadcrumbView>

          <!--        region  request login when role is Guest -->
          <div class="more-bg-opacity row" v-if="isGuest && bannerLoginReq">
            <div class="px-3 py-2 d-flex justify-content-between align-items-center">
              <span class="more-color col-auto text-sm-12 px-3">Trải nghiệm đầy đủ tính năng ngay bây giờ.</span>
              <ButtonView content="Đăng nhập" status="more-btn" class="col-auto px-3 me-3" :text-size="12"
                          @click="$router.push('/login')"></ButtonView>
            </div>
          </div>
          <!--          end region-->

<!--          region: main view -->
          <div class="w-100 main-background mt-5 mt-md-0" :class="mainVh100 ? 'main-container' : 'h-100 ' + isBacktoTopMode" v-if="showMainContent">
            <slot name="comp"></slot>
          </div>
<!--          end region-->


<!--          scroll to top -->
          <div class="position-fixed" style="bottom: 15%; right: 5%" v-if="isScrolled && showBackToTop">
            <div @click="scrollToTop" class="back-to-top">
              <FpIcon src-icon="BackToTop.svg" :size="24" class=""></FpIcon>
            </div>
          </div>
        </div>
      </div>


      <!--      region: right bar-->
      <div class="right-bar right-panel" v-show="rBShow" :class="rBShow ? rBCol : ''">
        <slot name="rightBar"></slot>
      </div>
      <!--      end region-->

    </div>

    <!--    region: loading animation -->
    <div class="container-fluid" style="margin-top: 150px" v-if="(loadingStt && showLoading) || !showMainContent">
      <div class="d-flex justify-content-center align-items-center row">
        <MoreLoadingAnimation :size="150" animation-name="More-Loading.json" class="col-auto"></MoreLoadingAnimation>
      </div>
      <p class="text-center font-weight-600 more-color">Chờ chút nhé... </p>
    </div>

    <!--  end region -->
  </div>

  <FcmPushNotification @notification="onNotification" v-if="!isGuest" @notiNotSeenTt="countNotiNotSeen" />
  <PopupTemplate popup-class="col-10 col-lg-6 h-75 border8" content-class="h-100" v-if="conciergePopup"
                 @close-popup="conciergePopup=false">
    <template #contentPopup>
      <SwipeVideo :videoIDs="videoIDs"></SwipeVideo>
    </template>
  </PopupTemplate>
  <TextNotification
      v-if='toastMsgContent'
      :message='toastMsgContent'
      @close="$emit('closeToast')"
      :closeNotiTime="1800"
      :toast-class="toastClass"
  />

  <RequestLogin v-if="showReqLogin"></RequestLogin>
</template>

<script>
import breadcrumbView from "@/views/Breadcrumb/BreadcrumbView.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import FcmPushNotification from "@/components/features/FcmPushNotification.vue";
import {getAnimJson, setLocalStorageItem} from "@/utils/utils";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import MoreLoadingAnimation from "@/components/FpAnimation/MoreLoadingAnimation.vue";
import RequestLogin from "@/views/Authencation/RequestLogin.vue";
import PopupTemplate from "@/components/FpPopup/PopupTemplate.vue";
import SwipeVideo from "@/views/ConciergeSwipe/SwipeVideo.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import TextNotification from "@/components/Misc/TextNotification.vue";
import {FpGuestCart} from "@/router/URLs";
import {post} from "@/utils/dataQuery";
export default {
  components: {
    TextNotification,
    ButtonView,
    SwipeVideo,
    PopupTemplate,
    RequestLogin,
    MoreLoadingAnimation,
    FpIcon,
    breadcrumbView,
    FcmPushNotification,
  },
  data() {
    return {
      // sidebarOpen: true,
      rBShow: false,
      messages: [],
      lastNotification: '',
      isScrolled: false,
      videoIDs: ['https://www.youtube.com/watch?v=GRonxog5mbw', 'https://www.youtube.com/watch?v=5QsHXlzGLcc'],
      conciergePopup: false,
      FpGuestCart,
      notificationNotSeen:0,
      ttPrcNewChat:0,
      showMainContent: true
    }
  },
  computed: {
    isPC() {
      return scrWdtFrom(scrWdtEnum.MD);
    },
    mainCol() {
      return this.mainShrinking ? `col-${this.mainShrinkWid}` : 'col-12';
    },
    mainShrinkWid() {
      return Math.max(1, 12 - this.rBWidth);
    },
    mainShrinking() {
      return this.isPC && this.rBShow;
    },
    rBCol() {
      return `col-${this.rBWidth}`
    },
    isBacktoTopMode() {
      return this.showBackToTop ? 'position-relative' : ''
    },
    loadingStt() {
      return this.showLoading ? this.isLoading : false
    }
  },
  methods: {
    reloadContent()
    {
      this.showMainContent = false
      setTimeout(() => {
        this.showMainContent = true
      },1)
    },
    countNotiNotSeen(numb)
    {
      this.notificationNotSeen = numb
    },
    getAnimJson,
    // openSidebar() {
    //    this.sidebarOpen = !this.sidebarOpen;
    // },
    onBreadcrumbBackIcon() {
      this.$emit('breadcrumbBackIcon')
    },
    showRightBar(showRB) {
      this.rBShow = showRB;
      this.$emit('showRB', showRB)
    },
    onNotification(data) {
      this.$emit('notification', data)
      this.lastNotification = window.localStorage.getItem('newNotificationTime')
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    handleScroll() {
      // Kiểm tra xem màn hình đã cuộn xuống hay chưa
      this.isScrolled = window.scrollY > 0;
    },
    extractVideoIdFromLink(link) {
      // Extract the VIDEO_ID from the YouTube link
      return link.split('v=')[1];
    },
    extractVideoIdsFromLinks(links) {
      return links.map(this.extractVideoIdFromLink);
    },

  },
  props: {
    bcProps: {
      /** this Props can have keys
       * title: String,
       * enableFav: Boolean,
       * defFav: Boolean
       * favObjType: favObj enum from favAPI.ts,
       * favObjId: Number,
       * enableRB: Boolean,
       * showRB: Number,
       * rBIcon: String,
       * linkIcon: String,
       * linkHref: String,
       */
      type: Object,
      default: () => ({}),
    },
    rBWidth: {
      type: Number,
      default: 3,
    },
    mainVh100: {
      type: Boolean,
      default: false
    },
    hiddenBackIcon: {
      type: Boolean,
      default: false
    },
    showBackToTop: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    isGuest: {
      type: Boolean,
      default: false
    },
    showReqLogin:{
      type:Boolean,
      default:false
    },
    bannerLoginReq:{
      type:Boolean,
      default:true
    },
    toastMsgContent:{
      type:String,
      default:''
    },
    toastClass:{
      type:String,
      default:'col-auto border border-success'
    },
    requiredScroll:{
      type:Boolean,
      default:false
    }
  },
  emits: ['favIconClk', 'notification', 'showRB', 'breadcrumbBackIcon','closeToast','totalNewPrcChat'],
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeMount() {
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  watch: {}
}
</script>

<style scoped>
.breadcrumb {
  padding: 8px;
  width: 100%;
  margin-bottom: 0;
}

.main-container {
  height: calc(100vh - 80px);
}

@media only screen and (max-width: 576px) {
  .breadcrumb {
    padding: 18px 8px;
    width: 100%;
    margin-bottom: 0;
    position: sticky;
    top: 0;
    z-index: 200;
    background-color: white;
  }
  .fp-header{
    background-color: white;
    position: fixed;
    z-index: 200;
    top: 0;
    right: 0;
    left:0;
    margin: 0 auto;
    padding: 12px 0 12px 0;
  }
}

.main-background {
  padding-bottom: 30px;
}

.position-fixed[style="bottom: 15%; right: 5%"] {
  display: none;
}

.back-to-top {
  border-radius: 32px;
  background: #FFF;
  padding: 10px;
  box-shadow: 0 6px 17px rgba(0, 0, 0, 0.25);
}

</style>
