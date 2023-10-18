<template>
  <div class="inqPopup" >
    <div class="row d-flex justify-content-between">
        <div class="col overflow-hidden">
          <FpIcon srcIcon="PencilPick.svg" :size="18"/>
          <span class="text-center mt-3 mb-2"><b> Chọn một nhu cầu để chỉnh sửa</b></span>
        </div>
        <div class="col-auto" @click="selectOption(false)">
          <FpIcon srcIcon="times-solid.svg" :size="12"/>
        </div>
    </div>

    <div class="cursor-pointer  p-2 sidebar-menu_item"  v-for="(option,index) in options" :key="index" @click="selectOption(option.id)">
      #{{ index + 1 }} {{ option.name }}
    </div>
  </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";

export default {
  components: {FpIcon},
  props: {
    options: Array
  },
  methods: {
    selectOption(option) {
      this.$emit('optionSelected', option);
    }
  },
  emits:['optionSelected']
};
</script>

<style scoped>
.inqPopup {
  background: #FFFFFF;
  padding: 16px;
  position: fixed;
  z-index: 100;
  right: 30%;
  bottom: 20%;
  font-size: 15px;
  border-radius: 10px;
  width: 500px;
  height: 400px;
  overflow-y: auto;
}
@media screen and (max-width: 768px)
{
  .inqPopup {
    width: 320px !important;
    right:9% !important;
    bottom: 20% !important;
  }
}
@media screen and  (max-width: 992px) {
  .inqPopup {
    right:18%;
    bottom: 40%;
    width: 400px;
  }
}

</style>
