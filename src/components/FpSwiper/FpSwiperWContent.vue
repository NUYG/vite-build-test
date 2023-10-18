<template>
  <div class="w-100 overflow-hidden">
    <swiper ref="swiperContainer" :lazy="true" :navigation="hasNavigation" :class='swiperClass' :pagination='{"dynamicBullets": true}' :modules="modules" :slides-per-view="1" class="mySwiper"
            pagination-dynamic-bullets="true"  :autoplay="autoplayTime ? { delay: autoplayTime } : false" :initialSlide="activeIndex" :keyboard="{enabled: true}">
      <slot name="swiperSlide">
      </slot>
    </swiper>
  </div>
</template>
<script>
import {Swiper} from 'swiper/vue';
import {Keyboard,Autoplay, Pagination,Navigation} from 'swiper';

export default {
  components: {
    Swiper,
  },
  props:{
    autoplayTime:{
      type:Number
    },
    swiperClass:{
      type:String,
    },
    hasNavigation:{
      type:Boolean,
    },
    activeIndex:{
      type:Number,
    }
  },
  setup() {
    return {
      modules: [Keyboard,Pagination, Autoplay,Navigation],
    };
  },
};
</script>
<style>
.swiper-pagination-bullet-active {
  background-color: #999999 !important;
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 20px;
}
.swiper-button-prev{
  left: 10px !important;
}
.swiper-button-next{
  right:10px !important;
}
</style>
