<template>
  <div class="dropdown" :class="dropdownClass">
    <div :class="dropdownToggleClass" type="button" :id="id" data-bs-toggle="dropdown"
         aria-expanded="false">
      <slot name="modalClick"></slot>
    </div>
    <div class="dropdown-menu cursor-pointer border-0 custom-dropdown-menu" :aria-labelledby="id" :class="{'box-shadow':boxShadow}">
      <slot name="dropContent"></slot>
    </div>
  </div>
</template>

<script>
import RoleList from "@/views/Sidebar/RoleList.vue";
export default {
  components:{
    RoleList
  },
  props: {
    id:{
      type:[String,Number],
      default:'dropdownMenuButton1'
    },
    dropdownDirection: {
      type: String,
      default: 'down'
    },
    showDropdownIcon: {
      type: Boolean,
      default: true
    },
    boxShadow:{
      type:Boolean,
      default:true
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
  methods: {
  },
  mounted() {
  }
}
</script>

<style scoped>
.hide-icon::after {
  display: none;
}
.box-shadow{
  box-shadow: 0 6px 17px rgba(0, 0, 0, 0.25)
}
.custom-dropdown-menu {
  padding: 10px;
}
</style>
