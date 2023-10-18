<template>
  <div>
      <InformationDetail :bedRoom="bedRoom" :size="size" :bathroom="bathroom" :furniture="unitFur"/>
  </div>
</template>


<script>
import InformationDetail from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardGroupItems/InformationDetail.vue";
export default {
  components:{
    InformationDetail
  },
  computed:{
    unitFur()
    {
     return this.furniture === 'fully'
    }
  },
  props:{
    bedRoom:{
      type:Number,
      default:0
    },
    bathroom:{
      type:Number,
      default:0
    },
    size:{
      type:Number,
      default:0
    },
    furniture:{
      type:String,
      default:''
    }
  }
}
</script>