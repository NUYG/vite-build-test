<template>
   <div class="row d-flex justify-content-between mt-1">
      <div class="col-8 d-flex justify-content-around">
         <button v-show='uploadBtn' type="button" class="w-75 gray-button btn-wrap-text text-white bg-dark text-small ">
            Đăng ảnh căn hộ
         </button>
      </div>
      <div class="col-4 d-flex justify-content-end">
         <div class="w-75 d-flex justify-content-around">
            <ImgDLoadBtn v-if='downloadBtn' :imageUrls='img'/>
            <MobileShareBtn
                  v-if='shareBtn'
                  :imageList='img'
                  :shareTxt="shareTxt"
            />
         </div>
      </div>
   </div>
</template>

<script>
import ImgDLoadBtn from "@/components/FpButton/ImgDLoadBtn.vue";
import MobileShareBtn from "@/components/FpButton/MobileShareBtn.vue";

export default {
   components: {
      ImgDLoadBtn,
      MobileShareBtn,
   },
   data() {
      return {}
   },
   props: {
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
      img: {
         type: Array,
         default: () => ([]),
      },
      shareTxt: {
         type: String,
         default: '',
      }
   },
   computed: {},
   methods: {},
   emits: ['close'],
   mounted() {
   }
}
</script>
