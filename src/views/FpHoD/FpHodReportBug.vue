<template>
  <FpDefLayout :bc-props="pgMeta" :toast-msg-content="toastMsg" @closeToast="toastMsg=''">
    <template #comp>
      <h4 class="text-center">Gửi báo cáo lỗi</h4>
      <FpForm classes="mt-3 text-content d-flex justify-content-center"
              :fields="fields" submit-text="Gửi báo cáo" btn-status="more-btn"
              btnSubmitContainer="row d-flex justify-content-center" btnSubmitClass="col-lg-7 col-10" @submit-data="onFormDataChange">
        <template #message>
          <div class="row d-flex justify-content-center mt-2">
            <div class="col-lg-7 col-10">
              <ImgDropZone @file-uploaded="onImgUpload"></ImgDropZone>
            </div>
            <p class="mt-2 col-lg-7" v-if="imgList.length">Đã tải lên {{imgList.length}} ảnh</p>
          </div>
        </template>
      </FpForm>
    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import {breadcrumpProp} from "@/models/customProp";
import FpForm from "@/components/FpInput/FpForm.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import ImgDropZone from "@/components/FpImg/ImgDropZone.vue";
import {post} from "@/utils/dataQuery";
import ImgMgmt from "@/components/FpImg/ImgMgmt.vue";
import {FpHoDRpBug} from "@/router/URLs";

export default {
  components: {ImgMgmt, ImgDropZone, FpForm, FpDefLayout},
  data(){
    return {
      pgMeta:{
        [breadcrumpProp.title] : 'Báo lỗi'
      },
      fields: [
        {
          id: 'name',
          name: 'name',
          type: 'text',
          label: '',
          placeholder: 'Tên lỗi',
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 57 : 80,
        },
        {
          id: 'content',
          name: 'content',
          type: 'note',
          label: '',
          placeholder: 'Khái quát lỗi',
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 55 : 75,
        },
        {
          id: 'recreate',
          name: 'recreate',
          type: 'note',
          label: '',
          placeholder: 'Cách tái hiện lỗi',
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 55 : 75,
        }
      ],
      imgList:[],
      toastMsg:''
    }
  },
  methods:{
    onFormDataChange(val) {
      this.submitReportBug({...val,imgList:this.imgList})
    },
    resetData() {
      this.name = ''
      this.imgList = []
    },
    onImgUpload(val) {
      this.imgList.push({imgName: val.name,imgData: val.dataUrl})
    },
    async submitReportBug(payload) {
      const res = await post('/hod/create_bug_request',{...payload})
      if(res?.succeed)
      {
        this.toastMsg = 'Gửi thành công'

      }
      else {
        console.log('lỗi chú ơi')
      }
    },
  },
}
</script>
