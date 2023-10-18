<template>
  <swiper :pagination="paginationOptions" :navigation="true" :modules="modules" class="mySwiper h-100 border8" :loop="true" @slide-change-transition-end="onSlideChange" :initialSlide="initialSlideIndex">
    <swiper-slide v-for="(video, index) in videoIDs" :key="index">
      <p>Title {{index+1}}</p>
      <VideoPlayer :video-url="video" :loop="true" :autoplay="true" class="w-100 h-75" :play="index === currentSlide" v-if="currentSlide===index"/>
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from "swiper";
import VideoPlayer from "@/components/FpVideo/VideoPlayer.vue";

export default {
  components: {
    VideoPlayer,
    Swiper,
    SwiperSlide,
  },
  props: {
    initialSlideIndex: {
      type: Number,
      default: 0,
    },
    videoIDs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      modules: [Pagination, Navigation],
      currentSlide: 0,
      videoRefs: [],
    };
  },
  methods: {
    onSlideChange(slider) {
      this.currentSlide = slider.realIndex;
    },
  },
  computed: {
    initialSlide() {
      return this.initialSlideIndex;
    },
    paginationOptions() {
      return { type: 'fraction' };
    },
    autoplayIndexes() {
      return [this.initialSlide];
    },
  },
  mounted() {
    if (this.videoIDs.length) {
      this.videoRefs = this.videoIDs.map((_, index) => `youtube${index}`);
    }
  },
};
</script>
