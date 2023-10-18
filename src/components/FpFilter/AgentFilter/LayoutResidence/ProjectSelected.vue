<template>
    <SelectedField  :selectedVal="pjPick" @selectedData="selectedData" :optionArr="projects" :defaultData="defaultData" contentKey="name" valueKey="id"/>
</template>

<script>
import SelectedField from "@/components/FpInput/FpFields/SelectedField.vue";
import {getCompareValue} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";

export default {
  components: {
    SelectedField
  },
  data() {
    return {
      projects:[],
      pjPick:''
    }
  },
  props:{
    projectsRepo:{
      type:Array,
      default:() => []
    },
    projectsPick:{
      type:[Number,String]
    },
    defaultData:{
      type:String,
      default:'Chọn dự án'
    }
  },
  methods:{
    async getDataLib() {
      const res = await getCompareValue([
        DataLibType.projects]
      );
      this.projects = res.projects;
    },
    selectedData(data)
    {
      return this.$emit('projectSelected',{['pj_id']:data})
    }
  },
  async mounted() {
    if(this.projectsRepo.length)
    {
       this.projects=this.projectsRepo
    }
    else {
      await this.getDataLib()
    }
    this.pjPick=this.projectsPick
  },
  watch:{
    projectsRepo()
    {
      this.projects=this.projectsRepo
    },
    projectsPick(newVal)
    {
      this.pjPick=newVal
    }
  },
  emits:['projectSelected']
}
</script>