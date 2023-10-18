<template>
  <div class="container-fluid">
    <SPDetail :role="Roles.Sales" :spID="spID"/>
  </div>
</template>

<script>
import {Roles} from "@/utils/constants";
import SPDetail from "@/views/CommonView/SPDetail.vue";

export default {
  components: {
    SPDetail,
  },
  data() {
    return {
      Roles,
    }
  },
  computed: {
    spID()
    {
      return this.$route?.params?.spID
    }
  },
  methods: {},
  watch: {},
  mounted() {
  }
}
</script>

<style scoped>
</style>
