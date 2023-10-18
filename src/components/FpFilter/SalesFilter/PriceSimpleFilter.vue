<template>
      <ButtonCLickFilter :selectedOne="true" :btnValue="value" :textSize="14" btn-class="mx-2 mt-3 border-0 bg-white"  @btnClick="onBtnClick" btn-status="default"/>
</template>

<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
import ButtonCLickFilter from "@/components/FpFilter/AgentFilter/LayoutAssessment/ButtonCLickFilter.vue";
export default {
  components:{ButtonCLickFilter, ButtonView},
  props:{
    renting:{
      type:Boolean,
      default:true
    }
  },
  data()
  {
    return {
      value:[]
    }
  },
  methods:{
    setPricePickValue(renting)
    {
      this.value = []
      const step = renting ? 5 : 3
      const unit = renting ? 'Tr' : 'Tỷ'
        for(let i = 0 ; i < 6 ; i++)
        {
          if(i<5) {
            this.value.push({ id: i + 1, value:[i * step,(i +1)* step], content:`${i * step} - ${(i +1)* step} ${unit}` })
          }
          else {
            this.value.push({ id: i + 1, value:[ i * step + 1 ,100],  content:`Trên ${i * step} ${unit}` })
          }
        }
    },
    onBtnClick(id) {
      const filteredItem = this.value?.filter(item => item.id === id)[0];
      const pickValue = filteredItem?.value || [0, 0];
      const formattedValue = this.formatValue(pickValue[0],pickValue[1], this.renting);

      this.$emit('fastPickPrice', formattedValue);
    },
    formatValue(from, to, renting) {
      return {
        rentingPriceTo : renting ? to : undefined ,
        rentingPriceFrom : renting ? from : undefined ,
        sellingPriceTo : !renting ? to : undefined ,
        sellingPriceFrom : !renting ? from : undefined ,
      }
    }
  },
  emits:['fastPickPrice'],
  watch:{
    renting(newVal)
    {
      this.setPricePickValue(newVal)
    }
  },
  mounted() {
    this.setPricePickValue(this.renting)
  }
}
</script>
