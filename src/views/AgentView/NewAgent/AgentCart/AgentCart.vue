<template>
  <div>
    <UnitCard :unitData="unitData"/>
  </div>
</template>

<script>
import UnitCard from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCard.vue";
import {post} from "@/utils/dataQuery";

export default {
  data() {
    return {
      unitData: []
    }
  },
  components: {
    UnitCard
  },
  props: {
    filterData: {
      type: Object,
      default: () => {
      }
    }
  },
  watch: {
    filterData(newVal) {
      this.getFilteredData(newVal)
    }
  },
  methods: {
    async getFilteredData(data) {
      const response = await post('/agent/get_filtered_units', data);
      this.unitData = response.returnData;
    }
  },
  mounted() {
    this.getFilteredData({listLen: 10, currentPage: "Agent"});
  }

}
</script>