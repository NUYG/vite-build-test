<template>
  <div class="row d-flex flex-wrap p-lg-3 p-2">
    <div v-for="(val,index) in VIEW" :key="index"
         @click="onViewPick(val[0])" v-show="val[0] !==''"
         class="col-auto border border8 p-2 mt-2 me-2 ms-2 "
         :class="{'button-blue-teal': checkPickedView(val[0])}">
           {{ val[1] }}
    </div>
  </div>
</template>


<script>
import {VIEW} from "@/utils/TransContent";

export default {
  data() {
    return {
      VIEW,
      viewPick: '',
      viewSelected: []
    }
  },
  props: {
    defaultView: {
      type: Array,
      default: () => []
    },
    selectedOne: {
      type: Boolean,
      default: true
    }
  },
  emits: ['viewPick'],
  mounted() {
    this.viewSelected=this.defaultView
  },
  watch:{
    defaultView(newVal)
    {
      this.viewSelected=newVal
    }
  },
  methods: {
    onViewPick(view) {
      if (!this.selectedOne) {
        if (this.viewSelected.includes(view)) {
          this.viewSelected.splice(this.viewSelected.indexOf(view), 1);
        } else {
          if (this.viewSelected.length >= 3){
            this.viewSelected.splice(2, 1);
          }
          this.viewSelected.push(view);
        }
        this.$emit('viewPick', this.viewSelected)
      } else {
        this.viewSelected = this.viewSelected === view ? '' : view
        this.$emit('viewPick', view)
      }

    },
    checkPickedView(view) {
      if (this.selectedOne) {
        return view === this.viewSelected
      } else {
        return this.viewSelected.includes(view)
      }
    }
  }
}
</script>
