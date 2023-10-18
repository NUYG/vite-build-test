<template>
  <FpDefLayout :bc-props="breadCrumbSetting">
      <template #comp>
          <AgentPjDetail :pjId="pjId"/>
      </template>
  </FpDefLayout>
</template>

<script>
  import FpDefLayout from "@/views/FpDefLayout.vue";
  import AgentPjDetail from "@/views/AgentView/AgentProject/ProjectDetail/AgentPjDetail.vue";
  import {getCompareValue, post} from "@/utils/dataQuery";
  import {breadcrumpProp} from "@/models/customProp";
  import {DataLibType} from "@/utils/dataLib";
  import {findProjectIdByName, replaceCharacter} from "@/utils/utils";
  import {mapGetters} from "vuex";

  export default {
    async mounted() {
      await this.getDataLib()
      await  this.setBreadcrumbTitle()
    },
    components:{
      FpDefLayout,
      AgentPjDetail
    },
    computed:{
      ...mapGetters(['getPjLibData']),
      getPjName()
      {
        return replaceCharacter(this.$route?.params?.pjId,'-',' ')
      },
      pjId()
      {
        return findProjectIdByName(this.getPjName,this.getPjLibData)
      }
    },
    data()
    {
      return{
        breadCrumbSetting: {
          [breadcrumpProp.title]: '',
        },
        projects:[]
       }
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
            return this.breadCrumbSetting[breadcrumpProp.title]=(`Dự án ${this.projects[i].name}`);
          }
        }
      },
    }
  }
</script>
