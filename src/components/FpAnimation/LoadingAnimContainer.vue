<template>
  <div class="container-fluid" style="margin-top: 150px" v-if="showLoading && !lockAnim" :class="containerClasses">
    <div class="d-flex justify-content-center align-items-center row">
      <MoreLoadingAnimation :size="size" :animation-name="animationName" class="col-auto"></MoreLoadingAnimation>
    </div>
    <p class="text-center font-weight-600 more-color">{{ loadingText }} </p>
  </div>
  <div v-else>
    <slot name="content">

    </slot>
  </div>
</template>

<script>
import {getAnimJson} from "@/utils/utils";
import MoreLoadingAnimation from "@/components/FpAnimation/MoreLoadingAnimation.vue";

export default {
  components: {MoreLoadingAnimation},
  data() {
    return {
      lockAnim: false,
      lockTimer: null,
    }
  },
  methods: {getAnimJson},
  props: {
    containerClasses:{
      type:String,
    },
    animationName: {
      type: String,
      default: 'More-Loading.json',
    },
    size: {
      type: Number,
      default: 150,
    },
    loadingText: {
      type: String,
      default: 'Chờ chút nhé...',
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    enableLoading: {
      type: Boolean,
      default: true,
    },
    animDelay: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    showLoading(){
      return this.isLoading && this.enableLoading;
    }
  },
  watch: {
    isLoading(val){
      if(!val){
        this.lockAnim = true;
        clearTimeout(this.lockTimer);
      } else {
        console.log('show anim', val)
        this.lockTimer = setTimeout(() => {
          this.lockAnim = false;
          console.log('open anim', val)
        }, this.animDelay);
      }
    }
  },
  mounted() {

  }
}
</script>
