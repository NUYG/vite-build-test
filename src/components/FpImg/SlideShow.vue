<template>
   <div @click='closeModal' class="overlay">
      <div class="close-btn">&times;</div>
   </div>
   <div  class="d-flex justify-content-center align-items-center w-100 h-75 position-fixed" style="top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 999">
     <FpSwiperWContent class="w-100 h-100" swiperClass="h-100" :hasNavigation="true" :keyboardNavigation="true" :activeIndex="imgActiveIndex" >
          <template #swiperSlide>
              <swiper-slide  v-for="(img, index) in imgs" :key="index" class="d-flex justify-content-center w-100 h-100 " >
                <img :alt="'img' + index" class="img-fluid h-100 col-xxl-5 col-lg-6 col-md-8 col-12 m-auto" :src="IMG_URL + img" style='object-fit: contain'/>
              </swiper-slide>
          </template>
     </FpSwiperWContent>
   </div>
</template>

<script>
import {IMG_URL} from "@/utils/constants";
import FpSwiperWContent from "@/components/FpSwiper/FpSwiperWContent.vue";
import {SwiperSlide , useSwiper} from 'swiper/vue';
export default {
   components: {
     FpSwiperWContent,
     SwiperSlide
   },
   data() {
      return {
         show: true,
         IMG_URL,
         imgActiveIndex:0
      }
   },
  props: {
     imgs: {
        type: Array,
        default: () => ([]),
     },
     activeIndex: {
        type: Number,
        default: 0,
     },
  },
  computed: {
    getStyle() {
      const width = this.width > 0 ? `${this.width}px` : `100%`
      return `${width} ; height:${this.height}px;`
    }
  },
   methods: {
      closeModal() {
         this.show = false;
         this.$emit("close");
      },
      closeModalOnEscape(event) {
        if (event.keyCode === 27) {
          this.closeModal();
        }
      },
   },
   emits: ['close'],
   mounted() {
      document.addEventListener("keydown", this.closeModalOnEscape);
   },
  created() {
    this.imgActiveIndex = this.activeIndex
  },
  beforeUnmount() {
      document.removeEventListener("keydown", this.closeModalOnEscape);
   },
}
</script>


<style scoped>


</style>
