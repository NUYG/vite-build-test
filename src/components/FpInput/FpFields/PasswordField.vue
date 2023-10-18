<template>
  <div>
    <input :placeholder='placeholder' type="password" v-model="value" class="form-control" :class="validCheck"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      error: '',
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    validCheck() {
      return this.error === '' ? '' : (this.error ? 'is-valid' : 'is-invalid')
    }
  },
  methods: {
    isValidPassword() {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(.){8,}$/; // Tối thiểu 8 ký tự, bao gồm ít nhất 1 số và 1 chữ cái
      return regex.test(this.value);
    }
  },
  watch: {
    value(newValue) {
      if (this.required) {
        this.error = this.isValidPassword(newValue)
      }
      this.$emit('fieldVal', {[this.id]: newValue})
    }
  }
}
</script>