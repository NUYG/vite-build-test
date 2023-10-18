<template>
  <div class="search-container h-100">
    <input v-model='search' @keyup.enter="emitData" type="text" class="search-input form-control" :class="inputClasses"
           :placeholder="placeholderInput" :style='inputStyle'>
    <FpIcon srcIcon="input-search.svg" class="search-icon" :size="16" :style="`opacity:${grayToOpacity(opacityIcon)}`"
            @click="emitData"></FpIcon>
    <span class="clear-icon" v-if="search&& search!==''" @click="clearSearch"><FpIcon srcIcon="times-solid.svg"
                                                                                      :size="12"></FpIcon></span>
  </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {grayToOpacity} from "@/utils/utils";

export default {
  props: {
    inputClasses:{
      type:String,
      default:'text-content'
    },
    defaultVal: {
      type: String
    },
    opacityIcon: {
      type: Number,
    },
    placeholderInput: {
      type: String,
      default: 'Search'
    },
    timeDebounce: {
      type: Number,
      default: 500,
    },
    realTimeSearch: {
      type: Boolean,
      default: false
    },
    inputStyle: {
      type: String,
    }
  },
  methods: {
    grayToOpacity,
    emitData() {
      this.$emit('searchVal', this.search)
    },
    clearSearch() {
      this.search = ''
      this.emitData()
    }
  },
  components: {FpIcon},
  data() {
    return {
      search: ''
    }
  },
  emits: ['searchVal', 'searchCancel'],
  watch:
     {
       defaultVal(newVal) {
         this.search = newVal
       },
       search(newVal) {
         if (newVal && this.realTimeSearch) {
           this.$emit('searchVal', newVal)
         }
       }
     }

}
</script>

<style scoped>
.search-container {
  position: relative;
}

.search-input {
  border-radius: 8px;
  padding: 5px 5px 5px 40px;
  display: block;
  width: 100%;
  color: #212529;
  background-color: #ebedee;
  background-clip: padding-box;
  border: 1px solid #ebedee;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
}

.search-input::placeholder {
  color: #000000;
}

.clear-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.clear-icon i {
  font-size: 16px;
  color: #6c757d;
}

</style>
