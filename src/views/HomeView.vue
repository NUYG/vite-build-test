<template>
</template>

<script>
import {goToURL, hasLogin} from "@/utils/utils";
import {post} from "@/utils/dataQuery";
import {defaultRolePage} from "@/components/FpMenu/sidebarVal";
import {FpGuestCart, FpGuestLobby} from "@/router/URLs";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {},
  computed: {
    checkAuth() {
      return this.getIsLoggedIn
    },
    ...mapGetters(['getIsLoggedIn']),
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(['checkLoginStatus']),
    async homeRedirect() {
      // if (this.checkAuth) {
      //   // localstorage exist sever token
      //   await this.getRoleDefaultPages();
      // } else {
      //   // goToURL('/login');
      this.$router.push(FpGuestLobby)
      // }
    },
    async getRoleDefaultPages() {
      const res = await post("/dashboard/get_roles_and_pages", {})
      if (!res || !res.res) {
        return goToURL('/login');
      }
      if (Object.keys(res.res).length > 0) {
        this.userRoles = res["res"][0]['0'];
        this.$router.push(defaultRolePage[this.userRoles]);
        return;
      }
      goToURL('/admin/');
    },
  },
   async mounted() {
     await this.checkLoginStatus()
    if (this.checkAuth) {
      await this.getRoleDefaultPages()
    } else {
      await this.homeRedirect();
    }
  }
}
</script>
