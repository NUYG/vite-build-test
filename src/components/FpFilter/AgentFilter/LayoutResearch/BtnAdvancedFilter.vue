<template>
  <ButtonView status="default" onBtnColor="orange" :activeBtn="hasFiltered"  :btnIcon="getIconUrl('plus-solid.svg')"
              @btnClick="onAdvanceClick"/>
</template>


<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl} from "@/utils/utils";

export default {
  data() {
    return {
      clicked:false
    }
  },
  props:{
    hasFiltered:{
      type:Boolean,
      default:false
    }
  },
  methods: {
     getIconUrl,
    onAdvanceClick() {
      this.clicked=!this.clicked
      this.$emit('advanceClicked',{['advanceClick']:this.clicked})
    }
  },
  components: {
    ButtonView
  }
}
</script>