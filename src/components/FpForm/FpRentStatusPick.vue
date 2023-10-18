<template>
  <div class="d-flex justify-content-between row new-sales-step-3">
    <div class="col-6">
      <div class="d-flex justify-content-between p-4 border border-gray rounded border8" :class="{'button-blue-teal':rentPick}"
           @click="onRentSttPick(true)">
          <b class="mt-1">Thuê nhà</b>
        <div class="p-2 rounded-circle border border-2 border-dark d-flex justify-content-center"
             style="width: 30px; height: 30px;">
            <FpIcon src="/static/icons/checkblack.svg" v-if="rentPick"/>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="d-flex justify-content-between border border-gray rounded p-4 border8" :class="{'button-blue-teal':!rentPick && rentPick!==''}"
           @click="onRentSttPick(false)">
        <b class="mt-1">Mua nhà</b>
        <div class="p-2 rounded-circle border border-2 border-dark d-flex justify-content-center"
             style="width: 30px; height: 30px;">
            <FpIcon src="/static/icons/checkblack.svg" v-if="!rentPick && rentPick!==''"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
export default {
  components:{
    FpIcon
  },
  data()
  {
    return{
      rentPick:this.rentProps,
    }
  },
  methods:{
    onRentSttPick(check)
    {
      if(!this.disableChange)
      {
        this.rentPick=check
        this.$emit('rent',check)
      }
    }
  },
  props:{
    rentProps:{
      type:Boolean,
      default:true
    },
    disableChange:{
      type:Boolean,
      default:false
    }
  },
  watch:{
    rentProps(){
      this.rentPick=this.rentProps
    }
  },
  emits:['rent']
}
</script>
