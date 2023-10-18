<template>
  <div class="dropdown" :class="dropdownClass">
    <div :class="dropdownToggleClass" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
         aria-expanded="false">
      <slot name="modalClick"></slot>
    </div>
    <RoleList :listItem="userRoles" @changeRole="changeRole"/>
  </div>
</template>


<script>
import RoleList from "@/views/Sidebar/RoleList.vue";

export default {
  components:{
    RoleList
  },
   props: {
      userRoles: {
         type: Array,
         default: () => ([])
      },
     dropdownDirection: {
       type: String,
       default: 'down'
     },
     showDropdownIcon: {
       type: Boolean,
       default: true
     }
   },
  computed:{
    dropdownClass() {
      return {
        'dropdown': true,
        'dropup': this.dropdownDirection === 'up',
        'dropright': this.dropdownDirection === 'right',
        'dropleft': this.dropdownDirection === 'left'
      };
    },
    dropdownToggleClass() {
      return {
        'dropdown-toggle': true,
        'hide-icon': !this.showDropdownIcon
      };
    }

  },
   data() {
      return {}
   },
   emits: ['changeRole'],
   methods: {
      changeRole(role) {
          this.$emit('changeRole',role)
      },
   },
   mounted() {
   }
}
</script>

<style scoped>
.hide-icon::after {
  display: none;
}
</style>
