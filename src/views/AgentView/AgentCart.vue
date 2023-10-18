<template>
  <FpDefLayout ref="pageLayout" :bc-props="breadCrumbSetting">
      <template #comp>
          <AgentUnitList :currentRole="currentRole" :pageName="currentPage"  :updatedUnit="updatedUData"  class="main" @editingUnit="onEditingUnit"/>
      </template>
      <template #rightBar>
        <div class="right-panel">
          <AgentRightPanel :currentRole="currentRole" :editingUnit="editingUTab" @updated="updated" />
        </div>
      </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import AgentUnitList from "@/views/AgentView/AgentUnitList.vue";
import AgentRightPanel from "@/views/AgentView/AgentRightPanel/AgentRightPanel.vue";
import {breadcrumpProp} from "@/models/customProp";
export default {
  components: {
    FpDefLayout,
    AgentUnitList,
    AgentRightPanel
  },
  mounted() {
  },
  data() {
    return {
      editingUTab:{},
      updatedUData:{},
      breadCrumbSetting: {
        [breadcrumpProp.title]: 'Xác thực',
      },
    }
  },
  props:{
      currentPage:{
        type:String,
        default:''
      }
  },
  computed:{
    currentRole()
    {
      return sessionStorage.getItem("currentRole");
    }
  },
  methods: {
    showRightBar(show){
      this.$refs.pageLayout.showRightBar(show);
    },
    onEditingUnit(data)
    {
     this.showRightBar(true)
     this.editingUTab=data
    },
    updated(infoUpdated) {
      this.updatedUData=infoUpdated
      // console.log('updated data units: ', this.updatedUData)
    },
  },
}
</script>

<style scoped>
.main {
  height: 90%;
}
@media only screen and (min-width: 1200px) {
  .right-bar{
    height: 100vh;
    position: sticky;
    top: 0;
    left: 0;
    transition: 0.3s;
    padding: 0.5rem;
    overflow-y: scroll;
  }
}
</style>
