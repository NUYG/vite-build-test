<template>
  <ProjectMap
  :pj-data="pjData"
  />
</template>


<script>
import ProjectMap from "@/views/GoogleMap/ProjectMap.vue";
import {getPjMapInfoAPI} from "@/views/GoogleMap/utils";

export default {
  data() {
    return {
      pjData: [],
    }
  },
  components: {
    ProjectMap
  },
  computed: {},
  props: {
  },
  methods: {},
  async mounted() {
    this.pjData = (await getPjMapInfoAPI()).returnData;
  },
  emits: []
}
</script>

<style scoped>

</style>
