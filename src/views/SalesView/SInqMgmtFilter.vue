<template>
  <div class="row mt-3 p-3">
    <div class="input-group">
      <input v-model="filterData.namePhone" class="form-control" type="text" placeholder="Tìm khách hàng">
    </div>
  </div>
  <div class="d-flex mt-3 justify-content-between p-lg-2">
    <div class="col-6 d-flex ">
      <img alt="houseIcon" class="process-sidebar_icon" :src="getIconUrl('HouseSimple.svg')">
      <a class="text-content" style="font-weight: 400;">Dự Án</a>
    </div>

    <div class="col-6 d-flex justify-content-end">
      <div class="dot" style="margin-top: 6px; margin-right: 6px;" :style="{'background-color': pjPickColor}"></div>
      <select v-model="filterData.project" style="padding: 0;  color:#999999"
              class="form-control-plaintext text-content px-2">
        <option value="" selected> Tất Cả</option>
        <option v-for="(pj, index) in projects" :key="index" :value="pj.id" selected> {{ pj.name }}</option>
      </select>
    </div>
  </div>

  <div class="row mt-3 px-2">
    <p class="text-content"><img alt="bedIcon" :src="getIconUrl('bed.svg')"> Số phòng ngủ</p>
    <div class="d-flex justify-content-around col-lg-12 col-md-12 col-10 mt-2 p-lg-2">
      <button @click="setFBedroom('')" :class="{'button-blue-teal':bedroomEqual('')}" class="border-number">Không
      </button>
      <button @click="setFBedroom(1)" :class="{'button-blue-teal':bedroomEqual(1)}" class="border-number">1</button>
      <button @click="setFBedroom(2)" :class="{'button-blue-teal':bedroomEqual(2)}" class="border-number">2</button>
      <button @click="setFBedroom(3)" :class="{'button-blue-teal':bedroomEqual(3)}" class="border-number">3</button>
      <button @click="setFBedroom(4)" :class="{'button-blue-teal':bedroomEqual(4)}" class="border-number">4</button>
    </div>
  </div>

  <div class="d-flex mt-3 justify-content-between p-lg-2">
    <div class="col-6 d-flex ">
      <img alt="bellIcon" class="process-sidebar_icon" :src="getIconUrl('BellRinging.svg')">
      <a class="text-content" style="font-weight: 400;">Đã ghép</a>
    </div>
    <div class="col-6 d-flex mt-auto justify-content-end ">
      <div class="form-check form-switch red-switch mt-auto">
        <input v-model="filterData.hasSP" class="form-check-input" type="checkbox" role="switch">
      </div>
    </div>
  </div>
  <div class="border-top border-gray">
    <div class="d-flex justify-content-between">
      <div @click="refreshFilter" class="col-6 p-lg-3 mt-3 mt-lg-0">
        <img class="process-sidebar_icon" :src="getIconUrl('Trash.svg')" alt="call_icon">
        <span style="color: #FF4747">Đặt lại</span>
      </div>
      <div v-show="false" class="d-flex col-6 p-lg-3 mt-3 mt-lg-0">
        <button @click="handleFiltered" class="w-100  gray-button">Lọc</button>
      </div>
    </div>
  </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import {post} from "@/utils/dataQuery";

export default {
  components: {},
  data() {
    return {
      filterData: {
        project: "",
        rent: "",
        hasSP: false,
        namePhone: "",
        extBedroom: "",
        furniture: "",
      },
      projects: [],
      pjPickColor: "#999999",
    }
  },
  computed: {},
  methods: {
    getIconUrl,
    refreshFilter() {
      this.filterData.project = "";
      this.filterData.rent = "";
      this.filterData.hasSP = false;
      this.filterData.namePhone = "";
      this.filterData.extBedroom = "";
      this.filterData.furniture = "";
    },
    handleFiltered() {
      // console.log(this.project, this.rent, this.hasSP, this.search);
    },
    // Controller
    setFBedroom(val) {
      this.filterData.extBedroom = this.filterData.extBedroom === val ? "" : val;
    },
    bedroomEqual(val) {
      return this.filterData.extBedroom === val;
    },
    async getCompareValue() {
      const res = await post("/sales/get_pjs_filter", {
        haveInq: true,
      })
      this.projects = res.returnData;
    },
    setColorPj(id) {
      if (!id) {
        return this.pjPickColor = "#999999"
      }
      for (let i = 0; i < this.projects.length; i++) {
        if (id === this.projects[i].id) {
          return this.pjPickColor = this.projects[i].projectColor
        }
      }
    },
  },
  props: {},
  watch: {
    project(val) {
      this.project = val;
    },
    filterData: {
      handler(val) {
        this.$emit("filter-data", val);
        this.setColorPj(val.project);
      },
      deep: true,
    },
  },
  emits: ["filter-data"],
  mounted() {
    this.getCompareValue();
  }
}
</script>

<style scoped>
</style>
