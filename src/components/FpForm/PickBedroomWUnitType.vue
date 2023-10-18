<template>
  <div class="border rounded">
    <FormPick :size-icon="20" icon-class="gray-svg" :box-class="formClass" title=" Số phòng ngủ" groupBtnClass="p-2" :pickDefault="bedroom"
              :optionsVal="bedroomVal" titleIcon="bed.svg" @optVal="onBedRoomPick" :borderBox="false" />
    <div class="px-4 mb-2">
      <FpUnitType v-if="showUnitType" @unitTypePick="onUnitTypePick" :defaultUnitType="unitType"/>
    </div>
  </div>
</template>

<script>
import FormPick from "@/components/FpForm/FormPick.vue";
import FpUnitType from "@/components/FpForm/FpUnitType.vue";
const defaultBedRoomVal= [['1', '1'],['1+','1+'],['2', '2'],['2+','2+'], ['3', '3'],['3+','3+'], ['4','4'],['5', '5'], ['unitType', 'Khác']]
export default {
  components:{
    FormPick,
    FpUnitType
  },
  data()
  {
    return {
      bedroomVal:defaultBedRoomVal,
      showUnitType:false,
      bedroom:  '' ,
      unitType: ''
    }
  },
  methods:{
    onBedRoomPick(bedroom)
    {
      if(bedroom!=='unitType')
      {
        this.$emit('bedroomType',{bedroom:bedroom})
      }
      if(bedroom==='unitType')
      {
        this.showUnitType=!this.showUnitType
        this.unitType=''
        this.$emit('bedroomType',{bedroom:''})
      }
      else if(bedroom==='')
      {
        this.showUnitType=!this.showUnitType
        this.$emit('bedroomType',{bedroom:''})
      }
    },
    onUnitTypePick(unitType)
    {
      this.unitType=unitType
        if(unitType==='sh' || unitType==='off' || unitType==='stu')
        {
          this.bedroomVal=[]
          this.bedroom=''
          this.$emit('bedroomType',{bedroom:''})
        }
        else {
          this.bedroomVal=defaultBedRoomVal
        }
      this.$emit('bedroomType',{unitType:this.unitType})
    },
  },
  emits:['bedroomType'],
  props:{
    bedroomProps:{
      type: [String,Number],
    },
    unitTypeProps:{
      type:String,
    },
    formClass:{
      type:String
    }
  },
  mounted()
  {
    this.bedroom=this.bedroomProps
    this.unitType=this.unitTypeProps
    this.showUnitType = this.unitType !== '' && this.unitType!=='ap'
  },
  watch:{
    bedroomProps(newVal)
    {
        this.bedroom=newVal
    },
    unitTypeProps(newVal)
    {
      this.unitType=newVal
    }
  }
}
</script>