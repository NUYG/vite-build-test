<template>
  <GoogleMap
    api-key="AIzaSyCYE6_9RhWvd_rliTWy0Frdk9X8qs_ePvA"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="zoom"
  >
    <slot name="content">

    </slot>
  </GoogleMap>
</template>


<script>
import {GoogleMap} from "vue3-google-map";

export default {
  data() {
    return {
    }
  },
  components: {
    GoogleMap
  },
  computed: {
    center(){
      return {lat: this.defLat, lng: this.defLng};
    }
  },
  props: {
    defLat: {
      type: Number,
      default: 10.7670469,
    },
    defLng: {
      type: Number,
      default: 106.6524871,
    },
    zoom: {
      type: Number,
      default: 18,
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
