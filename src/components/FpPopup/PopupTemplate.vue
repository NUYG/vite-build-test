<template>
  <div class="popup" @click="closePopup" :class="popupClasses" :style="`z-index:${popIndex} !important`">
    <div class="popup-content" :class="popupClass">
      <div class="content-wrapper" @click.stop :class="contentClass">
        <slot name="contentPopup"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    popupClass:{
      type:String
    },
    boxPopupClass:{
      type:String
    },
    contentClass:{
      type:String
    },
    popupBackdropColor:{
      type:Boolean,
      default:true
    },
    popIndex:{
      type:Number,
      default:999
    }
  },
  computed:{
    popupClasses()
    {
      return this.boxPopupClass + ' ' + (this.popupBackdropColor ? ' popup-bg ' : 'no-popup-bg')
    }
  },
  methods: {
    closePopup() {
        this.$emit('closePopup')
    }
  },
  emits:['closePopup']
}
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
}
.popup-bg{
  background-color: rgba(0, 0, 0, 0.1);
}
.no-popup-bg{
  background-color: rgba(0, 0, 0, 0);
}
.shadow-popup {
  box-shadow:  0 0 16px 0 rgba(0, 0, 0, 0.10);
}

</style>
