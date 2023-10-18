<template>
  <AgentBoxFilter class="mt-3" :inputFields="inputFields" @boxData="dataFilter"/>
</template>

<script>
import AgentBoxFilter from "@/components/FpFilter/AgentFilter/LayoutResidence/AgentBoxFilter.vue";

export default {
  data() {
    return {
      inputFields: [{
        id: 'block',
        type: 'text',
        label: 'Block',
        boldLabel: true
      },
        {
          id: 'unit',
          type: 'text',
          label: 'Căn',
          boldLabel: true
        },
        {
          id: 'fromFloor',
          type: 'text',
          label: 'Từ tầng',
          boldLabel: true
        },
        {
          id: 'toFloor',
          type: 'text',
          label: 'Đến tầng',
          boldLabel: true
        }]
    }
  },
  components: {
    AgentBoxFilter
  },
  methods: {
    dataFilter(data) {
      this.$emit('floorBlockVal',data)
    }

  }
}
</script>