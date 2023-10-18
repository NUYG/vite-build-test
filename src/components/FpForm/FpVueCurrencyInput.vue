<template>
  <input ref="inputRef" class="form-control" :class="inputClass" />
</template>

<script>
import { watch } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'
export default {
  name: 'CurrencyInput',
  props: {
    modelValue: Number,
    options: Object,
    inputClass:{
      type:String,
      default:'border-0'
    }
  },
  setup(props) {
    const { inputRef, setOptions, setValue } = useCurrencyInput(props.options,true)

    watch(
        () => props.modelValue,
        (value) => {
          setValue(value)
        }
    )

    watch(
        () => props.options,
        (options) => {
          setOptions(options)
        }
    )

    return { inputRef }
  }
}
</script>
