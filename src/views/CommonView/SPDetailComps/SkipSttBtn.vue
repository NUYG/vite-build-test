<template>
  <ButtonView :status="btnType" :content="nextBtnText" :textSize="textSize" class="col-auto" @click.stop="btnClick"/>
</template>

<script lang="js">


import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl} from "@/utils/utils";
import {nextSttLvl, setSugData, SPSttLvl} from "@/utils/saleProcess";
import {post} from "@/utils/dataQuery";
import {Roles} from "@/utils/constants";
import {NextBtnTxt} from "@/utils/spConstants";

export default {
  components: {ButtonView},
  data() {
    return {
      preventClick: false
    };
  },
  props: {
    spData: {
      type: Object,
      required: true,
    },
    btnType: {
      type: String,
      default: 'gray-btn',
    },
    textSize: {
      type: Number,
      default: 14,
    },
    preventOnclick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nextBtnText() {
      return NextBtnTxt[SPSttLvl(this.spData.peakStatus)];
    },
  },
  methods: {
    getIconUrl,
    btnClick() {
      if (!this.preventClick) {
        setSugData(this.spData, nextSttLvl(this.spData.peakStatus));
        this.skipProgressSP();
      }
    },
    async skipProgressSP() {
      const res = await post("/sale_process/skip_progress_sp_api", {
        ...this.spData,
        role: Roles.Sales,
        id: this.spData ? this.spData.id : -1,
        validate: this.spData,
      });
      // if (!res && res.succeed) {
      //   return;
      // }
      // window.alert('Qua buoc thanh cong')
    },
  },
  watch: {
    preventOnclick(newVal) {
      this.preventClick = newVal
    }
  },
  emits: [],
  mounted() {
    this.preventClick = this.preventOnclick
  }
}
</script>

<style scoped>
</style>
