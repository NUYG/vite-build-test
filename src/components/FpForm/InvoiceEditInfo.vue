<template>
  <span class="col">
    <template v-if="editing && canEdit">
      <input class="form-control border-white" v-if="type === 'dateTime'" type="date" v-model="editedValue" @keyup.enter="saveField" @blur="cancelEditing">
      <input class="form-control border-white" v-else type="text" v-model="editedValue" @keyup.enter="saveField" @blur="cancelEditing">
    </template>
    <template v-else>
      <div v-if="canEdit && value" @click="startEditing">
        <div v-html="formattedValue"></div>
      </div>
      <span v-else-if="canEdit && !value" @click="startEditing" class="text-gray text-content">Chỉnh sửa</span>
      <div v-else>
        <div v-html="formattedValue"></div>
      </div>
    </template>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  computed: {
    formattedValue() {
      if (typeof this.value === 'string') {
        const values = this.value.split(',');
        const formattedValues = values.map((val) => val.trim());
        return formattedValues.join('<br>');
      }
      return '';
    }
  },
  data() {
    return {
      editing: false,
      editedValue: '',
    };
  },
  methods: {
    startEditing() {
      this.editing = true;
      this.editedValue = this.value;
    },
    saveField() {
      // Lưu giá trị chỉnh sửa vào đây
      this.editing = false;
    },
    cancelEditing() {
      this.editing = false;
    },
  },
};
</script>