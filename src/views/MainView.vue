<template>
  <div class="row container-max-width main-content">
    <div v-if="checkAuth" class="d-none d-md-block common-sidebar"
         :class="{ 'col-2':sideBarExtend,'col-1': !sideBarExtend }" style="z-index: 100">
      <SideBarView @onOpenSidebar="onSideBarClick"/>
    </div>
    <div class="col-md-10 col-12 px-0" :class="{'col-md-12':!checkAuth, 'col-md-11':!sideBarExtend}"
         style="height: calc(100% - 68px);">
        <RouterView></RouterView>
    </div>
    <div class="row">
      <MenuMobile @menuMobileClick="onMenuMobileClick" :is-guest="!checkAuth"/>
    </div>
  </div>

</template>

<script>
import SideBarView from "@/views/Sidebar/SideBarView.vue";
import MenuMobile from "@/views/Sidebar/MenuMobile.vue";
import FcmPushNotification from "@/components/features/FcmPushNotification.vue";
import {getCompareValue, post} from "@/utils/dataQuery";
import {
  getItemFromLocalStorage, hasLogin,
  requestToSeverWhenUserCheckIn,
  requestToSeverWhenUserCheckOut,
  setLocalStorageItem
} from "@/utils/utils";
import {getCurrentCurrencyName, getSeverCurrencyRate} from "@/models/currency";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {
    FcmPushNotification,
    MenuMobile,
    SideBarView,
  },
  data() {
    return {
      pageName: '',
      sideBarExtend: true,
      ttNewChat:0,
    }
  },
  computed: {
    checkAuth() {
      return this.getIsLoggedIn
    },
    ...mapGetters(['getPjLibData','getIsLoggedIn']),
  },
  methods: {
    ...mapActions(['getPjDataLib','checkLoginStatus']),
    requestToSeverWhenUserCheckIn,
    requestToSeverWhenUserCheckOut,
    getCurrentPage() {
      this.pageName = window.location.pathname;
    },
    onMenuMobileClick(url) {
      this.pageName = url
    },
    onSideBarClick() {
      this.sideBarExtend = !this.sideBarExtend
    },
    async sendInitialRequest() {
      if (this.checkAuth) {
        const res = await post('/fp_user/refresh_active_user', {})
      }
    },
    beforeUnloadHandler() {
      this.requestToSeverWhenUserCheckOut()
    },
    async getCurrentUser()
    {
      const res = await post('/fp_user/get_detail_data', {})
      if(res.returnData)
      {
        await this.$store.commit('setCurrentUserData',res.returnData)
      }
    },

  },
  async mounted() {
    await  this.checkLoginStatus()
    await getSeverCurrencyRate(getCurrentCurrencyName())
    this.getCurrentPage()
    await this.requestToSeverWhenUserCheckIn()
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
      setLocalStorageItem('browser', 'Chrome')
    }
    if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
      setLocalStorageItem('browser', 'Safari')
    }
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  },
  async  created() {
    await this.getCurrentUser()
    await this.getPjDataLib();
  },
  beforeMount() {
    this.sendInitialRequest();
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

}
</script>

<style scoped>
.container-max-width {
  max-width: 100%;
}


</style>
