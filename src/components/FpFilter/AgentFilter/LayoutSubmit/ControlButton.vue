<template>
  <div class="row">
    <div class="col-8">
      <ButtonView id="submit" class="w-100" content="Lọc" status="warning" @btnClick="handleClick"/>
    </div>
    <div class="col-4">
      <ButtonView  @btnClick="handleClick" id="refreshData" status="default" :btnIcon="getIconUrl('return.svg')" />
    </div>

  </div>
</template>


<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl} from "@/utils/utils";

export default {
  components:{
    ButtonView
  },
  methods:{
     getIconUrl,
    handleClick(data)
    {
      if(data==='submit')
      {
        return this.$emit('onSubmit',{['submit']:true})
      }
      if(data==='refreshData')
      {
        return this.$emit('onSubmit',{['refreshData']:true})
      }
    }
  },

}
</script>