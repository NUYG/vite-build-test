<template>
  <div class='d-flex justify-content-center w-100 position-relative' ref="mySwipeBox" :style="calculateImageHeight()">
    <swiper :thumbs="thumbsConfig" ref="mySwiper" :navigation="true" :modules="modules" :slides-per-view="1" :loop="swipeLoop" class="mySwiper h-100 w-100"
            :pagination=" showCurrentSlide ? {type: 'fraction'} : false" @slide-change="onSwipeChange" :keyboard="{enabled: true}">
      <swiper-slide v-for='(i, index) in img' :key='index'>
        <UnitImg :imgSrc="i" :ratioImg="[3,2]" @click='openSlideShow(index)'
                 :styleImg="imgStyle"  :ttImg="ttImg"
                 :currentImg="index+1"
        ></UnitImg>
      </swiper-slide>
    </swiper>
    <div class="project-tag px-3 w-100 text-white text-content border8" v-if="pjUnitText">
      <div class="d-flex justify-content-between mt-5 w-100 position-project-info" >
         <span class="col-auto">
           {{pjUnitText}}
        </span>
      </div>
    </div>
    <div v-if="canDownShareImg" class='position-absolute w-100' style='border-radius: 0 0 8px 8px; z-index: 998; height: 20%; cursor: pointer; bottom: 0; background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));'>
      <ImgAction :img='img' :uploadBtn='uploadBtn' :shareBtn='shareBtn' :downloadBtn='downloadBtn' :shareTxt="shareTxt" />
    </div>
    <slot name="extTag">

    </slot>
  </div>
  <div class="mt-3" v-if="showThumb" ref="swiperThumbox">
    <swiper @swiper="setThumbsSwiper" :modules="modules" class="mySwiper" :options="thumbsConfig" :slidesPerView="slidesPerView"  :lazy="true">
      <swiper-slide v-for='(i, index) in img' :key='index' class="thumb-swiper" >
        <div class="thumb-container">
          <img :src="IMG_URL + i" alt="swiper-thumb" class="thumb-image" style='object-fit: contain'  loading="lazy">
        </div>
      </swiper-slide>
    </swiper>
  </div>
  <div v-if='slideShow'>
    <SlideShow @close='slideShow=false' :imgs='img' :activeIndex='currentSlide'/>
  </div>

</template>

<script>
import {Swiper, SwiperSlide} from "swiper/vue";
import {IMG_URL} from "@/utils/constants";
import SlideShow from "@/components/FpImg/SlideShow.vue";
import ImgAction from "@/components/FpImg/ImgAction.vue";
import {FreeMode, Navigation, Thumbs, Pagination, Keyboard} from "swiper";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import 'swiper/css';
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import FpIcon from "@/components/FpIcon/FpIcon.vue";

export default {
  components: {
    FpIcon,
    UnitImg,
    SlideShow,
    ImgAction,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      IMG_URL,
      slideShow: false,
      currentSlide: 0,
      mySwiper: null,
      modules: [Keyboard,FreeMode, Navigation, Thumbs,Pagination],
      thumbsSwiper: null,
      thumbsConfig: {},
      slidesPerView:1
    }
  },
  props: {
    img: {
      type: Array,
      default: () => ([]),
    },
    uploadBtn: {
      type: Boolean,
      default: false
    },
    shareBtn: {
      type: Boolean,
      default: false
    },
    downloadBtn: {
      type: Boolean,
      default: false
    },
    shareTxt: {
      type: String,
      default: '',
    },
    ratioImg: {
      type: Array,
      default: () => [3, 2],
    },
    canDownShareImg: {
      type: Boolean,
      default: false
    },
    showThumb: {
      type: Boolean,
      default: false
    },
    calHeight:{
      type: Boolean,
      default: true
    },
    imgStyle:{
      type:String,
      default:'object-fit: cover'
    },
    pjUnitText:{
      type:String
    },
    ttImg:{
      type:Number
    },
    showCurrentSlide: {
      type:Boolean
    },
    swipeLoop:{
      type:Boolean,
      default:true
    },
    imgIndexEmit:{
      type:Number
    },
  },
  methods: {
    setThumbsSwiper(swiper) {
      this.thumbsSwiper = swiper;
    },
    openSlideShow(index) {
      this.currentSlide = index;
      this.slideShow = true;
    },
    calculateImageHeight() {
      if(this.calHeight)
      {
        if (this.$refs.mySwipeBox && this.$refs.mySwipeBox.clientWidth) {
          const imgSize = this.$refs.mySwipeBox.clientWidth;
          const heightImg = (imgSize * this.ratioImg[1]) / this.ratioImg[0];
          return imgSize<1000 ? `height:${heightImg}px;` : "height:auto;";
        }
        return `height:100%;`;
      }
    },
    calculateSlidePerView() {
        if (this.$refs.swiperThumbox && this.$refs.swiperThumbox.clientWidth) {
          const containerWidth = this.$refs.swiperThumbox.clientWidth
          const thumbWidth = 70;
          const spaceBetween = 3;
          const availableWidth = containerWidth - ((this.img.length - 1) * spaceBetween);
          this.slidesPerView = Math.floor(availableWidth / thumbWidth);
        }
    },
    handleResize() {
      this.calculateImageHeight();
      this.calculateSlidePerView()
    },
    observeDivResize() {
      const targetElement = this.$refs.mySwipeBox;
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.handleResize();
        }
      });
      this.resizeObserver.observe(targetElement);
    },
    onSwipeChange(swipe)
    {
      if(this.imgIndexEmit && swipe.realIndex===this.imgIndexEmit)
      {
        this.$emit('swiperEndpoint')
      }
    }
  },
  watch: {
    img: {
      handler(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) {
          return;
        }
        this.$nextTick(() => {
          this.mySwiper?.update();
        });
      },
      deep: true,
    },
    thumbsSwiper: {
      handler(val) {
        this.currentSlide = val.realIndex;
        this.calculateSlidePerView();

      },
      deep: true,
    },
  },
  emits:['swiperEndpoint'],
  mounted() {
    this.observeDivResize();
    this.calculateImageHeight();
    window.addEventListener("resize", this.handleResize);
    this.thumbsConfig = {
      swiper: this.thumbsSwiper,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      spaceBetween: 5,
    };
    this.calculateSlidePerView()
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.resizeObserver.disconnect()
  },
}
</script>

<style>
.thumb-container {
  width: 70px;
  height: 50px;
  margin-right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-swiper {
  height: 70px !important;
  transition: margin-top 0.3s ease;
}

.swiper-slide-thumb-active .thumb-container {
  border: 2px solid black !important;
}

.swiper-pagination-fraction {
  color: white !important;
}

.swiper-pagination{
  display: flex !important;
  justify-content: end !important;
  padding:0 15px !important;
  font-size: 14px;
}

.project-tag{
  bottom: 0;
  height: 30%;
  position:absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.7))
}

.position-project-info{
  margin-bottom: 20px;z-index: 10
}
@media only screen and (min-width: 1200px) {
  .position-project-info{
    margin-bottom: 10px;z-index: 10
  }
}

</style>
