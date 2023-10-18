<template>
  <div class="row d-flex justify-content-between mt-3" v-if="!compact">
    <div class="col-6 border8" @click="onFurPick(false)">
      <div :class="{'button-blue-teal':!furniture && !hideCssCard}" :style="styleBtn"
           class="d-flex justify-content-between p-lg-3 px-1 py-2 border-1 border-gray border border8"><b class="small">Nội
        thất cơ bản</b>
        <FpIcon src-icon="NTCB.svg" :size="24"/>
      </div>
    </div>
    <div class="col-6" @click="onFurPick(true)">
      <div :class="{'button-blue-teal':furniture && !hideCssCard }" :style="styleBtn"
           class="d-flex justify-content-between p-lg-3 px-1 py-2 border-1 border-gray border border8"><b class="small">Full
        nội thất </b>
        <FpIcon src-icon="FNT.svg" :size="24"/>
      </div>
    </div>
  </div>
  <div class="row d-flex justify-content-between mt-3" v-if="compact">
    <FpLabelFormTemplate label-icon="FNT.svg" label="Loại nội thất" label-class="text-gray gray-svg">
      <template #comp>
        <div class="row  justify-content-around py-2 p-3">
          <div class="col-6" @click="onFurPick(false)">
            <div :class="{'button-blue-teal':!furniture && !hideCssCard}"
                 class="px-2 py-3 border border8  d-flex justify-content-between">
              <b class="small">Cơ bản</b>
              <span class=""><FpIcon src-icon="NTCB.svg" :size="24"/></span>

            </div>
          </div>
          <div class="col-6" @click="onFurPick(true)">
            <div :class="{'button-blue-teal':furniture && !hideCssCard }" class="px-2 py-3 border border8  d-flex justify-content-between"><b
                class="small">Đầy đủ</b>
              <FpIcon src-icon="FNT.svg" :size="24" class="col-auto mx-2"/>
            </div>
          </div>
        </div>
      </template>
    </FpLabelFormTemplate>

  </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";

export default {
  components: {FpLabelFormTemplate, FpIcon},
  methods: {
    getIconUrl,
    onFurPick(val) {
      this.furniture = val
      this.hideCssCard = false
    }
  },
  data() {
    return {
      hideCssCard: false,
      furniture: false
    }
  },
  mounted() {
    this.hideCssCard = this.emptyFirst
    this.furniture = this.fullFur
  },
  watch: {
    fullFur(newVal) {
      this.furniture = newVal
    },
    furniture(val) {
      this.$emit('furniturePick', val ? 'fully' : 'partly')
    },
  },
  props: {
    fullFur: {
      type: Boolean,
      required: true
    },
    styleBtn: {
      type: String,
    },
    emptyFirst: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  emits: ['furniturePick']

}
</script>