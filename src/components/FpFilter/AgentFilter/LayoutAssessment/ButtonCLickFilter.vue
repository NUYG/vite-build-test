<template>
  <ButtonView :class="btnClass"
              v-for="(val,index) in btnValue " :key="index" v-bind="val"
              :btnHeight="btnHeight"
              :activeBtn="checkBtnClicked(val.id)"
              :textSize="textSize"
              @btnClick="handleCLick"
              :status="btnStatus"
              on-btn-color="#5E52FF"
  />
</template>

<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";

export default {
  computed: {

  },
  data() {
    return {
      selectedList:[]
    }
  },
  props: {
    btnValue: {
      type: Array,
      default: () => ([])
    },
    selectedOne: {
      type: Boolean,
      default: false
    },
    btnClass: {
      type: String,
      default: ''
    },
    btnHeight: {
      type: Number,
      default: 100
    },
    textSize: {
      type: Number,
      default: 16
    },
    defVal:{
      type:Array,
      default:() => []
    },
    btnStatus:{
      type:String,
      default:'gray-btn'
    }
  },
  components: {
    ButtonView
  },
  emits:['btnClick'],
   mounted() {
     this.selectedList=this.defVal
  },
  watch:{
    defVal(newVal)
    {
      this.selectedList=newVal
    }
  },
  methods: {
    checkBtnClicked(id)
    {
      if(this.selectedOne)
      {
        return id===this.selectedList
      }
      else {
        return this.selectedList.includes(id)
      }
    },
    // setActiveBtn(data)
    // {
      // this.btnValue.map(val => {
      //   if (!this.selectedOne) {
      //     if (val.id === data) {
      //       val.activeBtn = !val.activeBtn
      //     }
      //   } else {
      //     val.activeBtn = !val.activeBtn && val.id === data;
      //   }
      // })
    // },
    setPickedItem(data)
    {
      if(!this.selectedOne)
      {
        if (this.selectedList.includes(data)) {
          this.selectedList.splice(this.selectedList.indexOf(data), 1);
        } else {
          this.selectedList.push(data);
        }
        this.$emit('btnClick', this.selectedList)
      }
      else{
        this.selectedList= this.selectedList === data ? '' : data
        this.$emit('btnClick', data)
      }
    },
    handleCLick(data) {
      // this.setActiveBtn(data)
      this.setPickedItem(data)
    }
  },

}
</script>
