<template>
  <GGMap>
    <template #content>
      <CustomMarker
        v-for="pj in pjData"
        :options="{ position: { lat: pj.map_lat, lng: pj.map_lng }, anchorPoint: 'BOTTOM_CENTER' }">
        <ProjectInfoMarker
          v-bind="pj"
        />
      </CustomMarker>
    </template>

  </GGMap>
</template>


<script>
import GGMap from "@/views/GoogleMap/GGMap.vue";
import {CustomMarker} from "vue3-google-map";
import ProjectInfoMarker from "@/views/GoogleMap/ProjectInfoMarker.vue";

export default {
  data() {
    return {}
  },
  components: {
    GGMap, CustomMarker, ProjectInfoMarker
  },
  computed: {

  },
  props: {
    pjData: {
      type: Array,
      default: [],
    }
  },
  methods: {},
  mounted() {
  },
  emits: []
}
</script>

<style scoped>

</style>
