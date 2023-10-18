<template>
  <div class="container-fluid">
    <div class="w-100 d-flex justify-content-center align-items-center align-items-md-start vh-100">
      <div class="w-100 h-50 ">
          <swipe-box :img="unitImg" :ratio-img="[3,2]" class="col-lg-6 col-10" :swipe-loop="true" :show-thumb="true"  imgStyle="object-fit: contain">
          </swipe-box>
      </div>
    </div>
  </div>
</template>

<script>
import {post} from "@/utils/dataQuery";
import ImgMgmt from "@/components/FpImg/ImgMgmt.vue";
import SwipeBox from "@/components/FpImg/SwipeBox.vue";
import SalesUnitDetail from "@/views/SalesView/SalesUnitDetail/SalesUnitDetail.vue";

export default {
  components: {SalesUnitDetail, SwipeBox, ImgMgmt},
  props:{
    // unitID:{
    //   type:Number
    // }
  },
  data()
  {
    return{
      unitData:[],
      unitID:-1
    }
  },
  computed: {
    unitImg()
    {
      if(this.unitData?.imgs?.length)
      {
        return this.unitData?.imgs.map((item) => item.wm_url)
      }
    }
  },
  methods:{
      async getUnitData()
      {
        const res = await post('/fp_guest/get_renting_unit_data_guest', {
          id: this.unitID,
          role: "Sales"
        })
        this.unitData= res.returnData
      }
  },
  mounted() {
    this.unitID = this.$route.params.unitID
    console.log(this.$route.params.unitID)
    this.getUnitData()
  }
}
</script>
