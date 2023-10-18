<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center">
      <img :src="getIconUrl('FurUnitType.png')" alt="" style="width: 307px;height: 242px"/>
    </div>
    <PickBedroomWUnitType :bedroomProps="inqData.bedroom" :unitTypeProps="inqData.unitType"
                          @bedroomType="onBedroomUnitTypePick" class="mt-3" formClass="p-2"/>

    <div class="px-2">
      <FpFurniturePick :fullFur="inqData.furniture==='fully'" styleBtn="padding:1.5rem!important"
                       @furniturePick="onFurPick" :compact="true"/>
    </div>

  </div>


</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {getIconUrl} from "@/utils/utils";
import PickBedroomWUnitType from "@/components/FpForm/PickBedroomWUnitType.vue";
import FpFurniturePick from "@/components/FpForm/FpFurniturePick.vue";

export default {
  methods: {
    getIconUrl,
    onBedroomUnitTypePick(pickVal) {
      this.inqData.unitType = pickVal.unitType === '' ? 'ap' : pickVal.unitType
      this.inqData.bedroom = pickVal.bedroom !== undefined ? pickVal.bedroom : this.inqData.bedroom
    },
    onFurPick(fur) {
      this.inqData.furniture = fur
    },
  },
  components: {FpFurniturePick, PickBedroomWUnitType, FpIcon},
  props:{
    inqData:{
      type:Object,
      default:() => {}
    }
  }
}
</script>