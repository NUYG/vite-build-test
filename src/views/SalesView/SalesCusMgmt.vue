<template>
  <div v-show="$route.name==='Sales Customers'">
    <FpDefLayout :bc-props="pgMeta" @breadcrumbBackIcon="onBreadcrumbBackIcon">
      <template #comp>

        <div class="p-4">
          <div class="d-md-flex justify-content-between mt-2 flex-wrap">
            <div class="col-md-8 col-12 d-flex justify-content-between">
              <div class="row d-lg-flex d-none justify-content-around text-content mt-3" style="font-weight: 600;">
                <span @click="active=true" class="col-auto cursor-pointer" :class="{'current-process_status':active}">Đang chăm</span>
                <span @click="active=false" class="col-auto cursor-pointer"
                      :class="{'current-process_status':active===false}">Khách cũ</span>
              </div>
            </div>
            <div class="col-12 col-lg search-container">
              <SalesCusFilter @cusFilter="onCusFilter" :filtering="isFiltering" @submit-filter="onSubmitFilter"
                              @resetFilter="onResetFilter" :extendFilterData="extendFilterData"
                              :projectPick="extendFilterData.project" :activeProps="active"
                              :rentingPick="false" :setExtSearch="extSearch" @searchExtending="onSearching"
                              :realTimeSearch="false"/>
            </div>
          </div>

          <LoadingAnimContainer
              :isLoading="!finishLoading"
          >
            <template #content>
              <div class="row pb-5">
                <div v-for="item in itemRankIv" class="col-12 col-md-6 col-lg-6 col-xl-4 mt-4" :key="item.id">
                  <FpCusMgmtCard :cusTagId="item.id" :active="item.active"
                                 :cusTagData="fillCusTagData(item)" :inqVal="item.inqData"
                                 @favClick="onFavClick" @click="onFavClick(item)"
                                 @rmCusClick="removeCustomer"
                                 :SALE_PROCESS_STATUS="SALE_PROCESS_STATUS"/>
                </div>
                <div v-for="item in itemsRankNormal" class="col-12 col-md-6 col-lg-6 col-xl-4 mt-4" :key="item.id">
                  <FpCusMgmtCard :cusTagId="item.id" :active="item.active"
                                 :cusTagData="fillCusTagData(item)" :inqVal="item.inqData"
                                 @favClick="onFavClick" @click="onFavClick(item)"
                                 @rmCusClick="removeCustomer"
                                 :SALE_PROCESS_STATUS="SALE_PROCESS_STATUS"/>
                </div>
              </div>
              <div v-if=" !itemRankIv.length && !itemsRankNormal.length">
                <p class="text-center font-weight-600 " style="font-size: 20px;color: #D9D9D9">Bạn chưa có khách hàng
                  nào!</p>
                <div class="row d-flex justify-content-center">
                  <FpIcon src-icon="blankcustomer.png" :size="350" class="col-auto p-0"></FpIcon>
                </div>
              </div>

            </template>
          </LoadingAnimContainer>
        </div>

      </template>
    </FpDefLayout>

    <TourHost
      pageName="newSalesCus"
      :tourOptions="pageTour['New Sales Cus']"
      :startDelay="500"
    />
  </div>
  <router-view></router-view>
</template>

<script>
import {breadcrumpProp, defLayoutBehaType} from "@/models/customProp";

const defaultFilterValue = {
  bedroom: '',
  views: [],
  balconies: [],
  unitType: '',
  project: '',
  rent: '',
  furniture: '',
}
import FpDefLayout from "@/views/FpDefLayout.vue";
import FpCusMgmtCard from "@/components/FpCard/FpCusMgmtCard.vue";
import {getIconUrl, getObjField, grayToOpacity} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {getCompareValue, post} from "@/utils/dataQuery";
import {S_CREATE_CUS_URL, S_CUS_DETAIL_URL} from "@/router/URLs";
import {cusRankColor} from "@/utils/cusConstants";
import {favObj, favObjAPI} from "@/utils/favAPI";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpFormSearch from "@/components/FpForm/FpFormSearch.vue";
import SalesCusFilter from "@/components/FpFilter/SalesFilter/SalesCusFilter.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {DataLibType} from "@/utils/dataLib";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import LoadingAnimContainer from "@/components/FpAnimation/LoadingAnimContainer.vue";
import TourHost from "@/views/Guidance/TourHost.vue";
import {pageTour} from "@/views/Guidance/pageTour";

