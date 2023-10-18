<template>
  <div>
    <div class='form-check form-check-inline' v-for='(item, index) in checkBoxVal' :key='index'>
      <input
        class='form-check-input'
        type='checkbox'
        :value='item[0]'
        :disabled='index === disabled'
        @change='handleCheckboxChange($event, item[0])'
      />
      <label class='form-check-label' :for='`inlineCheckbox${index}`'>{{ item[1] }}</label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedVal: '',
      checkedValue: {}
    }
  }, methods: {
    handleCheckboxChange(event, item) {
      this.checkedValues[item] = event.target.checked
      const checkedValues = Object.keys(this.checkedValues).filter(key => this.checkedValues[key])
      this.$emit('isChecked', checkedValues)
    }
  }, props: {
    checkBoxVal: {
      type: Array, default: () => ([])
    }, disabled: {
      type: Number, default: 2
    }
  }
}
</script>