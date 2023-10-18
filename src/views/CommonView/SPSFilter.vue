<template>
<!--  <div class="right-panel ">-->
    <div class="row mt-lg-3">
      <div class="input-group">
        <input v-model="filterData.search" class="form-control" type="text" placeholder="Tìm kiếm">
      </div>
    </div>
    <div v-if="!isPspPage" class="d-flex  mt-3  justify-content-between p-lg-2">
      <div class="col-6 d-flex align-items-center">
        <a class="text-content" style="font-weight: 400;">Dự Án</a>
      </div>
      <div class="col-lg-6 col-md-12 col-4 d-flex mt-md-2 mt-lg-0 justify-content-end">
        <div class="dot" style="margin-top: 6px; margin-right: 6px;"
             :style="{'background-color': pjPickColor}"></div>
        <select style="padding: 0;  color:#999999" v-model="project"
                class="form-control-plaintext text-content text-gray">
          <option value="" selected> Tất Cả</option>
          <option v-for="(pj, index) in projects" :key="index" :value="pj.id"> {{ pj.name }}</option>
        </select>
      </div>
    </div>
    <div class="d-flex mt-lg-1 mt-3  justify-content-between p-lg-2">
      <div class="col-6 d-flex align-items-center">
        <a class="text-content" style="font-weight: 400;">Cơ hội</a>
      </div>
      <div class="col-lg-5 col-md-12 col-4 d-flex mt-md-2 mt-lg-0  justify-content-end">
        <select v-model="filterData.rent" class="form-control-plaintext text-content text-gray">
          <option value="" selected>Tất cả</option>
          <option :value=false>Bán</option>
          <option :value=true>Thuê</option>
        </select>
      </div>
    </div>
    <div class="d-flex mt-lg-1 mt-3 justify-content-between border-bottom  border-gray p-lg-2" v-if="statusFilter">
      <div class="col-6 d-flex align-items-center">
        <a class="text-content" style="font-weight: 400;">Trạng thái</a>
      </div>
      <div class="col-lg-5 col-md-12 col-4 d-flex mt-md-2 mt-lg-0  justify-content-end">
        <select v-model="dropStatus" class="form-control-plaintext text-content text-gray">
          <option value="waiting,depositing,signing,notarizing" selected>Tất cả</option>
          <option value="waiting">Hẹn xem nhà</option>
          <option value="depositing">Hẹn cọc</option>
          <option value="notarizing">Hẹn công chứng</option>
          <option value="signing">Hẹn giao dịch</option>
          <option value="done">Đã giao dịch</option>
          <option value="ownCanceled,cusCanceled">Đã hủy</option>
        </select>
      </div>
    </div>
    <slot name="extSearch"></slot>

    <div class="mt-3 d-flex justify-content-between p-lg-2" v-if="!isPspPage && shorting">
      <div class="text-content text-gray mt-auto p-2">Sắp xếp theo</div>
    </div>
    <div class="mt-2" v-for="(items,index) in sortContent" :key="index" v-if="!isPspPage && shorting">
      <div :class="{'bg-currentSidebar':currentSort===index}"
           class="sidebar-menu_item p-2 d-flex justify-content-between" @click="sortingValue(items.sortValue,index)">
        <div class="">
          <img alt="" class="process-sidebar_icon" :src="items.src">
          <span class="text-content">{{ items.content }}</span>
        </div>
        <img alt="" v-show="currentSort===index" class="icon-short-process" :src="getIconUrl('ArrowUp.svg')"
             :class="{'rotate-180':azSort}">
      </div>
    </div>
    <div class="mt-2" :class="{' border-top border-gray':!isPspPage}">
      <div class="sidebar-menu_item mt-3 mb-3  p-2" @click="refreshFilter">
        <img class="process-sidebar_icon" :src="getIconUrl('Trash.svg')" alt="call_icon">
        <span style="color: #FF4747">Đặt lại</span>
      </div>
      <div class="row d-flex justify-content-center">
        <ButtonView content="Hoàn thành" status="gray-btn" class="col-10" @click="onSubmitFilter"></ButtonView>
      </div>
    </div>
<!--  </div>-->
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import ButtonView from "@/components/FpButton/ButtonView.vue";

export default {
  components: {ButtonView},
  data() {
    return {
      sortContent: [
        {
          content: 'Mặc định',
          src: getIconUrl('star-solid.svg'),
          sortValue: {
            favSorting: 'last_update'
          }
        },
        {
          content: 'Tình trạng',
          src: getIconUrl('HourglassLow.svg'),
          sortValue: {
            sorting: 'status'
          }
        },
        {
          content: 'Dự án',
          src: getIconUrl('HouseSimple.svg'),
          sortValue: {
            sorting: 'unit__project'
          }
        },
      ],
      currentSort: 0,
      project: "",
      listLen: 12,
      projects: [],
      pjPickColor: "#00757B",
      azSort: false,
      filterData: {
        project: "",
        rent: "",
        search: "",
        sNotify: false,
        aNotify: false,
      },
      sortData: {},
      dropStatus: "waiting,depositing,signing,notarizing"
    }
  },
  props: {
    role: {
      type: String,
      required: true,
    },
    isPspPage: {
      type: Boolean,
    },
    statusDefault: {
      type: Array,
      default: () => []
    },
    rentDefault: {
      type: Boolean
    },
    idPjDefault: {
      type: [Number, String],
    },
    statusFilter:{
      type:Boolean,
      default:true
    },
    shorting:{
      type:Boolean,
      default:true
    }
  },
  computed: {
    isAgent() {
      return this.role === 'Agent';
    },
    isSales() {
      return this.role === 'Sales';
    },
  },
  methods: {
    getIconUrl,
    refreshFilter() {
      this.filterData.search = ''
      this.project = ''
      this.filterData.sNotify = false
      this.filterData.aNotify = false
      this.filterData.rent = ''
      this.filterData.sort = ''
      this.dropStatus = "waiting,depositing,signing,notarizing"
      this.$emit('resetFilter')
    },
    sortingValue(sortValue, id) {
      this.azSort = this.currentSort !== id || !this.azSort;
      this.sortData = {...sortValue};
      for (let key in sortValue) {
        this.sortData[key] = (this.azSort ? '' : '-') + this.sortData[key];
      }
      this.currentSort = id;
    },
    setColorPj(id) {
      for (let i = 0; i < this.projects.length; i++) {
        if (id === this.projects[i].id) {
          return (this.pjPickColor = this.projects[i].projectColor);
        }
      }
    },
    filter() {
      this.$emit("filter-data", {
        ...this.filterData,
        sort: this.sortData,
        statuses: this.dropStatus
      });
    },
    onSubmitFilter() {
      this.filter()
      this.$emit('pspFilter', this.dropStatus, this.filterData.rent)
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.projects]
      );
      this.projects = res.projects;
    },
  },
  watch: {
    project(val) {
      this.filterData.project = val;
      this.setColorPj(val);
    },
    statusDefault(newVal) {
      if (newVal.length < 2) {
        this.dropStatus = newVal[0]
      } else {
        this.dropStatus = newVal.join(',')
      }
    },
    // rentDefault(newVal)
    // {
    //   this.filterData.rent=newVal
    // },
    // idPjDefault(newVal)
    // {
    //   this.filterData.id=newVal
    // }
  },
  emits: ["filter-data", 'pspFilter','resetFilter'],
  mounted() {
    this.getDataLib();
    // this.filterData.rent=this.rentDefault
    // this.filterData.id=this.idPjDefault
  }
}
</script>

<style scoped>
</style>
