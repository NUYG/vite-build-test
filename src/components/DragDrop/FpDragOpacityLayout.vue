<template>
  <div   @dragenter.prevent="dragEnterHandler"
         @dragleave.prevent="dragLeaveHandler"
         @drop.prevent="dropHandler"
         :class="dragStyleClass" >
    <div class="w-100 h-100">
      <slot name="defaultContent"></slot>
    </div>
    <div class="h-100 w-100 float-content" v-show="isDragging">
      <slot name="floatContent"></slot>
    </div>
  </div>
</template>

<script>
import ImgDropZone from "@/components/FpImg/ImgDropZone.vue";

export default {
  components: {ImgDropZone},
  data()
  {
    return {
      isDragging : false
    }
  },
  props:{
    draggingClass:{
      type:String
    },
    dragOverClass:{
      type:String
    },
    dragBoxClass:{
      type:String
    },
  },
  computed:{
    dragStyleClass() {
      return (this.isDragging ? this.draggingClass : this.dragOverClass) + ' ' + this.dragBoxClass;
    },
  },
  methods:{
    dragEnterHandler(event) {
      if (!this.$el.contains(event.relatedTarget)) {
        this.isDragging = true;
        console.log('drag vào');
      }
    },
    dragLeaveHandler(event) {
      if (!this.$el.contains(event.relatedTarget)) {
        this.isDragging = false;
        console.log('drag ra');
      }
    },
    dropHandler() {
      this.isDragging = false;
      console.log('drag drop');
    },
  }
}
</script>
<style scoped>
.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;
}

.z-1 {
  z-index: 1;
}

.z-3 {
  z-index: 3;
}

.float-content {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
}
</style>

