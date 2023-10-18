<template>
  <FpDefLayout :bc-props="pgMeta" ref="pgLayoutComp" @breadcrumb-back-icon="onBackIconClick"  :toast-msg-content="toastContent" @closeToast="toastContent=''">
    <template #comp>
      <div class="p-4" v-if="pjBlockData?.blkData?.length">
        <div class="row d-flex justify-content-between  p-3 mt-3" style="background: #E5ECF6;border-radius: 16px"
             v-for="(data,index) in pjBlockData.blkData" :key="index">
          <span class="col-auto text-title" >Block {{ data.name }}</span>
          <div class="col d-flex justify-content-end">
            <div class="row d-flex justify-content-between">
              <div class="col-auto py-1 px-3 more-bg border8 me-2 text-white">
                <span class="text-content d-flex align-items-center"
                      @click="createMasterPlan(data.id)">Thêm mặt bằng tầng
                  <FpIcon src-icon="PlusCircle.svg" :size="20" class="ms-2"></FpIcon></span>
              </div>
<!--              <FpIcon src-icon="arrowLeft.svg" :size="32" class="col-auto p-0"-->
<!--                      :style="`rotate: ${blockExtIndex===index ?  90 :270}deg`"-->
<!--                      @click="onExtBlockClick(index)"></FpIcon>-->
            </div>
          </div>
          <div class="row mt-3" >
            <div class="col-md-3 col-12 mt-3" v-for="(mpData,index) in data.masterPlanData">
              <UnitImg :bottom-tag="false" :img-src="mpData?.imgs.length ? mpData?.imgs[0].wm_url : ''" :ratio-img="[3,2]"
                       @click="goToMasterPlanMgmt(mpData.id,data.id)">
                <template #extComp>
                <span class="position-absolute" style="right:10px;top: 10px">
                  <FpIcon src-icon="CheckCircle.svg" :size="24" @click.stop="onDeleteMasterPlan(mpData.id)"></FpIcon>
                </span>
                </template>
              </UnitImg>
            </div>

          </div>
        </div>
      </div>
      <p v-else class="font-weight-600  text-center">Chưa có dữ liệu block</p>
    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import fpFormExt from "@/components/FpForm/FpFormExt.vue";
import FilterLayout from "@/components/FpFilter/SalesFilter/FilterLayout.vue";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import ImgDropZone from "@/components/FpImg/ImgDropZone.vue";
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {post} from "@/utils/dataQuery";
import ImgMgmt from "@/components/FpImg/ImgMgmt.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {A_MP_MGMT} from "@/router/URLs";

export default {
  computed:{
    pjId()
    {
      return this.$route.params?.pjId
    }
  },
  data() {
    return {
      pgMeta: {
        [breadcrumpProp.title]: '',
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal,
      },
      floor: '',
      layout: '',
      pjBlockData: [],
      blockExtIndex: 0,
      currentBlockPick: [],
      toastContent:''
    }
  },
  components: {
    ImgMgmt,
    FpIcon,
    ImgDropZone,
    UnitImg,
    FilterLayout,
    FpDefLayout,
    fpFormExt,
    ButtonView
  },
  methods: {
    onExtBlockClick(index) {
      this.blockExtIndex = this.blockExtIndex === index ? -1 : index
    },
    onBackIconClick() {
      return this.showDetailBlock ? this.showDetailBlock = false : this.$router.back()
    },
    async getDataPjBlock() {
      const res = await post('/sales/get_pj_block_masterplan_data', {
        id: this.pjId
      })
      this.pjBlockData = res.returnData

    },
    async createMasterPlan(blockID) {
      const res = await post('/master_plan/create_master_plan', {
        id: this.pjId,
        block: blockID,
      })
      this.toastContent='Tạo mới mặt bằng tầng thành công'
      if(res.succeed && res.masterplanId)
      {
        this.goToMasterPlanMgmt(res.masterplanId,blockID)
      }
    },
    goToMasterPlanMgmt(masterPlanID,blockID)
    {
      this.$router.push(A_MP_MGMT+'-mat-bang-tang-'+masterPlanID+'-du-an-'+this.pjId+'-block-'+blockID)
    },
    async onDeleteMasterPlan(masterPlanID)
    {
      const res=  await post('/master_plan/delete_master_plan',{
        id:masterPlanID
      })
      if(res && res.succeed)
      {
       await this.getDataPjBlock()
      }
    }
  },
  mounted() {
    this.getDataPjBlock()
  }
}
</script>
