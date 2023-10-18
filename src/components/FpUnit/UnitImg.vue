<template>
  <div class="col position-relative border8" ref="unitImgBox">
    <img v-if="imgSrc" :src="IMG_URL()+imgSrc" :style="sizeImg + brightnessStyle + styleImg"
         :class="{'border8':border8}" class="w-100 " ref="myImage" alt=""/>
    <img v-else :src="getIconUrl('emptyImg.png')" :style="sizeImg + brightnessStyle + styleImg"
         :class="{'border8':border8}" class="w-100 " ref="myImage" alt="">
    <div class="position-absolute unit-tag-information text-mb-12" v-for="(val, index) in unitTagData" :key="index"
         :style="`right:${showFurText ? (index*110)+10 : (index*40)+10}px`">
      <FpIcon v-if="val.icon" :srcIcon="val.icon" :size="20" class="white-svg"></FpIcon>
      <span v-if="val.content==='Full nội thất'" :class="{'mx-2':showFurText}">{{
          showFurText ? 'Full nội thất' : ''
        }}</span>
      <span v-else>{{ val.content }}</span>
    </div>
    <div class="position-absolute " v-if="lastImg && ttImg>0" style="top:40%;right:40%">
      <div class="col-auto d-flex">
        <FpIcon srcIcon="more-img.svg" :size="20"></FpIcon>
        <span class="text-white ms-1 text-content">{{ ttImg }}</span>
      </div>
    </div>
    <div class="position-absolute" :class="customTagClass" v-if="customTagText">
      <span class="col-auto">{{ customTagText }}</span>
    </div>
    <div class="position-absolute highlight-unit" :style="`background-color:${hLtTagColor}`" v-if="highLightTag">
      <span class="text-mb-12 py-1 px-3">{{highLightTagContent}}</span>
    </div>
    <div class="position-absolute border8" style="top:8%;background: #1C1C1C;color:white;left: 3%" v-if="tagPjCode">
      <span class="text-content py-1 px-3">{{ tagPjCode }}</span>
    </div>
    <div class="project-tag px-3 w-100 text-white text-content border8" v-if="bottomTag">
      <div class="d-flex justify-content-between mt-5 w-100" style="margin-bottom: 10px;" :style="styleBottomText">
         <span class="col-auto">
           {{ pjUnitText }}
        </span>
        <span class="col-auto d-flex" v-if="ttImg>0 ">
        <FpIcon srcIcon="more-img.svg" :size="20" v-if="!showCurrentSlide"></FpIcon>
           <span class="text-white ms-1 text-content">{{ imgCountText }}</span>
      </span>
      </div>
    </div>

    <slot name="extComp"></slot>
  </div>


</template>

<script>
import {IMG_URL} from "@/utils/constants";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {tagContent} from "@/utils/unit";
import {getIconUrl} from "@/utils/utils";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";

export default {
  components: {FpIcon},
  data() {
    return {
      sizeImg: '',
      tagContent,
      // unitTagContent: {}
    }
  },
  computed: {
    scrWdtEnum() {
      return scrWdtEnum
    },
    brightnessStyle() {
      return this.lastImg && this.ttImg ? ` filter: brightness(50%);` : ''
    },
    imgCountText() {
      return this.showCurrentSlide ? `${this.currentImg}/${this.ttImg}` : this.ttImg
    },
    unitTagData() {
      return this.unitTag
    }
  },
  methods: {
    scrWdtFrom,
    getIconUrl,
    IMG_URL() {
      return IMG_URL
    },
    calculateImageHeight() {
      if (this.$refs.myImage) {
        const imgSize = this.$refs.myImage.clientWidth;
        const widthImg = (imgSize * this.ratioImg[0]) / this.ratioImg[1]
        const heightImg = (imgSize * this.ratioImg[1]) / this.ratioImg[0]
        this.sizeImg = `width:${widthImg}px;height:${heightImg}px;`
      }
    },
    handleResize() {
      this.calculateImageHeight();
    },
    observeDivResize() {
      const targetElement = this.$refs.unitImgBox;
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.handleResize();
        }
      });
      this.resizeObserver.observe(targetElement);
    },
  },
  mounted() {
    this.observeDivResize()
    this.calculateImageHeight()
    // this.setUnitTagContent(this.unitTag)
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.resizeObserver.disconnect()
  },
  watch: {
  },
  props: {
    ratioImg: {
      type: Array,
      default: () => [1, 1],
    },
    imgSrc: {
      type: String,
    },
    unitTag: {
      type: Array,
      default: () => []
    },
    highLightTag: {
      type: Boolean,
      default: false
    },
    hLtTagColor:{
      type:String,
      default:'#59A8D4'
    },
    highLightTagContent:{
      type:String,
      default:'Nỗi bật'
    },
    tagPjCode: {
      type: String,
      default: ''
    },
    pjUnitText: {
      type: String
    },
    ttImg: {
      type: Number,
    },
    lastImg: {
      type: Boolean,
    },
    border8: {
      type: Boolean,
      default: true
    },
    styleImg: {
      type: String,
    },
    currentImg: {
      type: Number,
    },
    showCurrentSlide: {
      type: Boolean
    },
    styleBottomText: {
      type: String
    },
    bottomTag: {
      type: Boolean,
      default: true
    },
    showFurText: {
      type: Boolean,
    },
    customTagText: {
      type: String
    },
    customTagClass: {
      type: String
    }
  }
}

</script>

<style>
.unit-tag-information {
  top: 18px;
  background: #5E52FF;
  border-radius: 8px;
  padding: 2px 8px;
  color: white;

}

.text-mb-12 {
  font-size: 14px;
}

@media only screen and (max-width: 767px) {
  .highlight-unit {
    top: 14% !important;
  }
  .text-mb-12 {
    font-size: 12px;
  }

  .small-tag-top-left {
    top: 15%;
    background: rgb(255, 71, 71);
    border-radius: 0 8px 8px 0;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
  }

  .tag-top-left {
    top: 7%;
    background: rgb(255, 71, 71);
    border-radius: 0 8px 8px 0;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
  }
}

.project-tag {
  bottom: 0;
  height: 30%;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.7))
}

.tag-top-left {
  top: 7%;
  background: rgb(255, 71, 71);
  border-radius: 0 8px 8px 0;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
}


.highlight-unit {
  top: 8%;
  border-radius: 0 8px 8px 0;
  color: white
}
</style>