export default {
  components: {
    TourHost,
    LoadingAnimContainer,
    SalesCusFilter,
    FpFormSearch,
    FpIcon,
    FpDefLayout,
    FpCusMgmtCard,
    ButtonView
  },
  data() {
    return {
      items: [],
      finishLoading: false,
      extSearch: false,
      itemsRankNormal: [],
      itemRankIv: [],
      page: 1,
      totalItems: 0,
      active: true,
      search: '',
      // Trans dict
      CUSTOMER_SOURCE: [],
      S_CREATE_CUS_URL,
      SALE_PROCESS_STATUS: [],
      iconClicked: false,
      extendFilterData: {
        bedroom: '',
        views: [],
        balconies: [],
        unitType: '',
        project: '',
        rent: '',
        furniture: '',
      },
      pgMeta: {
        [breadcrumpProp.title]: `Khách hàng`,
        [breadcrumpProp.behaviorType]: defLayoutBehaType.signal
      },
      // import
      pageTour
    }
  },
  computed: {
    scrWdtEnum() {
      return scrWdtEnum
    },
    isNotExtFiltering() {
      return (
        !this.extendFilterData.bedroom && !this.extendFilterData.furniture &&
        !this.extendFilterData.views.length && !this.extendFilterData.balconies.length && !this.extendFilterData.unitType &&
        !this.extendFilterData.project && this.extendFilterData.rent === ''
      )
    },
    isFiltering() {
      return !this.isNotExtFiltering
    },
    isPc() {
      return scrWdtFrom(scrWdtEnum.MD)
    }
  },
  methods: {
    scrWdtFrom,
    grayToOpacity,
    getIconUrl,
    goToURL,
    onSearching(value) {
      this.extSearch = value
    },
    onBreadcrumbBackIcon() {
      if (this.extSearch) {
        this.extSearch = false
      } else {
        this.$router.back()
      }
    },
    cusInfoURL(id) {
      return S_CUS_DETAIL_URL + "-" + id;
    },
    handleScroll() {
      const bottom = document.documentElement.scrollHeight - window.innerHeight;
      const distance = bottom - window.scrollY;
      if (distance < 1) {
        this.loadItems();
      }
    },
    onSubmitFilter() {
      this.filterItems()
    },
    async loadItems() {
      if (this.lockLoadUnits) {
        return ''
      }
      this.lockLoadUnits = true
      const res = await post("/sales/basic_cus_data", {
        search: this.search,
        selfStats: true,
        active: this.active,
        page: this.page,
        favSorting: '-last_update',
        listLen: 15,
        ...this.extendFilterData,
        activeInq: !this.isNotExtFiltering ? 'waiting' : '',
      })
      if (res) {
        this.finishLoading = true
        this.sortingItemByRank(res.returnData)
        this.totalItems = res.totalResult;
        this.page++;
        this.lockLoadUnits = false
      }
    },
    async filterItems() {
      this.finishLoading = false
      this.page = 1;
      const res = await post("/sales/basic_cus_data", {
        search: this.search,
        selfStats: true,
        page: this.page,
        favSorting: '-last_update',
        listLen: 15,
        active: this.active,
        ...this.extendFilterData,
        activeInq: !this.isNotExtFiltering ? 'waiting' : '',
      })
      if (res) {
        this.finishLoading = true
        this.itemRankIv = []
        this.itemsRankNormal = []
        this.sortingItemByRank(res.returnData)
        this.totalItems = res.totalResult;
        this.page++;
      }
    },
    sortingItemByRank(data) {
      data?.map(item => {
        if (item.rank === 'iv') {
          this.itemRankIv.push(item)
        } else {
          this.itemsRankNormal.push(item)
        }
      })
    },
    fillCusTagData(data) {
      return {
        cusName: getObjField(data, 'name'),
        phoneNumber: getObjField(data, 'phone'),
        note: getObjField(data, 'persona'),
        lastInteract: getObjField(data, 'last_update'),
        fav: getObjField(data, 'fav'),
        avtSrc: data,
        avtOutline: cusRankColor[data.rank],
        id: getObjField(data, 'id'),
        favShow: true
      }
    },
    async removeCustomer(customerId) {
      const res = await post("/sales/remove_customer", {
        id: customerId
      })
      if (res && res.succeed) {
        window.alert('Xóa khách hàng thành công')
      }
    },
    async onFavClick(item, fav, source) {
      if (source === 'icon') {
        this.iconClicked = true;
        const favSucceed = await favObjAPI(favObj.CONTACTOR, item.id, fav);
        if (favSucceed) {
          this.setFavItem(item.id, fav)
        }
      } else {
        if (!this.iconClicked && item.id) {
          this.$router.push(this.$route.path +  `/${S_CUS_DETAIL_URL}-${item.id}`);
        } else {
          this.iconClicked = false;
        }
      }
    },
    setFavItem(id, fav) {
      this.moveItemFavToTop(this.itemRankIv, id, fav)
      this.moveItemFavToTop(this.itemsRankNormal, id, fav)
    },
    onCusFilter(field, value) {
      if (field === 'project' || field === 'views' || field === 'balconies') {
        this.extendFilterData[field] = value
      } else if (field === 'active' || field === 'search') {
        this[field] = value
      } else if (field === 'rent' && value === 'buy') {
        this.extendFilterData.rent = this.extendFilterData.rent === false ? '' : false;
      } else if (field === 'rent' && value === 'rent') {
        this.extendFilterData.rent = this.extendFilterData.rent ? '' : true;
      } else {
        this.extendFilterData[field] = this.extendFilterData[field] === value ? '' : value
      }
    },
    moveItemFavToTop(array, id, fav) {
      const index = array.findIndex(element => element.id === id);
      if (index !== -1) {
        const item = array[index];
        if (item.fav !== fav) {
          item.fav = fav;
          array.splice(index, 1);
          if (fav) {
            array.unshift(item);
          } else {
            array.push(item);
          }
        }
      }
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.SALE_PROCESS_STATUS]
      );
      this.SALE_PROCESS_STATUS = res.SALE_PROCESS_STATUS
    },
    onResetFilter() {
      this.extendFilterData = JSON.parse(JSON.stringify(defaultFilterValue))
    }
  },
  watch: {
    search(val) {
      this.search = val;
      this.filterItems();
    },
    active(val) {
      this.active = val;
      this.filterItems();
    },
  },
  async mounted() {
    await this.getDataLib()
    await this.loadItems();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
}
</script>

<style scoped>
.search-container {
  position: relative;
}

</style>
