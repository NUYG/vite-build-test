<template>
  <SalesProjectPick :is-guest="true">
  </SalesProjectPick>
</template>

<script>
import MenuMobile from "@/views/Sidebar/MenuMobile.vue";
import GuestCartView from "@/views/GuestPage/GuestCart/GuestCartView.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import RequestLogin from "@/views/Authencation/RequestLogin.vue";
import FpDefLayout from "@/views/FpDefLayout.vue";
import SalesProjectPick from "@/views/SalesView/SalesProjectPick.vue";

export default {
  components: {
    SalesProjectPick,
    FpDefLayout,
    RequestLogin,
    GuestCartView,
    MenuMobile,
    ButtonView
  },

}
</script>