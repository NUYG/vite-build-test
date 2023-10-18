<template>
   <FpDefLayout>
      <template #comp>
         <div class="w-100 h-100">
            <h1>Chọn dự án</h1>
            <p>Bạn hãy chọn 1 hoặc nhiều dự án để gọi, hoặc không chọn nếu gọi tất cả dự án.</p>
            <p>Sau khi chọn, bạn hãy bấm <strong>Next</strong> để bắt đầu gọi.</p>
            <p>Hoặc bấm vào nút 'Gọi tiếp' để tiếp tục công việc lần trước</p>

            <button @click="nextStepBtnClk" class="w-100  btn-wrap-text small gray-button">
               Gửi thông báo đến em Tuyển
            </button>
         </div>
      </template>
   </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import {post} from "@/utils/dataQuery";
import {goToURL} from "@/utils/utils";
import {T_CALL_URL} from "@/router/URLs";

export default {
   components: {
      FpDefLayout,
   },
   data() {
      return {
         project: "",
         projects: [],
         T_CALL_URL,
      }
   },
   methods: {
      async pickProject() {
         await post("/telesale/update_calling_pj", {
            projects: this.project,
         })
         goToURL(T_CALL_URL);
      },

   },
   mounted() {
      this.getPjFilterData();
   }
}
</script>

<style scoped>
</style>
