axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

<template>
  <div class="p-2">
    <div class="mt-3">
      <div class="search-box col-lg-4 col-12 p-2">
        <input type="text" v-model="projectSearch" placeholder="Tìm dự án / khu vực" class="form-control">
      </div>
      <div class="row mt-3 p-2"  >
        <div v-for="(project,index) in projectData" class="col-12 mt-3" :key="index">
          <div class="p-3 card-gray-teal" @click="goToURL(pjDetailURL(project))">
            <div class="d-flex">
              <span class="border-rounded mt-2 project-color-bar" v-bind:style="{'background-color': project.projectColor}"></span>
              <span class="px-2" style="font-size: 20px"><b>{{ project.name }}</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {post} from "@/utils/dataQuery";
import {A_PJ_DETAIL_URL} from "@/router/URLs";
import {findProjectIdByName, replaceCharacter} from "@/utils/utils";
import {mapGetters} from "vuex";
export default {
  data() {
    return {
      projectData: [],
      projectSearch: "",
    };
  },
  computed:{
  },
  methods: {
    // Utils
    pjDetailURL(pjData){
      return A_PJ_DETAIL_URL + '-' +  replaceCharacter(pjData?.name,' ','-') ;
    },
    goToURL(url) {
      // console.log('url',url)
      this.$router.push(url);
    },
    // APIs
    async getProjectData() {
      const res =await post("/sales/get_pj_api", {
            name: this.projectSearch,
            permission: true,
          })
            this.projectData = res.returnData;
    },
  },
  props: {},
  watch: {
    projectSearch(val) {
      this.projectSearch = val;
      this.getProjectData();
    },
  },
  mounted() {
    this.getProjectData();
  },
}
</script>
