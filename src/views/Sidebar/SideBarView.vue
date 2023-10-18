<template>
  <div class="px-2 d-flex justify-content-end">
    <div class="col-3  d-flex justify-content-center">
      <IconRotate
          :rotateClick="true"
          @svgClick="handleOpenSidebar"
          :src="getIconUrl('SidebarSimple.svg')"
          :size="24"
      />
    </div>
  </div>
  <div :class="{'p-lg-3 p-2 p-xl-4':!sidebarOpen,'p-lg-2':sidebarOpen}" >
    <div class="d-flex justify-content-lg-start justify-content-md">
      <div class="row px-2">
        <div class="col-xl col-12 pe-0 d-flex justify-content-center">
          <FpUserImg :clickGoTo="FPU_INFO_URL" :url="avtData" :size="50" :borderRound="100"
                     class="mt-2"/>
        </div>
        <div v-if='sidebarOpen' class="col-xl col-12 px-0 mt-2 text-content text-start px-2">
          <b>{{ username }}</b>
          <RoleRouter :userRoles="userRoles" @changeRole="changedRole">
            <template #modalClick>
                {{currentRole}}
            </template>
          </RoleRouter>
        </div>
      </div>
    </div>
    <div class="py-2">
      <SideBarMenu :tt-new-chat="ttNewChat" :currentRole="currentRole" :show-text="sidebarOpen" :pageName="pageName" @sidebarMenuClicked="onMenuClick"/>
    </div>
  </div>

</template>

<script>
import IconRotate from '../../components/FpIcon/FpIconRotate.vue'
import FpUserImg from '../../components/FpImg/FpUserImg.vue'
import SideBarMenu from '../../components/FpMenu/SideBarMenu.vue'
import {post} from "@/utils/dataQuery";
import {IMG_URL} from '@/utils/constants'
import RoleRouter from "@/components/FpRoleManagement/RoleRouter.vue";
import {getIconUrl, goToURL} from '@/utils/utils'
import {FPU_INFO_URL} from "@/router/URLs";

export default {
  components: {
    FpUserImg,
    SideBarMenu,
    IconRotate,
    RoleRouter
  },
  data() {
    return {
      sidebarOpen: true,
      extData: false,
      IMG_URL,
      userRoles: [],
      currentRole: '',
      defaultPage: '',
      FPU_INFO_URL,
      goToURL,
      username: '',
      pageName: ''
    }
  },
  computed: {
    avtData() {
      if (this.extData.avtData) {
        return this.extData.avtData.imgUrl;
      }
      return ''
    },
  },
  props:{
    ttNewChat:Number,
  },
  methods: {
    getIconUrl,
    async getRoleDefaultPages() {
      const res = await post("/dashboard/get_roles_and_pages", {})
      this.userRoles = res["res"]
      this.getSessionRole()
    },
    async getUserName() {
      const response = await post('/fp_user/get_detail_data', {});
      this.username = response.returnData.first_name
      this.extData = response.returnData.extData[0]
    },
    getSessionRole() {
      const sessionRoleData = sessionStorage.getItem('currentRole')
      if (sessionRoleData) {
        this.currentRole = sessionRoleData
      } else {
        sessionStorage.setItem("currentRole", this.userRoles[0]['0']);
        this.currentRole = this.userRoles[0]['0']
      }
    },
    changedRole(data) {
      this.getSessionRole()
      this.defaultPage = data
    },
    handleOpenSidebar() {
      this.sidebarOpen = !this.sidebarOpen
      this.$emit('onOpenSidebar')
    },
    getCurrentPage() {
       this.pageName = window.location.pathname;
    },
    onMenuClick(url)
    {
      this.pageName = url
    }
  },
  emits: ['onOpenSidebar'],
  mounted() {
    this.getRoleDefaultPages()
    this.getUserName()
    this.getCurrentPage()
  }
}
</script>

<style scoped>

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  padding: 8px 16px;
}
</style>
