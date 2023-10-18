<template>
   <FpDefLayout>
      <template #comp>
         <div class="w-100 h-100">
            <h1>Chọn dự án</h1>
            <p>Bạn hãy chọn 1 hoặc nhiều dự án để gọi, hoặc không chọn nếu gọi tất cả dự án.</p>
            <p>Sau khi chọn, bạn hãy bấm <strong>Next</strong> để bắt đầu gọi.</p>
            <p>Hoặc bấm vào nút 'Gọi tiếp' để tiếp tục công việc lần trước</p>
            <div class="form-group">
               <p>
                  <label for="id_call_pj_list">Danh sách dự án:</label>
                  <select v-model="project" class="form-control" multiple>
                     <option v-for="(pj, index) in projects" :key="index" :value="pj.id">{{ pj.name }}</option>
                  </select>
               </p>
            </div>

            <div class="form-group">
               <input type="submit" @click="pickProject" class="btn btn-primary" value="Next"/>
            </div>
            <a class="btn btn-primary" :href="T_CALL_URL"> Tiếp tục gọi </a>
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
      async getPjFilterData() {
         const res = await post("/sales/get_pjs_filter", {
            haveUnit: true,
            permission: true,
         })
         this.projects = res.returnData;
      },
   },
   mounted() {
      this.getPjFilterData();
   }
}
</script>

<style scoped>
</style>
