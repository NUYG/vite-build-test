<template>
  <label v-if="label" :class="{'fw-bold':boldLabel}" class="form-check-label" >{{label}}</label>
  <div class="form-switch">
    <input v-model="value" class="form-switch form-switch-xl form-check-input" type="checkbox">
  </div>
</template>

<script>
export default {
  props:{
      label:{
        type:String,
        default:''
      },
      boldLabel:{
        type:Boolean,
        default: false
      },
      id:{
        type:String,
        default:''
      }
  },
  data()
  {
    return {
      value:false
    }
  },
  emits:['switches'],
  watch:{
    value(newVal)
    {
      this.id ? this.$emit('switches',{[this.id]:newVal}) : this.$emit('switches',newVal)

    }
  }
}
</script>