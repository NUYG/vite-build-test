<template>
  <div class="p-2">
    <div class="mt-3 ">
      <div class="row mt-3 p-2"  >
        <div class="col-12 mt-3">
          <div class="p-3 card-gray-teal mt-4" @click="$router.push(S_PJ_INFO+ '-'+ replaceCharacter(pjName,' ','-'))">
            <span style="font-size: 20px"><b>Tổng thể</b></span>
          </div>
          <div @click="goToPjUrl(A_LAYOUT_MGMT_URL)" class="p-3 card-gray-teal mt-4">
              <span style="font-size: 20px"><b>Ảnh layout</b></span>
          </div>
          <div @click="goToPjUrl(A_UPLOAD_PJ_IMG,'du-an-')" class="p-3 card-gray-teal mt-4">
              <span style="font-size: 20px"><b>Hình ảnh</b></span>
          </div>
          <div @click="goToPjUrl(A_PJ_MP,'du-an-')" class="p-3 card-gray-teal mt-4">
            <span style="font-size: 20px"><b>Mặt bằng tầng</b></span>
          </div>
          <div class="p-3 card-gray-teal mt-4">
            <span style="font-size: 20px"><b>Chủ đầu tư</b></span>
          </div>
          <div class="p-3 card-gray-teal mt-4">
            <span style="font-size: 20px"><b>Ban quản lý dự án</b></span>
          </div>
          <div class="p-3 card-gray-teal mt-4">
            <span style="font-size: 20px"><b>Vị trí</b></span>
          </div>
          <div class="p-3 card-gray-teal mt-4">
            <span style="font-size: 20px"><b>Tiện ích</b></span>
          </div>
          <div class="p-3 card-gray-teal mt-4">
            <span style="font-size: 20px"><b>Thông tin khác</b></span>
          </div>
        </div>
      </div>
    </div>
    {{pjName}}
  </div>
</template>

<script>
import {goToURL, replaceCharacter} from "@/utils/utils";
import {A_LAYOUT_MGMT_URL, A_PJ_IMG_MGMT, A_UPLOAD_PJ_IMG,A_PJ_MP,S_PJ_INFO} from '@/router/URLs'
import {mapGetters} from "vuex";
export default {
  data() {
    return {
      goToURL,
      A_LAYOUT_MGMT_URL,
      A_PJ_IMG_MGMT,
      A_UPLOAD_PJ_IMG,
      A_PJ_MP,
      S_PJ_INFO
    };
  },
  props:{
    pjId:{
      type: [Number,String],
      default:0
    }
  },
  computed:{
    ...mapGetters(['getPjLibData']),
    pjName()
    {
      return this.getPjLibData?.projects?.filter(pjData => {
       return  pjData.id === parseInt(this.pjId)
      })[0]?.name
    }
  },
  methods: {
    replaceCharacter,
    goToPjUrl(url,params='')
    {
      this.$router.push(url + '-' + params + this.pjId)
    }
  },
  watch: {},
  mounted() {
  },
}
</script>
