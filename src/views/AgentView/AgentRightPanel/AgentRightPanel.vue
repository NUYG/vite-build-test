<template>
  <div class="h-100 overflow-scroll ">
    <div v-if="currentRole==='Agent'"  class="row underline-change bg-md-white" style="height: 7%">
      <div class="col-6 mt-2">
        <div @click="currentTab=!currentTab"
             :class="['w-100 text-hover text-gray btn-wrap-text', { 'underline text-dark': currentTab === true }]">
          <p class="text-center m-auto">Thông tin căn</p>
        </div>
      </div>
      <div class="col-6 mt-2">
        <div @click="currentTab=!currentTab"
             :class="['w-100 text-hover text-gray', { 'underline text-dark': currentTab === false }]">
          <p class="text-center m-auto"> Căn ghép </p>
        </div>
      </div>
    </div>
    <div class="row bg-md-white " v-show="currentTab===true" style="height: 93%">
      <AgentRightInfo
          :currentPage="currentRole"
          :editing-unit="editingUnit"
          @submit-event="hasUpdate"
          :POINTING="comparePointing"
          :FURNITURE="compareFurniture"
          :UNIT_STATUS="compareStatus"
      />
    </div>
    <div class="row bg-md-white" v-show="currentTab===false" style="height: 93%">
      <AgentRightCollab
          :editing-unit="editingUnit"
          :POINTING="comparePointing"
          :FURNITURE="compareFurniture"
          :UNIT_STATUS="compareStatus"
          :INQUIRY_STATUS="compareInquiry"
      />
    </div>
  </div>
</template>

<script>
import AgentRightInfo from "@/views/AgentView/AgentRightPanel/AgentRightInfo.vue";
import AgentRightCollab from "@/views/AgentView/AgentRightPanel/AgentRightCollab.vue";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

export default {
  data() {
    return {
      currentTab: true,
      popup: true,
      comparePointing: {},
      compareFurniture: {},
      compareStatus: {},
      compareInquiry: {},
      POINTING: [],
      FURNITURE: [],
      UNIT_STATUS: [],
      INQUIRY_STATUS: [],
    };
  },
  methods: {
    hasUpdate(infoUpdated) {
      this.$emit("updated", infoUpdated);
    },
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.POINTING, DataLibType.FURNITURE, DataLibType.UNIT_STATUS, DataLibType.INQUIRY_STATUS]
      );
      this.UNIT_STATUS = res.UNIT_STATUS;
      this.POINTING = res.POINTING;
      this.INQUIRY_STATUS = res.INQUIRY_STATUS;
      this.FURNITURE = res.FURNITURE
    },
  },
  props: {
    editingUnit: {
      type: Object,
    },
    currentRole: {
      type: String,
      default: ''
    },
  },
  components: {
    AgentRightInfo,
    AgentRightCollab
  },
  watch: {
    editingUnit() {
      this.comparePointing = this.POINTING;
      this.compareFurniture = this.FURNITURE;
      this.compareStatus = this.UNIT_STATUS;
      this.compareInquiry = this.INQUIRY_STATUS;
      this.currentPage = this.page;
    },
  },
  emits: ["updated"],
  mounted() {
    this.getDataLib()
  },
};

</script>
<style scoped>


</style>
