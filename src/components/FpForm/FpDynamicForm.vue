<template>
  <Form @submit="handleSubmit" ref="form">
    <div v-for="{ as, name, label, ...attrs } in schema.fields" :key="name">
      <label :for="name">{{ label }}</label>
      <Field :as="as" :id="name" :name="name" v-bind="attrs" v-slot="{ field, errors }">
        <input v-if="as === 'input'" v-bind="field">
        <div v-if="errors.length" class="error-message">{{ errors[0] }}</div>
      </Field>
    </div>
    <button type="submit">Submit</button>
  </Form>
</template>
<script>
import { Form, Field, useForm } from 'vee-validate';
export default {
  name: 'DynamicForm',
  components: {
    Form,
    Field,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async handleSubmit(event) {
      event.preventDefault();

      try {
        await this.$refs.form.validate();

        const valid = await this.validateForm();
        if (valid) {
          console.log('Form submitted successfully');
        } else {
          console.log('Form has validation errors');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    async validateForm() {
      let isValid = true;
      for (const field of this.schema.fields) {
        try {
          await this.$refs.form.validate(field.name);
        } catch {
          isValid = false;
        }
      }
      return isValid;
    },
  },
};
</script>
<style>
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
