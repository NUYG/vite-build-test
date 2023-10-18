<template>
    <FpDefLayout :bc-props="breadCrumbSetting">
      <template #comp>
          <LayoutManagement :pjId="pjId"/>
      </template>
    </FpDefLayout>
</template>

<script>
import LayoutManagement from "@/views/AgentView/AgentProject/AgentLayoutMn/LayoutManagement.vue";
import FpDefLayout from "@/views/FpDefLayout.vue";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {breadcrumpProp} from "@/models/customProp";
export default {
  props: ['pjId'],
  components:{
    FpDefLayout,
    LayoutManagement
  },
  data()
  {
    return {
      breadCrumbSetting: {
        [breadcrumpProp.title]: '',
      },
    }
  },
  computed:{
    pjId()
    {
      return this.$route?.params.pjId
    }
  },
  async mounted() {
    await this.getDataLib()
    await  this.setBreadcrumbTitle()
  },
  methods:{
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.projects]
      );
      this.projects = res.projects;
    },
    async setBreadcrumbTitle() {
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].id === Number(this.pjId)) {
          return this.breadCrumbSetting[breadcrumpProp.title]=(`Layout ${this.projects[i].name}`);
        }
      }
    },
  }
}
</script>
