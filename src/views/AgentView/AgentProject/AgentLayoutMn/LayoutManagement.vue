<template>
  <div class="p-3">
    <div class="mt-3 ">
      <div class="search-box col-12 p-2">
        <input v-model='searchID' type="text" placeholder="Tìm layout" class="form-control">
      </div>
    </div>
    <div v-for="(group, bedroom) in groupedLayouts" :key="bedroom">
      <div class="p-2 card-gray-teal mt-4 " @click="toggleActive(bedroom)">
        <div class="d-flex justify-content-between p-2">
          <p style="font-size: 20px"><b>{{ bedroom }} Phòng ngủ</b></p>
          <span>
                     <img :class="{'rotate90':toggleId===bedroom}" class='imgHover'
                          :src="getIconUrl('chevron-left.svg')" alt="check_icon"
                          style="width: 40px;transform: rotate(-90deg)">
                </span>
        </div>

        <div class="layouts" v-show='toggleId === bedroom'>
          <div class='row d-flex justify-content-around mt-4'>
            <div class="col-auto mt-4" v-for='(layout, index) in group' :key="index">
              <div><b>Layout {{ layout.layoutId }}</b></div>
              <a v-if='layout.thumbnail === ""' :href="goToDetailLayout(layout.layoutId)">
                <div class="square-box mt-2">
                  <img alt="" class="img-fluid imgHover" :src="getIconUrl('uploadImg.svg')"/>
                  <p>Tải ảnh lên</p>
                </div>
              </a>

              <a :href="goToDetailLayout(layout.layoutId)" v-else>
                <div class="square-box-img mt-2"
                     :style="{ backgroundImage: 'url(/media/imgs/'+ layout.thumbnail + ')' }">
                  <p class='d-flex justify-content-center'>{{ layout.tt_imgs }}+</p>
                </div>
              </a>
            </div>
            <div class='row d-flex justify-content-around mt-4'>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {post} from "@/utils/dataQuery";
import {getIconUrl} from "@/utils/utils";
import {A_LAYOUT_DETAIL_URL} from "@/router/URLs";

export default {
  data() {
    return {
      layouts: [],
      groupedLayouts: [],
      searchID: '',
      toggleId: -1,
      A_LAYOUT_DETAIL_URL,
      getIconUrl
    };
  },
  methods: {
    goToDetailLayout(id)
    {
     return A_LAYOUT_DETAIL_URL + '-du-an-' + this.pjId + '-layout-' + id
    },
    groupByBedroom() {
      this.groupedLayouts = this.layouts.reduce((groups, layout) => {
        const bedroom = layout.bedroom;
        if (!groups[bedroom]) {
          groups[bedroom] = [];
        }
        groups[bedroom].push(layout);
        return groups;
      }, {});
    },
    async getLayouts() {
      const res = await post("/u_layout/layouts_mgmt_api", {
        pj: this.pjId,
         layoutId: this.searchID,
         pjPermission: true,
      });
      this.layouts = res.returnData;

      this.groupByBedroom()
    },
    toggleActive(index) {
      this.toggleId = index === this.toggleId ? -1 : index;
    },
  },
  props: {
    pjId: {
      type: Number,
      default: -1
    }
  },
  watch: {
    searchID() {
      this.getLayouts()
    }
  },
  mounted() {
    this.getLayouts();
  },
}
</script>
