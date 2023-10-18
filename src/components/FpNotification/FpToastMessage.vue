<template>
  <div v-if="show" aria-live="polite" aria-atomic="true" class="toast-container">
    <div :class="['toast', 'show', `fade-top`]"  role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">{{ title }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body text-center">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    };
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    closeTimer: {
      type: Number,
      default: 2000,
    },
    fadeDirection:{
      type:String,
      default:''
    }
  },
  methods: {},
  watch: {},
  mounted() {
    setTimeout(() => {
      this.show = false;
    }, this.closeTimer);
  },
}
</script>

<style scoped>
.toast-container{
  position: absolute;
  top:25%;
  left:50%;
}
.fade-top {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
</style>