<template>
 <DuoLayout>
   <template #comp1>
      <DuoLayout>
        <template #comp1>
          <FpItemsFurniture v-if="bedRoom>0" :amenities="bedRoom" :furIcon="getIconUrl('bed-solid.svg')" class="mt-3" />
        </template>
        <template #comp2>
          <FpItemsFurniture v-if="bathroom>0" :amenities="bathroom" :furIcon="getIconUrl('bath-solid.svg')" class="mt-3" />
        </template>
      </DuoLayout>
   </template>
   <template #comp2>
     <DuoLayout>
       <template #comp1>
         <FpText :text="sizeUnit" classStyle="text-gray" tag="h6" class="mt-3"/>
       </template>
       <template #comp2>
          <FpItemsFurniture v-if="furniture" amenities="" :furIcon="getIconUrl('furniture.svg')" class="mt-3"/>
       </template>
     </DuoLayout>
   </template>
 </DuoLayout>
</template>


<script>
import FpItemsFurniture from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpItemsFurniture.vue";
import FpText from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpText.vue";
import DuoLayout from "@/components/FpLayout/DuoLayout.vue";
import {getIconUrl} from "@/utils/utils";
export default {
   methods: {getIconUrl},
  components:{
    FpText,
    DuoLayout,
    FpItemsFurniture,
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
      type:Boolean,
      default:false
    }
  },computed:{
    sizeUnit()
    {
      return `${this.size}m2`
    }
  }
}
</script>