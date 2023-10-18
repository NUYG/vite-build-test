<template>
  <ul class="dropdown-menu cursor-pointer" aria-labelledby="dropdownMenuButton1">
    <li v-for="(item,index) in listItem" :key="index" @click="changeRole(item[0])">
      <a class="dropdown-item">{{ item[0] }}</a>
    </li>
<!--      <a class="dropdown-item" @click="goToUrl(FpHoDRequest)">Hod</a>-->
    <li class="dropdown-item border-top" @click="goToUrl(FPU_INFO_URL)">Thông tin cá nhân</li>
    <li class="dropdown-item" @click="goToUrl(FPU_SETTING)">Tùy chỉnh</li>
    <li class="dropdown-item" @click="onLogOut"><a>Đăng Xuất</a></li>
  </ul>
</template>

<script>
import {defaultRolePage} from "@/components/FpMenu/sidebarVal";
import {goToURL, requestToSeverWhenUserCheckOut} from "@/utils/utils";
import {post} from "@/utils/dataQuery";
import {FPU_INFO_URL,FPU_SETTING,FpHoDRequest} from "@/router/URLs";
export default {
  props: {
    listItem: {
      type: Array,
      default: () => []
    }
  },
  data()
  {
    return {
      FPU_INFO_URL,
      FPU_SETTING,
      FpHoDRequest
    }
  },
  methods: {
    requestToSeverWhenUserCheckOut,
    async onLogOut() {
      // localStorage.setItem("token", '');
      // sessionStorage.setItem("currentRole", '');
      const tokenFirebase = window.localStorage.getItem('firebaseToken')
      if (tokenFirebase) {
        await this.sendTokenToSeverRm(tokenFirebase)
      }
      await this.requestToSeverWhenUserCheckOut()
      goToURL('/logout/');
    },
    async sendTokenToSeverRm(token) {
      const res = await post('/firebase/unregister_device_key', token)
    },
    changeRole(role) {
      sessionStorage.setItem("currentRole", role);
      this.$emit('changeRole', role);
      this.goToUrl(defaultRolePage[role]);

    },
    goToUrl(url) {
      this.$router.push(url);
    },
  },
  emits: ['changeRole'],
  mounted() {

  }
}
</script>
