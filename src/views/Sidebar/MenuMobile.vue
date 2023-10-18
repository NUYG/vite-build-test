<template>
  <template v-if="!checkPageNotHaveMenu">
    <div class="d-flex d-md-none justify-content-around w-100 position-fixed bottom-0 bg-white p-0" style="height: 9%;z-index: 200">
      <div v-for="(menu, index) in sideBarContent" class="tooltip-mobile d-flex align-items-center" :class="menu.class" :key="index" >
        <div @click="dropItemMobile(index)">
          <div @click="goToUrl(menu.href)" class=" d-block justify-content-center">
            <div class="col-12 d-flex justify-content-center">
              <ButtonBadge :badge-numb="totalNewChat(menu?.href)">
                <template #objectBadged>
                  <img class="dashboardIcon" :src="getIconUrl(checkCurrentPage(menu).icon)" alt="call_icon">
                </template>
              </ButtonBadge>
            </div>
            <span class="d-block d-xl-inline mobile-text-10 " :class="{'font-weight-600 more-color':checkCurrentPage(menu).activeText}">{{ menu.content }}</span>
          </div>
        </div>
        <div v-if="menu.children">
          <div v-show="currentMobileId===index" class="tooltip-mobile_items p-3 cursor-pointer">
            <div class="d-flex d-xl-none text-dark border-bottom p-2">{{ menu.content }}</div>
            <div v-for="(items,index) in menu.children" class="row p-2" :key="index">
              <div @click="goToUrl(items.href)" class="" :class="{'bg-currentSidebar':items.href===currentPage}">
                <span class="text-dark text-content">{{ items.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tooltip-mobile d-flex d-md-none  mt-3" @click="dropItemMobile(10)" v-if="!isGuest">
        <RoleRouter :userRoles="userRoles" @changeRole="changeRole" :show-dropdown-icon="false">
          <template #modalClick>
            <FpUserAvt classes=" object-fit-cover" :size="28"/>
          </template>
        </RoleRouter>
      </div>
      <div v-else class="mt-3 tooltip-mobile d-flex align-items-center">
        <div class="d-block justify-content-center ">
          <span class="col-12 d-flex justify-content-center">
              <FpUserAvt classes="dashboardIcon object-fit-cover" @click="$router.push('/login')" :is-guest="true"/>
          </span>
          <p  class="d-block d-xl-inline mobile-text-10">Đăng nhập</p>
        </div>
      </div>
    </div>
  </template>
  <RequestLogin v-if="showReqlogin" @popup-closed="showReqlogin=false"></RequestLogin>
</template>

<script>
import { defaultRolePage, roleSidebar } from "@/components/FpMenu/sidebarVal";
import { post } from "@/utils/dataQuery";
import {getIconUrl, goToURL, removeLocalItem, requestToSeverWhenUserCheckOut} from "@/utils/utils";
import FpUserAvt from "@/components/FpImg/FpUserAvt.vue";
import {Roles} from "@/utils/constants";
import RequestLogin from "@/views/Authencation/RequestLogin.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {ignoreMenuComp} from "@/models/menuMobile";
import RoleList from "@/views/Sidebar/RoleList.vue";
import RoleRouter from "@/components/FpRoleManagement/RoleRouter.vue";
import ButtonBadge from "@/components/FpButton/ButtonBadge.vue";
import {A_CHAT, S_CHAT} from "@/router/URLs";
import {mapGetters} from "vuex";
export default {
  components: {
    ButtonBadge,
    RoleRouter,
    RoleList,
    FpIcon,
    RequestLogin,
    FpUserAvt,
  },
  data() {
    return {
      sideBarContent: {},
      currentMobileId: -1,
      currentMobileLine: -1,
      userRoles: [],
      getIconUrl,
      currentRole: "",
      currentPage: "",
      showReqlogin:false,
      ignoreMenuComp
    };
  },
  computed:{
    checkPageNotHaveMenu()
    {
      const matched = this.$route.matched;
      return matched.every(route => {
            return ignoreMenuComp.includes(route.name)
      })
    },
    Roles() {
      return Roles
    },
    ...mapGetters(['getTotalNewPrcChat']),
  },
  methods: {
    goToURL,
    requestToSeverWhenUserCheckOut,
    async logOut() {
      // removeLocalItem("token");
      const tokenFirebase = window.localStorage.getItem("firebaseToken");
      if (tokenFirebase) {
        const res = await post("/firebase/unregister_device_key", { dToken: tokenFirebase });
        // console.log(res);
      }
      await this.requestToSeverWhenUserCheckOut()
      this.goToURL("/logout/");
    },
    totalNewChat(href)
    {
      return ( href && (href === S_CHAT || href === A_CHAT ) &&
      (this.currentPage !== S_CHAT && this.currentPage !== A_CHAT)) ? this.getTotalNewPrcChat : 0
    },
    changeRole(role) {
      sessionStorage.setItem("currentRole", role);
      this.$emit("changeRole", role);
      this.goToUrl(defaultRolePage[role]);
      this.dropItemMobile(10);
      this.getSessionRole();
    },
    goToUrl(url) {
      if(this.isGuest && url!=='/fp_guest/cart')
      {
        return this.showReqlogin=true
      }
      if (url) {
        this.$emit("menuMobileClick", url);
        this.$router.push(url);
        this.currentMobileId = -1;
      }
    },
    dropItemMobile(id) {
      this.currentMobileId = id === this.currentMobileId ? -1 : id;
    },
    menuSideBar(currentRole) {
      const sidebarData = roleSidebar[currentRole];
      if (Array.isArray(sidebarData)) {
        this.sideBarContent = sidebarData;
      } else {
        this.sideBarContent = Object.values(sidebarData);
      }
    },
    async getRoleDefaultPages() {
      const res = await post("/dashboard/get_roles_and_pages", {});
      if(res)
      {
        this.userRoles = res["res"];
      }
      this.getSessionRole();
    },
    getSessionRole() {
      if(this.isGuest)
      {
        return this.menuSideBar(this.currentRole);
      }
      const sessionRoleData = sessionStorage.getItem("currentRole");
      if (sessionRoleData) {
        this.currentRole = sessionRoleData;
      } else {
        sessionStorage.setItem("currentRole", this.userRoles[0]["0"]);
        this.currentRole = this.userRoles[0]["0"];
      }
      this.menuSideBar(this.currentRole);
    },
    isCurrentPage(menu, currentPage) {
      if (menu.href && menu.href === currentPage) {
        return true;
      } else if (menu.childrenGroup) {
        return menu.childrenGroup.includes(currentPage);
      } else if (menu.children) {
        return menu.children.some((obj) => obj.href === currentPage);
      }
      return false;
    },
    checkCurrentPage(menu) {
        return  this.isCurrentPage(menu,this.currentPage) ? {icon:menu.iconActive,activeText:true} : {icon: menu.icon , activeText: false}
    },
    setUserRoleDefault()
    {
      if(this.isGuest)
      {
        this.menuSideBar(Roles.Guest); this.currentRole=Roles.Guest
      }
      else {
        this.getRoleDefaultPages()
      }
    }
  },
  watch: {
    "$route.path"(newPath) {
      this.currentPage = newPath;
      removeLocalItem('unitFilter')
    },
    isGuest()
    {
      this.setUserRoleDefault()
    }
  },
  props:{
    isGuest:{
      type:Boolean,
      default:false
    }
  },
  mounted() {
    this.currentPage = window.location.pathname;
    this.setUserRoleDefault()
  },
  emits: ["menuMobileClick", "changeRole"],
};
</script>

<style scoped>
@media only screen and (max-width: 767px) {
  .userMenu {
    left: -160px !important;
  }
  .mobile-text-10{
    font-size: 10px !important;
  }
}

</style>
