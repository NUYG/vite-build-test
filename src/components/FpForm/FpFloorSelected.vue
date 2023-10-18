<template>
  <div class="col-lg-10 col-12 d-flex justify-content-around p-2">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" :checked="height.includes('high')"
             @click="onHeightCheck('high')">
      <label class="form-check-label">
        Cao
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" :checked="height.includes('mid')"
             @click="onHeightCheck('mid')">
      <label class="form-check-label">
        Trung
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" :checked="height.includes('low')"
             @click="onHeightCheck('low')">
      <label class="form-check-label">
        Thấp
      </label>
    </div>
  </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";

export default {
  data() {
    return {
      height: []
    }
  },
  methods: {
    getIconUrl,
    onHeightCheck(floor) {
      if (this.height.includes(floor)) {
        this.height = this.height.filter(item => item !== floor);
      } else {
        this.height = this.height.concat(floor);
      }
      this.$emit('floorSelected',this.height)
    }
  },
  emits:['floorSelected'],
  props: {
    unitHeight: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
      this.height=this.unitHeight
  },
  watch:
  {
    unitHeight()
    {
      this.height=this.unitHeight
    }
  }
}
</script>