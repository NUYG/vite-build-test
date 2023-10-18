<template>
  <div class='row mb-3' v-if="pageName==='ExpContractUnits'">
    <div class='col-4'>
      <button @click='twoMonthFilter' class='w-100 rounded btn-wrap-text'
              :class="{'btn btn-primary': filterMonth===2}">2 Tháng
      </button>
    </div>
    <div class='col-4'>
      <button @click='fourSixMonthFilter' class='w-100 rounded btn-wrap-text'
              :class="{'btn btn-primary': filterMonth===4}">4-6 Tháng
      </button>
    </div>
  </div>
  <div class="form-group">
    <div class="row mt-lg-5">
      <div class="col-12 col-lg-5 col-xl-5 col-xxl-5 col-md-12 mb-4 col-sm-12">
        <div class="row">
          <div class="col-6 col-lg-7 col-xl-7 col-xxl-7 col-md-6 col-sm-6">
            <select v-model="filterData.project" name="project" class="form-control-plaintext" id="id_project">
              <option value="0" selected>Chọn Dự Án</option>
              <option v-for="pj in projects" :value="pj.id" selected>
                <span class="dot" v-bind:style="{'background-color':pj.projectColor}"></span>
                {{ pj.name }}
              </option>
            </select>
          </div>
          <div class="col-6 col-lg-5 col-xl-5 col-xxl-5 col-md-5 col-sm-5 col-5 m-auto">
            <div class="row justify-content-around ">
              <div class="col-6 p-0">
                <button type="button" :class="{ 'green-latel' : filterData.renting }" class="w-100 rounded"
                        @click="filterData.renting = !filterData.renting"
                >Thuê
                </button>
              </div>
              <div class="col-6 px-1">
                <button type="button" :class="{ 'red-latel' : filterData.selling }" class="w-100 rounded ml-2"
                        @click="filterData.selling = !filterData.selling"
                >Bán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-xl-4 col-xxl-4 col-md-7 col-6 mb-3">
        <div class="d-flex justify-content-around">
          <div class="col-lg-8 col-xl-8 col-xxl-8 col-md-8 col-8">
            <div class="input-group rounded">
              <input v-model="filterData.search" v-on:keyup.enter="$emit('filter-btn-clicked', getFilteredData)"
                     type="search"
                     class="form-control rounded" placeholder="Tìm" aria-label="Search"
                     aria-describedby="search-addon"
              />
            </div>
          </div>
          <div class="col-3 col-lg-3 col-xl-3 col-xxl-3 searchAdvance col-md-4 text-center">
            <button type="button" class="btn btn-outline-secondary " :class="{'bg-warning' : advanceFiltered }"
                    @click="advanceClick">
              <img class="svgFilter" :src="getIconUrl('plus-solid.svg')" alt="search-icon">
            </button>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-xl-3 col-xxl-3 col-md-5 col-6 mb-3">
        <div class="row">
          <div class="col-7">
            <button @click="$emit('filter-btn-clicked', getFilteredData)" type="button"
                    class="w-100 btn-search  rounded  text-dark "
            >Lọc
            </button>
          </div>
          <div class="col-5 m-auto">
            <button type="button" @click="resetFilter" class="btn btn-outline-secondary ">
              <img class="svgFilter" :src="getIconUrl('return.svg')" alt="return-icon">
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row" v-show="searchAdvance">
    <div class="col-lg-5 col-xl-5 col-xxl-5 col-md-12 col-12">
      <div class="row">
        <div class="col-lg-7 col-xl-7 col-xxl-7 col-md-6 col-6">
          <span class="u-tab-text-s"><b>Tình Trạng Căn</b> </span>
          <select v-model="filterData.status" class="form-control-plaintext mt-2 ">
            <option value="">----------</option>
            <option v-for="st in UNIT_STATUS" :value="st[0]">{{ st[1] }}</option>
          </select>
          <div class="row mt-4">
            <div class="col-6 ">
              <span class="u-tab-text-s" for="id_block"> <b>Block:</b> </span>
              <input v-model="filterData.block" type="text" name="block" maxlength="20" class="form-control"
                     id="id_block">
            </div>
            <div class="col-6 text-center">
              <span class="u-tab-text-s" for="id_unit"><b>Căn:</b></span>
              <input v-model="filterData.unit" type="text" name="unit" maxlength="10" class="form-control" id="id_unit">
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-6 ">
              <span class="u-tab-text-s" for="id_from_floor"><b>Từ Tầng</b></span>
              <input v-model="filterData.fromFloor" type="number" name="from_floor" class="form-control"
                     id="id_from_floor"
                     pattern="\d*"/>
            </div>
            <div class="col-6 text-center">
              <span class="u-tab-text-s" for="id_to_floor"><b>Đến</b></span>
              <input v-model="filterData.toFloor" type="number" name="to_floor" class="form-control" id="id_to_floor"
                     pattern="\d*"/>
            </div>
          </div>
        </div>
        <div class="col-lg-5 col-xl-5 col-xxl-5 col-md-6 col-6">
          <div class="row  ">
            <div class="col-6">
              <b class="u-tab-text-s">PN</b>
              <input v-model="filterData.bedroom" type="text" name="bedroom" class="form-control px-0"
                     id="id_bedroom"/>
            </div>
            <div class="col-6">
              <b class="u-tab-text-s">WC</b>
              <input v-model="filterData.bathroom" type="number" name="bathroom" min="0" class="form-control px-0"
                     id="id_bathroom"
                     pattern="\d*"/>
            </div>
          </div>
          <div class="row mt-4 u-tab-text-s"><b>Nội Thất</b></div>
          <div class="row ">
            <div class="col-6 px-0">
              <button type="button" :class="{'activeClick': filterData.furniture==='partly'}"
                      class="w-100 h-100 btn-view text-12 rounded text-dark mb-2 btn-wrap-text"
                      @click="setFurniture('partly')"
              >NTCB
              </button>
            </div>
            <div class="col-6 px-1">
              <button type="button" :class="{'activeClick': filterData.furniture==='fully'}"
                      class="w-100  h-100 btn-view text-12 rounded text-dark btn-wrap-text "
                      @click="setFurniture('fully')"
              >FNT
              </button>
            </div>
          </div>
          <div class="row mt-4">
            <span class="mt-2 u-tab-text-s"><b>Hướng:</b></span>
            <select v-model="filterData.balcony" name="balcony" class="form-control-plaintext" id="id_balcony">
              <option value="">---------</option>
              <option v-for="dir in POINTING" :value="dir[0]"> {{ dir[1] }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-xl-3 col-xxl-3 col-md-12 col-12 ">
      <div class="row ">
        <div class="col-lg-12 col-xl-12 col-md-12 col-12">
          <div class="row mt-3">
            <b class="u-tab-text-s">View</b>
          </div>
          <div class="row">
            <div class="col-lg-7 col-md-3 col-4">
              <button type="button" :class="{'activeClick': filterData.view==='pool'}"
                      class="btn-view w-100 rounded text-dark  btn-wrap-text u-tab-text" @click="setView('pool')"
              >Hồ Bơi
              </button>
            </div>
            <div class="col-lg-5 col-md-2 col-4">
              <button type="button" :class="{'activeClick': filterData.view==='river'}"
                      class="btn-view w-100 rounded text-dark u-tab-text" @click="setView('river')"
              >Sông
              </button>
            </div>
            <div class="col-lg-7 mt-lg-2  col-md-3 col-4">
              <button type="button" :class="{'activeClick': filterData.view==='landmark'}"
                      class="btn-view w-100 rounded text-dark btn-wrap-text u-tab-text" @click="setView('landmark')"
              >Biểu Tượng
              </button>
            </div>
            <div class="col-lg-5  mt-lg-2 mt-md-0 mt-2  col-md-3 col-4">
              <button type="button" :class="{'activeClick': filterData.view==='road'}"
                      class="btn-view w-100 rounded text-dark btn-wrap-text u-tab-text" @click="setView('road')"
              >Đại lộ
              </button>
            </div>
            <div class="col-lg-7 mt-2 col-md-3 col-4">
              <button type="button" :class="{'activeClick': filterData.view==='park'}"
                      class="btn-view w-100 rounded text-dark btn-wrap-text u-tab-text" @click="setView('park')"
              >Công Viên
              </button>
            </div>
            <div class="col-lg-5 mt-2 col-md-3 col-4">
              <button type="button" :class="{'activeClick': filterData.view==='inner'}"
                      class="btn-view w-100  w-100 rounded text-dark btn-wrap-text u-tab-text"
                      @click="setView('inner')"
              >Nội Khu
              </button>
            </div>
            <div class="col-lg-7 col-md-4 mt-2 col-4">
              <button type="button" :class="{'activeClick': filterData.view==='city'}"
                      class="btn-view w-100 rounded text-dark ml-4 btn-wrap-text u-tab-text" @click="setView('city')"
              >Thành Phố
              </button>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col">
            <b class="u-tab-text-s">Theo dõi</b>
            <div class="form-check form-switch ">
              <input class="form-switch form-switch-xl form-check-input"
                     @click="filterData.myFavorite=!filterData.myFavorite" type="checkbox"
                     role="switch"
              >
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="col-lg-2 col-xl-2 col-xxl-2 col-md-6 col-6">
      <div class="row mt-2">
        <div class="col-lg-12 col-xl-12 col-md-12 col-12">
          <div class="row">
            <b class="u-tab-text-s">Nhà mới</b>
            <div class="form-check form-switch ">
              <input class="form-switch form-switch-xl form-check-input" @click="filterData.new = !filterData.new"
                     type="checkbox"
                     role="switch"
              >
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <b for="id_size" class="u-tab-text-s">Diện Tích</b>
              <select v-model="size" name="size" class="form-control px-0" id="id_size" multiple>
                <option v-for="s in sizes" :value="s">{{ s }}m2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="col-lg-2 col-xl-2 col-xxl-2 col-md-6 col-6">
      <div class="row mt-2 ">
        <b class="u-tab-text-s">Căn Tươi</b>
        <select v-model="filterData.fresh" class="form-control-plaintext">
          <option value="">---</option>
          <option value="fresh">Tươi</option>
          <option value="rotten">Không tươi</option>
        </select>
      </div>
      <div class="row mt-4">
        <b class="u-tab-text-s">Độ dài </b>
        <select v-model="listLen" class="form-control-plaintext">
          <option :value="10">10 hàng</option>
          <option :value="15"> 15 hàng</option>
          <option :value="20"> 20 hàng</option>
        </select>
      </div>

    </div>
  </div>
</template>


<script>
import {post} from '@/utils/dataQuery'
import {getIconUrl} from "@/utils/utils";
import {FURNITURE, POINTING, UNIT_STATUS} from "@/utils/TransContent";

const defaultFilter = {
  project: 0,
  block: "",
  unit: "",
  selling: false,
  renting: false,
  bedroom: "",
  bathroom: "",
  balcony: "",
  furniture: "",
  view: "",
  new: false,
  fromFloor: "",
  toFloor: "",
  status: "",
  expFrom: '',
  expTo: '',
  myArchives: false,
  myFavorite: false,
  search: "",
  fresh: "",
}

export default {
  data() {
    return {
      filterData: {
        project: 0,
        block: "",
        unit: "",
        selling: false,
        renting: false,
        bedroom: "",
        bathroom: "",
        balcony: "",
        furniture: "",
        view: "",
        new: false,
        fromFloor: "",
        toFloor: "",
        status: "",
        expFrom: '',
        expTo: '',
        myArchives: false,
        myFavorite: false,
        search: "",
        fresh: "",
      },
      unit_id: 0,
      size: [],
      expiringContract: "",
      listLen: 10,
      sizes: false,
      searchAdvance: false,
      advanceFiltered: false,
      sorting: "",
      projects: "",
      POINTING: "",
      FURNITURE: "",
      UNIT_STATUS: "",
      filterMonth: '',
      getIconUrl
    };
  },
  computed: {
    getFilteredData() {
      return {
        unit_id: this.unit_id,
        ...this.filterData,
        sizes: this.getSizesData,
        listLen: this.listLen,
        ...{
          bathroom: this.filterData.bathroom > 0 ? this.filterData.bathroom : "",
          fromFloor: this.filterData.fromFloor > 0 ? this.filterData.fromFloor : "",
          toFloor: this.filterData.toFloor > 0 ? this.filterData.toFloor : ""
        },
        page: 1,
        sorting: this.sorting,
        currentPage: this.pageName,
      };
    },
    getSizesData() {
      let sizeData = [];
      for (let i = 0; i < Object.keys(this.size).length; i++) {
        if (this.size[i] === "") {
          continue;
        }
        sizeData.push(this.size[i][0]);
      }
      return sizeData;
    },
    isExpContractPage() {
      return this.pageName === "ExpContractUnits";
    },
  },
  methods: {
    addDays(daysToAdd) {
      let dateObj = new Date()
      dateObj.setDate(dateObj.getDate() + daysToAdd);
      return dateObj.toISOString().slice(0, 10)
    },
    getDefaultFilter() {
      if (this.isExpContractPage) {
        this.twoMonthFilter()
      }
    },
    twoMonthFilter() {
      this.filterData.expFrom = this.addDays(0)
      this.filterData.expTo = this.addDays(60)
      this.filterMonth = 2
    },
    fourSixMonthFilter() {
      this.filterData.expTo = this.addDays(180)
      this.filterData.expFrom = this.addDays(120)
      this.filterMonth = 4
    },
    resetFilter() {
      this.filterData = {...this.filterData, ...defaultFilter};
      this.getDefaultFilter();
      this.$emit('filter-btn-clicked', this.getFilteredData);
    },
    getDataLib() {
      this.POINTING = POINTING;
      this.UNIT_STATUS = UNIT_STATUS;
      this.FURNITURE = FURNITURE;
    },
    async getPjFilterData() {
      const res = await post("/sales/get_pjs_filter", {
        haveUnit: true,
        permission: true
      });
      this.projects = res.returnData;
    },
    defaultValue() {
      return {
        unit_id: this.unit_id ? this.unit_id : 0,
        ...defaultFilter,
        sizes: [],
        listLen: 10,
        page: 1,
        sorting: "",
        currentPage: this.pageName,
      };
    },
    hasFilter() {
      return (
         JSON.stringify(this.defaultValue()) === JSON.stringify(this.getFilteredData)
      );
    },
    advanceClick() {
      this.searchAdvance = !this.searchAdvance;
      this.advanceFiltered = this.searchAdvance ? false : !this.hasFilter();
    },
    async getPjUnitSizes() {
      if (!this.searchAdvance) {
        return;
      }
      const res = await post('/agent/get_pj_unit_sizes', this.filterData)
      this.sizes = res["sizes"]
      this.size = []
    },
    setView(view) {
      this.filterData.view = this.filterData.view === view ? "" : view;
    },
    setFurniture(fur) {
      this.filterData.furniture = this.filterData.furniture === fur ? "" : fur;
    },
  },
  props: {
    pageName: {
      type: String,
    },
  },
  watch: {
    filterData: {
      handler() {
        this.getPjUnitSizes();
        this.advanceFiltered = this.searchAdvance ? false : !this.hasFilter();
      },
      deep: true,
    },
  },
  emits: ["filter-btn-clicked"],
  mounted() {
    this.getDefaultFilter();
    this.getPjUnitSizes();
    this.$emit("filter-btn-clicked", this.getFilteredData);
    this.getDataLib();
    this.getPjFilterData();
  },
}
</script>