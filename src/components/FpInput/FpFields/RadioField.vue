<template>
  <div v-if="type === 'selectOne'">
    <label v-for="(item, index) in value" :key="index">
      {{ item }}
      <input
        :id="`radio${index}`"
        name="radio"
        type="radio"
        :disabled="index === disabled"
        :value="item"
        v-model="selectedVal"
      />
    </label>
  </div>
</template>


<script>
export default {
  data() {
    return {
      selectedVal: null
    }
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    type: {
      type: String,
      default: ''
    },
    disabled: {
      type: Number,
      default: -1
    }
  },
  watch: {
    selectedVal(newValue) {
    }
  }
}
</script>
