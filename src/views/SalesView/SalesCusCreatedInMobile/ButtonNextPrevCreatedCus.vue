<template>
  <div class="row mt-4 d-flex justify-content-around" >
    <ButtonView v-if="prevContent" status="gray-btn" :content="prevContent" class="col-auto p-2 px-3 new-sales-step-7" @click="handleClick('prev')"/>
    <ButtonView v-if="nextContent&& nextContent !==''" status="more-btn" :content="nextContent" class="col-auto p-2 px-5 border8 new-sales-step-4 new-sales-step-6a new-sales-step-7a new-sales-step-11" @click="handleClick('next')"/>
  </div>
</template>

<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
export default {
  components:{
    ButtonView
  },
  props:{
    prevContent:{
      type:String,
    },
    nextContent:{
      type:String,
    }
  },
  methods:{
    handleClick(step)
    {
      this.$emit('stepClick',step)
    }
  },
  emits:['stepClick']
}
</script>