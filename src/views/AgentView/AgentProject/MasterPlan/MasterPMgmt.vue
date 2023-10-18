<template>
  <FpDefLayout :bc-props="pgMeta" :toast-msg-content="toastMsg" @closeToast="toastMsg=''">
    <template #comp>
      <div class="row  mt-3 p-3">
        <p class="text-title font-weight-600 ">Nhập thông tin tầng</p>
        <div class="col-md-5 col-10">
          <input type="text" class="form form-control col-5" placeholder="Nhập tầng " v-model="floor"/>
          <p class="fst-italic text-gray small mt-2">Chỉ được nhập số từ 1-9 và kí tự (" A ", " B ", " - " , " , " )</p>
        </div>
        <p class="text-title font-weight-600  mt-3">Chọn các layout thuộc mặt bằng tầng này</p>
        <div class="row">
             <div v-for="(data,index) in pjLayoutData?.layoutData" :key="index"
                  :class="{'button-blue-teal':pickedLayoutData.includes(data.id)}"
                  class="col-auto tag mx-2" @click="onPickedLayout(data.id)">
                 <span >{{data.layoutId}}</span>
            </div>
        </div>
      </div>
      <div class="row d-flex justify-content-center mt-4">
        <ButtonView status="more-btn" content="Cập nhật thông tin" class="col-auto"
                    @click="updateMasterPlanData"></ButtonView>
      </div>
      <div class="row mt-3">
        <ImgMgmt
            :objId="parseInt(masterPlanID)"
            imgsEP="/mlib/img/get_masterplan_imgs"
            uploadImgEP="/mlib/img/create_master_plan_img"
            updateImgsEP="/mlib/img/up_master_plan_img_pos"
        />
      </div>
    </template>
  </FpDefLayout>
</template>
<script>

import FpDefLayout from "@/views/FpDefLayout.vue";
import {post} from "@/utils/dataQuery";
import ImgMgmt from "@/components/FpImg/ImgMgmt.vue";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import {breadcrumpProp} from "@/models/customProp";
import {favObj} from "@/utils/favAPI";
import ButtonView from "@/components/FpButton/ButtonView.vue";

export default {
  components: {UnitImg, ImgMgmt, FpDefLayout, ButtonView},
  // props: {
  //   masterPlanID: {
  //     type: String
  //   },
  //   pjID:{
  //     type:String
  //   },
  //   blockID:{
  //     type:String
  //   }
  // },
  computed:{
    masterPlanID()
    {
      return this.$route?.params?.masterPlanID
    },
    pjID()
    {
      return this.$route?.params?.pjID
    },
    blockID()
    {
      return this.$route?.params?.blockID
    }
  },
  data() {
    return {
      pgMeta: {
        [breadcrumpProp.title]: 'Chi tiết mặt bằng tầng',
      },
      floor: '',
      pjLayoutData:[],
      pickedLayoutData:[],
      toastMsg:''
    }
  },
  methods: {
    onPickedLayout(layout)
    {
      if (this.pickedLayoutData.includes(layout)) {
        this.pickedLayoutData.splice(this.pickedLayoutData.indexOf(layout), 1);
      } else {
        this.pickedLayoutData.push(layout);
      }
    },
    async getProjectLayoutData() {
      const res = await post('/project/get_pj_layout', {
        id: this.pjID
      })
      this.pjLayoutData=res?.returnData
    },
    async updateMasterPlanData() {
      const regexFloor = /^[0-9A-B,-]+$/;
      if(this.floor!=='')
      {
        if(!regexFloor.test(this.floor))
        {
          return
        }
      }
      const res = await post('/master_plan/update_master_plan', {
        id: parseInt(this.masterPlanID),
        project: parseInt(this.pjID),
        block: parseInt(this.blockID),
        layouts: this.pickedLayoutData,
        floorCode: this.floor,
      })
      if(res && res.succeed)
      {
        this.toastMsg='Cập nhật thông tin mặt bằng tầng thành công!'
      }
       await this.getMasterPlanData()
    },
    async getMasterPlanData()
    {
      const res = await post('/master_plan/get_master_plan_upload_page',{
        id:this.masterPlanID
      })
      if(res && res.succeed )
      {
          this.masterPlanData=res?.returnData
          this.setMasterPlanFloorData(this.masterPlanData?.floor)
          this.setLayoutPickedData(this.masterPlanData?.layoutData)
      }
    },
    setLayoutPickedData(layoutData) {
      if(layoutData.length)
      {
        this.pickedLayoutData = layoutData.map(function(obj) {
          return obj.id;
        });
      }
    },
    setMasterPlanFloorData(floor)
    {
      if(floor.length)
      {
        const stringArray=floor?.map(element => element.toString());
        this.floor = stringArray.join(',');
      }
    }
  },
  mounted() {
    this.getProjectLayoutData()
    this.getMasterPlanData()
  }
}
</script>
