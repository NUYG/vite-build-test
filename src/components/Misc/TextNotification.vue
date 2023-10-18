<template>
   <div v-if='message' class="text_notification" :style=" `animation: slide-up ${(closeNotiTime)/1000}s ease;`" :class="toastClass">
      <p class="col-auto" :class="msgClass">{{ message }}</p>
   </div>
</template>

<script>
export default {
   data() {
      return {}
   },
   props: {
      message: {
         type: String,
         default: ''
      },
      closeNotiTime:{
        type:Number,
        default: 1000
      },
     msgClass:{
        type:String
     },
     toastClass:{
       type:String
     }
   },
   computed: {},
   methods: {},
   mounted() {
      setTimeout(() => {
         this.$emit('close')
      }, this.closeNotiTime)
   },
   emits: ['close'],
}
</script>

<style scoped>
</style>
