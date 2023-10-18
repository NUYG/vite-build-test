<template>
   <div class="container">
      <div class='row p-2 mt-4'>
         <ImgDropZone
           @file-uploaded='postInitFile'
         />
      </div>
      <div class='row mt-4 p-2' id="image-list">
         <div v-for='(img,index) in imgData' class="col-auto position-relative" :key="img.id"  >
            <img @click.stop='handleClickImg(index)'  @mousedown.stop="startCounting" @mouseup.stop="stopCounting"  :class="{ 'shake': openChangeImg }"
                 class='img-fluid border8 my-2 img-layout_detail' :src="IMG_URL + img.smThumb" alt="Image 1" >
            <img @click.stop='deleleItems(img.id)' class='position-absolute' :src="getIconUrl('times-solid.svg')" alt='' style='width: 12px;height: 12px;right:20px;top:12px;cursor: pointer' />
         </div>
      </div>
      <div v-if='showCarousel'>
         <SlideShow @close='showCarousel=false' :imgs='imgData.map((item) => item.url)' :activeIndex='activeIndex'></SlideShow>
      </div>
   </div>
</template>

<script>
import Sortable from 'sortablejs';
import {IMG_URL} from "@/utils/constants";
import {post, deleteImage} from "@/utils/dataQuery";
import SlideShow from "@/components/FpImg/SlideShow.vue";
import ImgDropZone from "@/components/FpImg/ImgDropZone.vue";
import {getIconUrl} from "@/utils/utils";

const canChangedImage = window.innerWidth > 768;

export default {
   components: {
      SlideShow,
      ImgDropZone,
   },
   data() {
      return {
         imgData: [],
         objData: {},
         oldIndex: null,
         newIndex: null,
         indexChange: -1,
         showCarousel: false,
         activeIndex: 0,
         IMG_URL,
         isPressing: false,
         timer: null,
         openChangeImg: false,
      }
   },
   props: {
      objId: {
         type: Number,
         default: -1,
      },
      objDataEP: {
         type: String,
         required: false,
      },
      imgsEP: {
         type: String,
         required: true,
      },
      updateImgsEP: {
         type: String,
         required: true,
      },
      uploadImgEP: {
         type: String,
         required: true,
      },
      showTitle: {
         type: Boolean,
         default: false,
      },
      imgContent: {
         type: String,
         default: "selfImgs",
      },
      getImgValidate: {
         type: Object,
         default: () => ({}),
      },
   },
   computed: {},
   methods: {
      getIconUrl,
      startCounting() {
         if (!canChangedImage) {
            this.isPressing = true;
            this.timer = setTimeout(() => {
               if (this.isPressing) {
                  // this.openChangeImg = true;
                  // this.sortable();
               }
            }, 1300);
         }
      },
      stopCounting() {
         if (!canChangedImage) {
            this.isPressing = false;
            clearTimeout(this.timer);
         }
      },
      handleClickImg(index) {
         this.activeIndex = index;
         this.showCarousel = !this.openChangeImg;
      },
      async deleleItems(id) {
         const response = await deleteImage({ id: id });
         if (response.succeed) {
            this.imgData = this.imgData.filter((item) => item.id !== id);
         }
      },
      async moveItems(currentId, newId) {
         const currentItem = this.imgData.splice(currentId, 1)[0];
         this.imgData.splice(newId, 0, currentItem);
         const idArray = this.imgData.map((item) => item.id);
         await this.updateImgPos(idArray);
      },
      sortable() {
         const vm = this;
         const imageList = document.getElementById("image-list");
         new Sortable(imageList, {
            animation: 150,
            onUpdate: function (evt) {
               vm.indexChange = vm.indexChange === -1 ? 1 : -1;
               vm.oldIndex = evt.oldIndex;
               vm.newIndex = evt.newIndex;
            },
         });
      },
      async getImgList() {
         const response = await post(this.imgsEP, {
            id: this.objId,
            imgContent: this.imgContent,
            imgType: "mgmt",
            ...this.getImgValidate,
         });
         this.imgData = response.returnData;
      },
      async getObjData() {
         if (!this.objDataEP) {
            return;
         }
         const res = await post(this.objDataEP, {
            id: this.objId,
         });
         this.objData = res.returnData;
      },
      async updateImgPos(idArray) {
         const res = await post(this.updateImgsEP, {
            id: this.objId,
            imgPos: idArray,
         });
         if (res.suc) {
            await this.getImgList();
         }
      },
      async postInitFile(img) {
         const res = await post(this.uploadImgEP, {
            objId: this.objId,
            imgName: img.name,
            imgData: img.dataUrl,
         });
         if(!res){
            window.alert("file không phù hợp vui lòng chọn tấm ảnh khác");
            return;
         }
         if (!res.succeed) {
            window.alert(res.resText);
            return;
         }
         if (res.status === "good") {
            this.handleUploadFile(res.imgData);
         }
      },
      handleUploadFile(imageData) {
         this.imgData.push(imageData);
      },
   },
   watch: {
      indexChange() {
         this.moveItems(this.oldIndex, this.newIndex);
      },
      objId() {
         this.getImgList();
      },
   },
   mounted() {
      this.getObjData();
      this.sortable();
      this.getImgList();
   },
}
</script>