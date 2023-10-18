<template>
  <FpDefLayout>
    <template #comp>
      <div class="row mt-5 d-flex justify-content-center">
        <span class="text-title col-auto">Up load ảnh dự án</span>
      </div>
      <div class="row">
        <ImgDropZone @fileUploaded="onFileUploadSucceed"/>
      </div>
      <div class="row d-flex justify-content-center mt-4">
        <div class="col-6">
          <UnitImg :imgSrc="pjImg" :ratioImg="[3,2]"></UnitImg>
        </div>
      </div>
    </template>
  </FpDefLayout>
</template>

<script>
import ImgDropZone from "@/components/FpImg/ImgDropZone.vue";
import {getImageData, post} from "@/utils/dataQuery";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import FpDefLayout from "@/views/FpDefLayout.vue";

export default {
  components: {
    FpDefLayout,
    UnitImg,
    ImgDropZone
  },
  data() {
    return {
      pjImg: ''
    }
  },
  computed:{
    pjID()
    {
      return this.$route?.params?.pjID
    }
  },
  methods: {
    onFileUploadSucceed(val) {
      // console.log(val)
      this.updateUserAvt(val)
    },
    async updateUserAvt(selectedFile) {
      const response = await post("/mlib/img/project_avt_upload", {
        objId: this.pjID,
        imgName: selectedFile.name,
        imgData: selectedFile.dataUrl,
      });
      if (response) {
        // console.log(response.imgData);
        window.alert("cập nhật ảnh thành công");
      }
    },
    async getImgData() {
      const res = await post('/project/get_project_avt ', {
        id: this.pjID ? this.pjID : -1,
        role: "Sales",
      })
      this.pjImg = res.returnData?.avtData?.imgUrl
    }
  },
  mounted() {
    this.getImgData()
  }

}
</script>
