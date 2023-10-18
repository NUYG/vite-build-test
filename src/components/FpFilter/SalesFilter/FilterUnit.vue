<template>
  <div class="row">
      <ButtonCLickFilter
          :selectedOne="selectedOne" :btnValue="btnValue"
          :btnClass="btnClass" @btnClick="onSelected" :textSize="14" :defVal="defaultBtnCLick"/>
  </div>
</template>

<script>
import ButtonCLickFilter from "@/components/FpFilter/AgentFilter/LayoutAssessment/ButtonCLickFilter.vue";
export default {
  components:{
    ButtonCLickFilter
  },
  data()
  {
    return {
      btnValue:[]
    }
  },
  props:{
    btnValueProps:{
      type:Array,
      default:() => []
    },
    btnClass:{
      type:String,
      default:'col-auto m-2'
    },
    fieldName:{
      type:String
    },
    selectedOne:{
      type:Boolean,
      default:true
    },
    defVal:{
      type:Array,
      default:() => []
    }
  },
  mounted() {
    this.btnValue=this.btnValueProps
  },
  computed:{
    defaultBtnCLick()
    {
      return this.defVal || []
    }
  },
  watch:{
    btnValueProps(newVal)
    {
      this.btnValue=newVal
    }
  },
  methods:{
    onSelected(val)
    {
      this.$emit('unitPickedFilter',val,this.fieldName)
    },
  },
  emits:['unitPickedFilter']

}
</script>
